import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// --- Attendance Chart ---
const attendanceData = [
    { day: 'Mon', active: 85, predicted: 88 },
    { day: 'Tue', active: 82, predicted: 86 },
    { day: 'Wed', active: 90, predicted: 89 },
    { day: 'Thu', active: 87, predicted: 85 },
    { day: 'Fri', active: 84, predicted: 82 },
];

export const AttendanceChart = () => (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceData}>
                <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="active" stroke="#00f3ff" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                <Area type="monotone" dataKey="predicted" stroke="#94a3b8" strokeDasharray="3 3" fill="none" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

// --- Resource Availability Chart ---
const resourceData = [
    { name: 'Textbooks', available: 90, required: 100 },
    { name: 'Tablets', available: 45, required: 80 },
    { name: 'Lab Kits', available: 30, required: 60 },
    { name: 'Wifi', available: 80, required: 80 },
];

export const ResourceChart = () => (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={resourceData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: '#334155', opacity: 0.2 }}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="available" fill="#00f3ff" radius={[0, 4, 4, 0]} name="Available" />
                <Bar dataKey="required" fill="#334155" radius={[0, 4, 4, 0]} name="Required" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

// --- Language Proficiency Chart ---
const langData = [
    { name: 'Beginner', value: 300 },
    { name: 'Intermediate', value: 450 },
    { name: 'Advanced', value: 200 },
];
const COLORS = ['#94a3b8', '#00f3ff', '#bc13fe'];

export const ProficiencyChart = () => (
    <div className="h-[250px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={langData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {langData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

// --- Issues Trend Chart ---
const issuesData = [
    { week: 'W1', resolved: 10, new: 15 },
    { week: 'W2', resolved: 18, new: 12 },
    { week: 'W3', resolved: 25, new: 8 },
    { week: 'W4', resolved: 30, new: 5 },
];

export const IssuesTrendChart = () => (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={issuesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Line type="monotone" dataKey="new" stroke="#ff9100" strokeWidth={2} dot={{ r: 4, fill: '#ff9100' }} />
                <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#22c55e' }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
