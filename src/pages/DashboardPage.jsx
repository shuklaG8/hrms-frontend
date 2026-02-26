import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    UserCheck,
    UserX,
    Activity,
    ArrowRight,
    Plus
} from 'lucide-react';
import api from '../api/useService';

const DashboardPage = () => {
    const [employees, setEmployees] = useState([]);
    const [allRecords, setAllRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [empRes, attRes] = await Promise.all([
                    api.get('employees/'),
                    api.get('attendance/')
                ]);
                setEmployees(empRes.data);
                setAllRecords(attRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate Dashboard Stats
    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];

        // Find today's unique records (use the most recent record per employee if duplicates exist)
        const todayRecordsMap = new Map();
        allRecords.forEach(record => {
            const recordDate = record.date.split('T')[0];
            if (recordDate === today) {
                todayRecordsMap.set(String(record.employee_id), record);
            }
        });

        const todayLogs = Array.from(todayRecordsMap.values());

        const presentCount = todayLogs.filter(r => r.status === 'Present').length;
        const absentCount = todayLogs.filter(r => r.status === 'Absent').length;
        const totalEmployees = employees.length;
        const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;
        const pendingCount = Math.max(0, totalEmployees - todayLogs.length);

        return {
            totalEmployees,
            presentCount,
            absentCount,
            attendanceRate,
            pendingCount
        };
    }, [allRecords, employees]);

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12 min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="font-medium text-sm tracking-wide">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 max-w-6xl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard</h2>
                    <p className="text-slate-500 mt-1">{currentDate}</p>
                </div>
                <div>
                    <Link
                        to="/employees"
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-indigo-500/20"
                    >
                        <Plus size={18} />
                        Add Employee
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Employees */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <Users size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-800 leading-none">{stats.totalEmployees}</p>
                        <p className="text-sm font-medium text-slate-500 mt-1.5">Total Employees</p>
                    </div>
                </div>

                {/* Present Today */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                        <UserCheck size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-800 leading-none">{stats.presentCount}</p>
                        <p className="text-sm font-medium text-slate-500 mt-1.5">Present Today</p>
                    </div>
                </div>

                {/* Absent Today */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-400 shrink-0">
                        <UserX size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-800 leading-none">{stats.absentCount}</p>
                        <p className="text-sm font-medium text-slate-500 mt-1.5">Absent Today</p>
                    </div>
                </div>

                {/* Attendance Rate */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <Activity size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-800 leading-none">{stats.attendanceRate}%</p>
                        <p className="text-sm font-medium text-slate-500 mt-1.5">Attendance Rate</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">

                {/* Manage Employees Card */}
                <Link to="/employees" className="group block">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group-hover:border-blue-100 h-full flex flex-col justify-center relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Manage Employees</h3>
                                <p className="text-slate-500 text-sm mt-1">View, add, or remove employee records</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Mark Attendance Card */}
                <Link to="/attendance" className="group block">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group-hover:border-indigo-100 h-full flex flex-col justify-center relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Mark Attendance</h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    {stats.pendingCount > 0
                                        ? `${stats.pendingCount} employees not marked yet`
                                        : 'All employees marked for today'}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors shrink-0">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
};

export default DashboardPage;
