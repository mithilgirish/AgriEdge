import os
import uuid
import json
import logging
from datetime import datetime

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Supabase imports
from supabase import create_client, Client

# Gemini imports
import google.generativeai as genai

# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Retrieve required environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Validate environment variables
if not all([GEMINI_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
    logger.error("Missing required environment variables")
    raise ValueError("Required environment variables must be set")

# Configure Gemini with your API key
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# FastAPI app initialization
app = FastAPI(
    title="Agricultural AI Assistant Backend",
    description="AI-powered agricultural assistance with sensor data integration",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js default dev server
        "https://agri-edge.vercel.app"  # Your production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class QuestionRequest(BaseModel):
    question: str = Field(..., description="User's question")
    # Removed session_id from the request model

def generate_nlp_response(question: str, sensor_data: dict = None) -> str:
    """
    Generate a natural language response using Gemini.
    
    Args:
        question (str): User's question.
        sensor_data (Optional[dict]): Optional sensor data context.
    
    Returns:
        str: AI-generated response.
    """
    try:
        # Validate sensor data loading
        if sensor_data is None:
            sensor_data = {}
        
        # Improved logging for debugging
        logger.info(f"Generating response for question: {question}")
        logger.info(f"Sensor Data Context: {json.dumps(sensor_data, indent=2)}")
        
        # Prepare the prompt with context and guidelines
        full_prompt = f"""
        You are an agricultural AI assistant. Provide helpful, informative, and practical advice about farming, agriculture, and related topics.

        Sensor Data Context:
        {json.dumps(sensor_data, indent=2) if sensor_data else "No sensor data available."}

        Question: {question}

        Guidelines:
        - Give clear, concise, and actionable responses.
        - If the question is about sensor data, use the provided context.
        - If no specific context is available, provide general agricultural knowledge.
        - Support your answers with practical insights.
        """
        
        # Generate response using Gemini
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(full_prompt)
        
        # Validate response
        if not response or not response.text:
            logger.warning("Generated response is empty")
            return "I'm unable to generate a response at the moment. Please try again."
        
        return response.text
    except Exception as e:
        logger.error(f"Error generating AI response: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate AI response: {str(e)}")

def fetch_sensor_data(time_period: str = "24h") -> dict:
    """
    Fetch sensor data from Supabase for a given time period.
    
    Args:
        time_period (str): Time period for data retrieval (e.g., "24h", "7d", "30d").
    
    Returns:
        dict: Aggregated sensor data.
    """
    try:
        # Map time_period to SQL interval string
        interval_map = {
            "24h": "24 hours",
            "7d": "7 days",
            "30d": "30 days"
        }
        interval = interval_map.get(time_period, "24 hours")
        
        # SQL query to fetch aggregated sensor data with error handling
        query = supabase.table("sensordata").select(
            "AVG(temperature) as avg_temperature",
            "AVG(humidity) as avg_humidity", 
            "AVG(moisture) as avg_moisture",
            "MAX(inserted_at) as latest_reading"
        ).filter("inserted_at", "gte", f"NOW() - INTERVAL '{interval}'").execute()
        
        # Validate query results
        if not query.data:
            logger.warning(f"No sensor data found for interval: {interval}")
            return {}
        
        data = query.data[0]
        
        # Validate and round data
        processed_data = {}
        for key, value in data.items():
            if value is not None:
                processed_data[key] = round(value, 2) if isinstance(value, float) else value
        
        logger.info(f"Processed Sensor Data: {json.dumps(processed_data, indent=2)}")
        return processed_data
    
    except Exception as e:
        logger.error(f"Error fetching sensor data: {e}")
        return {}

# API Endpoints
@app.post("/ask")
async def ask_question(request: QuestionRequest):
    """
    Process a user's question and generate an AI response.
    """
    try:
        # Fetch sensor data for additional context
        sensor_data = fetch_sensor_data()
        
        # Generate the AI response using Gemini
        answer = generate_nlp_response(request.question, sensor_data)
        
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Question processing error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process question")

# Custom error handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body}
    )

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)