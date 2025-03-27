"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Zap, Clock, Droplets } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

// Ensure environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing!");
}

// Create Supabase client outside the component
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function IrrigationControlPage() {
  const { showToast } = useToast();
  const [controlMode, setControlMode] = useState("manual");
  const [pumpStatus, setPumpStatus] = useState(false);
  const [moistureThreshold, setMoistureThreshold] = useState(30);
  const [scheduleFrequency, setScheduleFrequency] = useState("daily");
  const [scheduleTime, setScheduleTime] = useState("08:00");
  const [currentMoisture, setCurrentMoisture] = useState<number | null>(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      const { data, error } = await supabase
        .from("SensorData")
        .select("moisture")
        .order("inserted_at", { ascending: false }) // Fixed column name
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching sensor data:", error.message);
        return;
      }
      setCurrentMoisture(data?.moisture || 0);
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartIrrigation = async () => {
    setPumpStatus(true);
    showToast("Irrigation Started: Pump activated.");
    const { error } = await supabase.from("PumpControl").insert([{ status: "on" }]);
    if (error) console.error("Error starting irrigation:", error.message);
  };

  const handleStopIrrigation = async () => {
    setPumpStatus(false);
    showToast("Irrigation Stopped: Pump deactivated.");
    const { error } = await supabase.from("PumpControl").insert([{ status: "off" }]);
    if (error) console.error("Error stopping irrigation:", error.message);
  };

  const handleSaveSettings = async () => {
    showToast(`Settings Saved: Threshold ${moistureThreshold}%, ${scheduleFrequency} at ${scheduleTime}`);
    const { error } = await supabase.from("IrrigationSettings").upsert([
      {
        id: 1,
        control_mode: controlMode,
        moisture_threshold: moistureThreshold,
        schedule_frequency: scheduleFrequency,
        schedule_time: scheduleTime,
      },
    ]);
    if (error) console.error("Error saving settings:", error.message);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Irrigation Control</h1>

      {/* Control Mode */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> Control Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Switch checked={controlMode === "auto"} onCheckedChange={(checked) => setControlMode(checked ? "auto" : "manual")} />
            <span className="font-medium">{controlMode === "auto" ? "Automatic" : "Manual"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Manual Control */}
      {controlMode === "manual" ? (
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" /> Manual Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Soil Moisture:</span>
              <span className="text-2xl font-bold">
                {currentMoisture !== null ? `${currentMoisture.toFixed(1)}%` : "Loading..."}
              </span>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={handleStartIrrigation} disabled={pumpStatus}>
                Start Irrigation
              </Button>
              <Button onClick={handleStopIrrigation} disabled={!pumpStatus}>
                Stop Irrigation
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Automated Control */
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" /> Automated Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Moisture Threshold */}
            <div>
              <span className="font-medium">Moisture Threshold:</span>
              <Slider value={[moistureThreshold]} onValueChange={(value) => setMoistureThreshold(value[0])} min={10} max={60} step={1} />
            </div>

            {/* Schedule Frequency */}
            <div>
              <span className="font-medium">Schedule Frequency:</span>
              <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Schedule Time */}
            <div>
              <span className="font-medium">Schedule Time:</span>
              <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="border rounded p-2 w-full" />
            </div>

            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
