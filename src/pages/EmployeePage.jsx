import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, UserCircle, Briefcase, Mail, Hash, Users, AlertCircle } from 'lucide-react';
import api from '../api/useService';

const EmployeePage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        employeeId: '',
        fullName: '',
        email: '',
        department: ''
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await api.get('employees/');
            setEmployees(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to load employees. Please make sure the backend server is running.');
        } finally {
            setLoading(false);
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
            await api.post('employees/', formData);
            setFormData({ employeeId: '', fullName: '', email: '', department: '' });
            fetchEmployees();
        } catch (err) {
            if (err.response?.data) {
                // Handle Django DRF validation errors
                const errorMsg = Object.values(err.response.data).flat().join(' ');
                setError(errorMsg || 'Failed to add employee.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm('Are you sure you want to permanently delete this employee?')) {
            try {
                await api.delete(`employees/${employeeId}/`);
                fetchEmployees();
            } catch (err) {
                setError('Failed to delete employee. They might have attendance records attached.');
            }
        }
    };

    return (
        <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">Employees</h2>
                    <p className="text-slate-500 text-sm sm:text-base mt-1">Manage your team members and directory</p>
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

                {/* ADD EMPLOYEE FORM */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit transition-shadow hover:shadow-md">
                        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <UserPlus size={18} />
                                </div>
                                Add Employee
                            </h3>
                        </div>

                        <div className="p-4 sm:p-5 bg-white">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 block">Employee ID</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <Hash size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={formData.employeeId}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="e.g. EMP-001"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 block">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <UserCircle size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="Jane Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 block">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="jane@company.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 block">Department</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <Briefcase size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                            placeholder="Engineering"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <UserPlus size={18} />
                                        )}
                                        <span>{submitting ? 'Registering...' : 'Complete Registration'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* EMPLOYEE DIRECTORY */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md min-h-[500px]">
                        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white flex flex-row justify-between items-center gap-4">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <Users size={18} />
                                </div>
                                Company Directory
                            </h3>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                                {employees.length} Members
                            </div>
                        </div>

                        <div className="flex-1 p-0 overflow-hidden flex flex-col bg-white">
                            {loading ? (
                                <div className="flex-1 flex items-center justify-center p-12">
                                    <div className="flex flex-col items-center gap-4 text-slate-400">
                                        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin"></div>
                                        <p className="font-medium text-sm tracking-wide">Retrieving directory...</p>
                                    </div>
                                </div>
                            ) : employees.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center p-8 sm:p-12 text-center bg-slate-50/30">
                                    <div className="flex flex-col items-center gap-5 max-w-sm">
                                        <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center shadow-inner">
                                            <Users size={32} className="text-indigo-300" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-slate-800">No members yet</h4>
                                            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">Your organization looks a little empty. Add your first employee using the form to get started.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest font-bold border-b border-slate-200">
                                                <th className="px-4 py-3">Employee Details</th>
                                                <th className="px-4 py-3">Department</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {employees.map(emp => (
                                                <tr key={emp.employeeId} className="hover:bg-slate-50/70 transition-colors group bg-white">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100/50 shadow-sm shrink-0 uppercase tracking-wider text-sm">
                                                                {emp.fullName.charAt(0)}{emp.fullName.split(' ').length > 1 ? emp.fullName.split(' ')[1].charAt(0) : ''}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-800">{emp.fullName}</p>
                                                                <div className="flex items-center gap-2 text-[13px] text-slate-500 mt-0.5">
                                                                    <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium tracking-tight">{emp.employeeId}</span>
                                                                    <span className="text-slate-300">&bull;</span>
                                                                    <a href={`mailto:${emp.email}`} className="hover:text-blue-600 truncate max-w-[150px] sm:max-w-none transition-colors">{emp.email}</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-sm shadow-blue-100/50">
                                                            {emp.department}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            onClick={() => handleDelete(emp.employeeId)}
                                                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95"
                                                            title="Delete Member"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
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

export default EmployeePage;
