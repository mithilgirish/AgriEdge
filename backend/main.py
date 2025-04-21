import os
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
import uvicorn
import pandas as pd

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

# Define fallback dataset (sample sensor data)
SAMPLE_SENSOR_DATA = [
    {"ID": 1, "Temperature": 37.8, "Humidity": 87.8, "Moisture": 37.45, "Motor_State": "ON"},
    {"ID": 2, "Temperature": 37.9, "Humidity": 87.6, "Moisture": 95.07, "Motor_State": "ON"},
    {"ID": 3, "Temperature": 38.1, "Humidity": 87.0, "Moisture": 73.2, "Motor_State": "OFF"},
    {"ID": 4, "Temperature": 38.3, "Humidity": 86.6, "Moisture": 59.87, "Motor_State": "OFF"},
    {"ID": 5, "Temperature": 38.4, "Humidity": 85.7, "Moisture": 15.6, "Motor_State": "OFF"},
    {"ID": 6, "Temperature": 38.6, "Humidity": 85.4, "Moisture": 15.6, "Motor_State": "OFF"},
    {"ID": 7, "Temperature": 38.8, "Humidity": 84.3, "Moisture": 5.81, "Motor_State": "OFF"},
    {"ID": 8, "Temperature": 39.0, "Humidity": 83.4, "Moisture": 86.62, "Motor_State": "ON"},
    {"ID": 9, "Temperature": 39.2, "Humidity": 82.5, "Moisture": 60.11, "Motor_State": "OFF"},
    {"ID": 10, "Temperature": 39.4, "Humidity": 82.2, "Moisture": 70.81, "Motor_State": "OFF"},
    {"ID": 11, "Temperature": 39.7, "Humidity": 81.4, "Moisture": 2.06, "Motor_State": "ON"},
    {"ID": 12, "Temperature": 39.9, "Humidity": 78.4, "Moisture": 96.99, "Motor_State": "OFF"},
    {"ID": 13, "Temperature": 40.2, "Humidity": 79.6, "Moisture": 83.24, "Motor_State": "ON"},
    {"ID": 14, "Temperature": 40.5, "Humidity": 79.3, "Moisture": 21.23, "Motor_State": "OFF"},
    {"ID": 15, "Temperature": 41.0, "Humidity": 79.4, "Moisture": 18.18, "Motor_State": "ON"},
    {"ID": 16, "Temperature": 41.5, "Humidity": 76.3, "Moisture": 18.34, "Motor_State": "OFF"},
    {"ID": 17, "Temperature": 41.7, "Humidity": 78.6, "Moisture": 30.42, "Motor_State": "OFF"},
    {"ID": 18, "Temperature": 42.3, "Humidity": 76.9, "Moisture": 52.48, "Motor_State": "ON"},
    {"ID": 19, "Temperature": 42.6, "Humidity": 80.9, "Moisture": 43.19, "Motor_State": "ON"},
    {"ID": 20, "Temperature": 43.2, "Humidity": 83.1, "Moisture": 29.12, "Motor_State": "ON"}
]

# Request models
class QuestionRequest(BaseModel):
    question: str = Field(..., description="User's question")
    language: str = Field("english", description="Language for response")

# Map of language codes to Gemini language instructions
LANGUAGE_MAP = {
    "english": "Respond in English.",
    "hindi": "Respond in Hindi (हिन्दी).",
    "tamil": "Respond in Tamil (தமிழ்).",
    "telugu": "Respond in Telugu (తెలుగు).",
    "malayalam": "Respond in Malayalam (മലയാളം).",
    "punjabi": "Respond in Punjabi (ਪੰਜਾਬੀ).",
    "marathi": "Respond in Marathi (मराठी).",
    "kannada": "Respond in Kannada (ಕನ್ನಡ)."
}

def analyze_sample_data():
    """
    Analyze the sample sensor data to provide useful insights.
    
    Returns:
        dict: Aggregated sensor data insights.
    """
    df = pd.DataFrame(SAMPLE_SENSOR_DATA)
    
    # Calculate aggregated statistics
    analysis = {
        "avg_temperature": round(df["Temperature"].mean(), 2),
        "avg_humidity": round(df["Humidity"].mean(), 2),
        "avg_moisture": round(df["Moisture"].mean(), 2),
        "max_temperature": round(df["Temperature"].max(), 2),
        "min_temperature": round(df["Temperature"].min(), 2),
        "max_humidity": round(df["Humidity"].max(), 2),
        "min_humidity": round(df["Humidity"].min(), 2),
        "max_moisture": round(df["Moisture"].max(), 2),
        "min_moisture": round(df["Moisture"].min(), 2),
        "motor_on_percentage": round((df["Motor_State"] == "ON").mean() * 100, 2),
        "latest_reading": datetime.now().isoformat(),
        "sample_data": True,
        "total_records": len(df)
    }
    
    # Analyze patterns
    temp_trend = "increasing" if df["Temperature"].iloc[-1] > df["Temperature"].iloc[0] else "decreasing"
    humidity_trend = "increasing" if df["Humidity"].iloc[-1] > df["Humidity"].iloc[0] else "decreasing"
    moisture_trend = "fluctuating" # Moisture tends to fluctuate in the sample data
    
    analysis["temperature_trend"] = temp_trend
    analysis["humidity_trend"] = humidity_trend 
    analysis["moisture_trend"] = moisture_trend
    
    # Determine moisture conditions
    if analysis["avg_moisture"] < 20:
        analysis["moisture_condition"] = "dry"
    elif analysis["avg_moisture"] < 50:
        analysis["moisture_condition"] = "moderate"
    else:
        analysis["moisture_condition"] = "moist"
    
    return analysis

def generate_nlp_response(question: str, language: str = "english", sensor_data: dict = None) -> str:
    """
    Generate a natural language response using Gemini.
    
    Args:
        question (str): User's question.
        language (str): Language code for response.
        sensor_data (Optional[dict]): Optional sensor data context.
    
    Returns:
        str: AI-generated response.
    """
    try:
        # Validate sensor data loading
        if sensor_data is None or not sensor_data:
            logger.info("No sensor data available from database. Using sample data.")
            sensor_data = analyze_sample_data()
            
        # Add raw sample data for reference
        if "sample_data" in sensor_data and sensor_data["sample_data"]:
            sensor_data["raw_readings"] = SAMPLE_SENSOR_DATA[-5:]  # Add the last 5 readings
        
        # Get language instruction
        language_instruction = LANGUAGE_MAP.get(language.lower(), LANGUAGE_MAP["english"])
        
        # Improved logging for debugging
        logger.info(f"Generating response for question: {question}")
        logger.info(f"Language: {language}")
        logger.info(f"Sensor Data Context: {json.dumps(sensor_data, indent=2)}")
        
        # Prepare the prompt with context and guidelines
        full_prompt = f"""
        You are an agricultural AI assistant. Provide helpful, informative, and practical advice about farming, agriculture, and related topics.

        Sensor Data Context:
        {json.dumps(sensor_data, indent=2)}

        Question: {question}

        Guidelines:
        - Give clear, concise, and actionable responses.
        - Use the provided sensor data context to inform your answers.
        - Provide specific insights based on temperature, humidity, and moisture readings.
        - Consider the trends in the data to make recommendations.
        - If the soil moisture is low (< 20%), suggest irrigation may be needed.
        - If temperature is trending high with low moisture, warn about potential drought stress.
        - If humidity is high (> 85%) with high moisture, mention potential fungal disease risk.
        - Support your answers with practical insights from the data.
        - {language_instruction}
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
        if not query.data or len(query.data) == 0 or query.data[0].get("avg_temperature") is None:
            logger.warning(f"No sensor data found for interval: {interval}. Using sample data instead.")
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
    Process a user's question and generate an AI response in the specified language.
    """
    try:
        # Fetch sensor data for additional context
        sensor_data = fetch_sensor_data()
        
        # Generate the AI response using Gemini in the requested language
        answer = generate_nlp_response(
            question=request.question,
            language=request.language,
            sensor_data=sensor_data
        )
        
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Question processing error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process question")

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify API is running.
    """
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Sample data access endpoint
@app.get("/sample-data")
async def get_sample_data():
    """
    Return the sample sensor data for analysis.
    """
    analysis = analyze_sample_data()
    return {
        "sample_data": SAMPLE_SENSOR_DATA,
        "analysis": analysis
    }

# Custom error handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body}
    )

# Run the app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)