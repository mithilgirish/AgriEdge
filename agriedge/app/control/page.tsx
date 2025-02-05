"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Zap, Clock, Droplets } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';



export default function IrrigationControlPage() {
    const { showToast } = useToast();
    const [controlMode, setControlMode] = useState<'manual' | 'auto'>('manual');
    const [pumpStatus, setPumpStatus] = useState(false);
    const [moistureThreshold, setMoistureThreshold] = useState(30);
    const [scheduleFrequency, setScheduleFrequency] = useState('daily');
    const [scheduleTime, setScheduleTime] = useState('08:00');
    const [currentMoisture, setCurrentMoisture] = useState(35);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentMoisture(prev => Math.max(20, Math.min(80, prev + Math.random() * 10 - 5)));
      }, 5000);
  
      return () => clearInterval(interval);
    }, []);
  
    const handleStartIrrigation = () => {
      setPumpStatus(true);
      showToast("Irrigation Started: The pump has been activated manually.");
    };
  
    const handleStopIrrigation = () => {
      setPumpStatus(false);
      showToast("Irrigation Stopped: The pump has been deactivated manually.");
    };
  
    const handleSaveSettings = () => {
      showToast(`Settings Saved: Automated irrigation set: Threshold ${moistureThreshold}%, ${scheduleFrequency} at ${scheduleTime}`);
    };
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Irrigation Control</h1>

      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Control Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Switch
              checked={controlMode === 'auto'}
              onCheckedChange={(checked) => setControlMode(checked ? 'auto' : 'manual')}
            />
            <span className="font-medium">
              {controlMode === 'auto' ? 'Automatic' : 'Manual'}
            </span>
          </div>
        </CardContent>
      </Card>

      {controlMode === 'manual' ? (
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Manual Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Current Soil Moisture:</span>
              <span className="text-2xl font-bold">{currentMoisture.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Pump Status:</span>
              <span className={`text-2xl font-bold ${pumpStatus ? 'text-green-600' : 'text-red-600'}`}>
                {pumpStatus ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStartIrrigation}
                className="bg-green-600 hover:bg-green-700"
                disabled={pumpStatus}
              >
                Start Irrigation
              </Button>
              <Button
                onClick={handleStopIrrigation}
                className="bg-red-600 hover:bg-red-700"
                disabled={!pumpStatus}
              >
                Stop Irrigation
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              Automated Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium">Moisture Threshold</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[moistureThreshold]}
                  onValueChange={(value) => setMoistureThreshold(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-right">{moistureThreshold}%</span>
              </div>
              <p className="text-sm text-gray-500">
                Irrigation will start when soil moisture falls below this threshold.
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-medium">Watering Schedule</label>
              <div className="flex gap-4">
                <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              Confirm & Save Settings
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

