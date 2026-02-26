import React, { useState, useEffect, useMemo } from 'react';
import {
    Calendar as CalendarIcon,
    CheckCircle,
    Clock,
    Filter,
    ShieldCheck,
    CheckSquare,
    XSquare,
    AlertCircle,
    Users,
    UserCheck,
    UserX,
    Activity,
    AlertTriangle
} from 'lucide-react';
import api from '../api/useService';

const AttendancePage = () => {
    const [employees, setEmployees] = useState([]);
    const [allRecords, setAllRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        employee: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
    });
    const [submitting, setSubmitting] = useState(false);
    const [filterEmployeeId, setFilterEmployeeId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchEmployees(), fetchAttendance()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('employees/');
            setEmployees(res.data);
        } catch (err) {
            console.error("Failed to fetch employees", err);
        }
    };

    const fetchAttendance = async () => {
        try {
            const res = await api.get('attendance/');
            setAllRecords(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch attendance records from server.');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await api.post('attendance/', formData);
            await fetchAttendance();
            alert("Attendance successfully recorded!");
        } catch (err) {
            if (err.response?.data) {
                const errorMsg = Object.values(err.response.data).flat().join(' ');
                setError(errorMsg || 'Failed to mark attendance.');
            } else {
                setError('An unexpected error occurred. Please verify data.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate Dashboard Stats
    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];

        // Find today's unique records (use the most recent record per employee if duplicates exist)
        const todayRecordsMap = new Map();
        allRecords.forEach(record => {
            // Take only the date part to compare with today's date
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

    // Frontend Filtering
    const filteredRecords = useMemo(() => {
        if (!filterEmployeeId) return allRecords;
        return allRecords.filter(record => String(record.employee_id) === String(filterEmployeeId));
    }, [allRecords, filterEmployeeId]);

    const getStatusStyles = (status) => {
        if (status === 'Present') return {
            bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/60', icon: <CheckCircle size={14} className="mr-1.5" />
        };
        if (status === 'Absent') return {
            bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200/60', icon: <XSquare size={14} className="mr-1.5" />
        };
        return {
            bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: null
        };
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">Attendance Dashboard</h2>
                    <p className="text-slate-500 mt-1">Monitor daily workforce presence and statistics.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <CalendarIcon size={18} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">
                        Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl shadow-sm flex items-start gap-3" role="alert">
                    <AlertCircle className="shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-semibold text-sm">Action Required</p>
                        <p className="text-sm mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-slate-500">Total Employees</h3>
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <Users size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stats.totalEmployees}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-slate-500">Present Today</h3>
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <UserCheck size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stats.presentCount}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-slate-500">Absent Today</h3>
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                                <UserX size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stats.absentCount}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-slate-500">Pending Marker</h3>
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                <Clock size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-800">{stats.pendingCount}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group col-span-2 lg:col-span-1">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-slate-500">Attendance Rate</h3>
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Activity size={16} />
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold text-slate-800">{stats.attendanceRate}%</p>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${stats.attendanceRate}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* MARK ATTENDANCE */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:sticky lg:top-24 transition-shadow hover:shadow-md">
                        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <CheckSquare size={18} />
                                </div>
                                Record Entry
                            </h3>
                        </div>

                        <div className="p-4 sm:p-5 bg-white">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 block">Select Employee</label>
                                    <select
                                        name="employee"
                                        value={formData.employee}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled className="text-slate-400">Choose a team member...</option>
                                        {employees.map(emp => (
                                            <option key={emp.employeeId} value={emp.employeeId}>
                                                {emp.fullName} ({emp.employeeId})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 block">Record Date</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                            <CalendarIcon size={18} />
                                        </div>
                                        <input
                                            type="date"
                                            name="date"
                                            max={new Date().toISOString().split('T')[0]}
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-slate-800 cursor-pointer"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <label className="text-sm font-medium text-slate-700 block">Attendance Status</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className={`
                                            cursor-pointer flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] group
                                            ${formData.status === 'Present'
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/10'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-600'}
                                        `}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Present"
                                                checked={formData.status === 'Present'}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`p-2 rounded-full mb-2 ${formData.status === 'Present' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:text-slate-500'}`}>
                                                <ShieldCheck size={20} />
                                            </div>
                                            <span className="font-semibold text-sm">Present</span>
                                        </label>

                                        <label className={`
                                            cursor-pointer flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] group
                                            ${formData.status === 'Absent'
                                                ? 'border-red-500 bg-red-50 text-red-700 shadow-md shadow-red-500/10'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-600'}
                                        `}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Absent"
                                                checked={formData.status === 'Absent'}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`p-2 rounded-full mb-2 ${formData.status === 'Absent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400 group-hover:text-slate-500'}`}>
                                                <XSquare size={20} />
                                            </div>
                                            <span className="font-semibold text-sm">Absent</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-3">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2.5 px-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <CheckCircle size={18} />
                                        )}
                                        <span>{submitting ? 'Recording...' : 'Save Attendance Log'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* RECORDS TABLE */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md min-h-[500px]">
                        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <Clock size={18} />
                                </div>
                                Recent Logs
                            </h3>

                            <div className="relative w-full sm:w-auto">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Filter size={16} />
                                </div>
                                <select
                                    value={filterEmployeeId}
                                    onChange={(e) => setFilterEmployeeId(e.target.value)}
                                    className="w-full sm:w-64 pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-700 shadow-sm appearance-none cursor-pointer hover:bg-slate-50"
                                >
                                    <option value="">Sort: All Team Members</option>
                                    {employees.map(emp => (
                                        <option key={`filter-${emp.employeeId}`} value={emp.employeeId}>
                                            {emp.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 p-0 overflow-hidden flex flex-col bg-white">
                            {loading ? (
                                <div className="flex-1 flex items-center justify-center p-12">
                                    <div className="flex flex-col items-center gap-4 text-slate-400">
                                        <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
                                        <p className="font-medium text-sm tracking-wide">Fetching logs...</p>
                                    </div>
                                </div>
                            ) : filteredRecords.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center p-8 sm:p-12 text-center bg-slate-50/30">
                                    <div className="flex flex-col items-center gap-4 max-w-sm">
                                        <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shadow-inner">
                                            <AlertTriangle size={32} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-slate-800">No Records Found</h4>
                                            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">We couldn't track any attendance logs for the current criteria.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-200">
                                                <th className="px-6 py-4">Timeline Date</th>
                                                <th className="px-6 py-4">Employee Information</th>
                                                <th className="px-6 py-4 text-right">Attendance Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {filteredRecords.map(record => {
                                                const style = getStatusStyles(record.status);
                                                const dateObj = new Date(record.date);
                                                const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

                                                return (
                                                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-700 shadow-sm group-hover:bg-white transition-colors">
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                                                                    <span className="font-bold leading-none mt-1">{dateObj.getDate()}</span>
                                                                </div>
                                                                <span className="font-medium text-slate-700">{displayDate}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="font-semibold text-slate-800 text-base">{record.employee_name}</p>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                                <p className="text-xs text-slate-500 font-medium tracking-wide">{record.employee_id}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-bold border ${style.bg} ${style.text} ${style.border} shadow-sm transition-transform hover:scale-105`}>
                                                                {style.icon}
                                                                {record.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AttendancePage;

