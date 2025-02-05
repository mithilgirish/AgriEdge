"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';
import { 
  Thermometer, 
  Droplets, 
  Leaf, 
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function DashboardPage() {
  const [pumpStatus, setPumpStatus] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Mock data
  const sensorData = [
    { time: '00:00', moisture: 45, temp: 22, humidity: 65 },
    { time: '04:00', moisture: 42, temp: 21, humidity: 68 },
    { time: '08:00', moisture: 38, temp: 24, humidity: 62 },
    { time: '12:00', moisture: 35, temp: 27, humidity: 58 },
    { time: '16:00', moisture: 41, temp: 25, humidity: 63 },
    { time: '20:00', moisture: 47, temp: 23, humidity: 67 },
  ];

  const pumpData = [
    { day: 'Mon', duration: 15 },
    { day: 'Tue', duration: 25 },
    { day: 'Wed', duration: 20 },
    { day: 'Thu', duration: 18 },
    { day: 'Fri', duration: 22 },
    { day: 'Sat', duration: 12 },
    { day: 'Sun', duration: 8 },
  ];

  

  return (
    <div className="p-6 space-y-6">
      {/* Status Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Farm Monitoring Dashboard</h1>
        <div className={`flex items-center gap-2 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
          {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          <span className="font-medium">
            ESP32 {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Live Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Temperature
            </CardTitle>
            <Thermometer className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24°C</div>
            <div className="text-sm text-gray-500 mt-1">±0.5°C accuracy</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Humidity
            </CardTitle>
            <Droplets className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">65%</div>
            <div className="text-sm text-gray-500 mt-1">Indoor equivalent</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Soil Moisture
            </CardTitle>
            <Leaf className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42%</div>
            <div className="text-sm text-gray-500 mt-1">Field capacity</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Water Pump
            </CardTitle>
            <Zap className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${pumpStatus ? 'text-green-600' : 'text-gray-400'}`}>
                {pumpStatus ? 'ON' : 'OFF'}
              </div>
              <Switch
                checked={pumpStatus}
                onCheckedChange={setPumpStatus}
                disabled={!isOnline}
              />
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {!isOnline && 'Device offline'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphical Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Moisture Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis unit="%" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="moisture" 
                  stroke="#10b981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Pump Usage History</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pumpData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis unit="min" />
                <Tooltip />
                <Bar 
                  dataKey="duration" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}