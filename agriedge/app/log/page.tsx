"use client";

import { SetStateAction, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, Search, Calendar as CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Log {
  id: number;
  date: string;
  time: string;
  moisture: number;
  status: 'ON' | 'OFF';
  duration: number;
}

const mockLogs: Log[] = [
    { "id": 1, "date": "2025-02-01", "time": "08:15", "moisture": 42, "status": "ON", "duration": 25 },
    { "id": 2, "date": "2025-02-01", "time": "14:30", "moisture": 58, "status": "OFF", "duration": 0 },
    { "id": 3, "date": "2025-02-01", "time": "19:45", "moisture": 29, "status": "ON", "duration": 18 },
    { "id": 4, "date": "2025-02-02", "time": "11:00", "moisture": 35, "status": "ON", "duration": 22 },
    { "id": 5, "date": "2025-02-02", "time": "16:20", "moisture": 62, "status": "OFF", "duration": 0 },
    { "id": 6, "date": "2025-02-03", "time": "09:35", "moisture": 48, "status": "ON", "duration": 15 },
    { "id": 7, "date": "2025-02-03", "time": "15:50", "moisture": 25, "status": "OFF", "duration": 0 },
    { "id": 8, "date": "2025-02-04", "time": "07:05", "moisture": 51, "status": "ON", "duration": 28 },
    { "id": 9, "date": "2025-02-04", "time": "13:25", "moisture": 38, "status": "OFF", "duration": 0 },
    { "id": 10, "date": "2025-02-04", "time": "20:10", "moisture": 65, "status": "ON", "duration": 20 },
    { "id": 11, "date": "2025-02-05", "time": "06:40", "moisture": 22, "status": "ON", "duration": 32 },
    { "id": 12, "date": "2025-02-05", "time": "12:55", "moisture": 55, "status": "OFF", "duration": 0 },
    { "id": 13, "date": "2025-02-05", "time": "18:35", "moisture": 31, "status": "ON", "duration": 12 },
    { "id": 14, "date": "2025-02-05", "time": "22:20", "moisture": 68, "status": "OFF", "duration": 0 },
    { "id": 15, "date": "2025-02-06", "time": "05:10", "moisture": 45, "status": "ON", "duration": 27 },
    { "id": 16, "date": "2025-02-06", "time": "11:40", "moisture": 28, "status": "OFF", "duration": 0 },
    { "id": 17, "date": "2025-02-06", "time": "17:00", "moisture": 52, "status": "ON", "duration": 19 },
    { "id": 18, "date": "2025-02-06", "time": "21:30", "moisture": 35, "status": "OFF", "duration": 0 },
    { "id": 19, "date": "2025-02-01", "time": "16:55", "moisture": 60, "status": "ON", "duration": 21 },
    { "id": 20, "date": "2025-02-02", "time": "07:20", "moisture": 27, "status": "OFF", "duration": 0 },
    { "id": 21, "date": "2025-02-02", "time": "12:45", "moisture": 53, "status": "ON", "duration": 17 },
    { "id": 22, "date": "2025-02-03", "time": "18:15", "moisture": 30, "status": "OFF", "duration": 0 },
    { "id": 23, "date": "2025-02-04", "time": "09:50", "moisture": 46, "status": "ON", "duration": 24 },
    { "id": 24, "date": "2025-02-04", "time": "15:25", "moisture": 61, "status": "OFF", "duration": 0 },
    { "id": 25, "date": "2025-02-05", "time": "08:55", "moisture": 23, "status": "ON", "duration": 15 },
    { "id": 26, "date": "2025-02-05", "time": "14:10", "moisture": 57, "status": "OFF", "duration": 0 },
    { "id": 27, "date": "2025-02-05", "time": "20:40", "moisture": 34, "status": "ON", "duration": 30 },
    { "id": 28, "date": "2025-02-06", "time": "07:30", "moisture": 40, "status": "ON", "duration": 22 },
    { "id": 29, "date": "2025-02-06", "time": "13:50", "moisture": 64, "status": "OFF", "duration": 0 },
    { "id": 30, "date": "2025-02-06", "time": "19:20", "moisture": 26, "status": "ON", "duration": 18 },
    { "id": 31, "date": "2025-02-01", "time": "12:05", "moisture": 55, "status": "ON", "duration": 23 },
    { "id": 32, "date": "2025-02-02", "time": "17:35", "moisture": 32, "status": "OFF", "duration": 0 },
    { "id": 33, "date": "2025-02-03", "time": "08:40", "moisture": 49, "status": "ON", "duration": 16 },
    { "id": 34, "date": "2025-02-03", "time": "15:00", "moisture": 66, "status": "OFF", "duration": 0 },
    { "id": 35, "date": "2025-02-04", "time": "10:25", "moisture": 21, "status": "ON", "duration": 29 },
    { "id": 36, "date": "2025-02-04", "time": "16:45", "moisture": 59, "status": "OFF", "duration": 0 },
];

export default function LogPage() {
  const [date, setDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFrame, setTimeFrame] = useState('all');

  const filteredLogs = mockLogs.filter(log => {
    const matchesDate = !date || log.date === format(date, 'yyyy-MM-dd');
    const matchesSearch = Object.values(log).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesDate && matchesSearch;
  });

  const downloadCSV = () => {
    const csvContent = [
      'Date,Time,Moisture Level,Pump Status,Duration',
      ...filteredLogs.map(log => 
        `${log.date},${log.time},${log.moisture}%,${log.status},${log.duration}m`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `irrigation_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Irrigation Logs</h1>
        <Button onClick={downloadCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            className="pl-9"
            value={searchTerm}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Moisture Level</TableHead>
              <TableHead>Pump Status</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.date}</TableCell>
                <TableCell>{log.time}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${log.moisture}%` }}
                      />
                    </div>
                    {log.moisture}%
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    log.status === 'ON' 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  )}>
                    {log.status}
                  </span>
                </TableCell>
                <TableCell>{log.duration}m</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No logs found
          </div>
        )}
      </div>
    </div>
  );
}