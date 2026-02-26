import React, { useState } from 'react';
import { NavLink, Outlet, Routes, Route } from 'react-router-dom';
import { Users, CalendarCheck, Menu, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar sidebar */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col
        transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                <div className="p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        HRMS Lite
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    <NavLink
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-indigo-600/20 text-indigo-400 font-medium scale-[1.02] shadow-sm'
                                : 'hover:bg-slate-800 hover:text-white hover:scale-[1.02] active:scale-[0.98]'
                            }`
                        }
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/employees"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-blue-600/20 text-blue-400 font-medium scale-[1.02] shadow-sm'
                                : 'hover:bg-slate-800 hover:text-white hover:scale-[1.02] active:scale-[0.98]'
                            }`
                        }
                    >
                        <Users size={20} />
                        <span>Employees</span>
                    </NavLink>

                    <NavLink
                        to="/attendance"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-indigo-600/20 text-indigo-400 font-medium scale-[1.02] shadow-sm'
                                : 'hover:bg-slate-800 hover:text-white hover:scale-[1.02] active:scale-[0.98]'
                            }`
                        }
                    >
                        <CalendarCheck size={20} />
                        <span>Attendance</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-800 mt-auto">
                    <div className="flex items-center gap-3 px-4 py-2 opacity-90 hover:opacity-100 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer rounded-xl hover:bg-slate-800/50">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            AD
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-white">Admin User</p>
                            <p className="text-slate-500 text-xs">admin@hrms.local</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col md:max-h-screen md:overflow-hidden relative">
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 p-4 md:px-8 flex justify-between items-center shadow-sm sticky top-0 z-10 w-full">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-semibold text-slate-800 md:hidden">HR Dashboard</h1>

                        <Routes>
                            <Route path="/" element={<h1 className="text-xl font-semibold text-slate-800 hidden md:block">Dashboard</h1>} />
                            <Route path="/employees" element={<h1 className="text-xl font-semibold text-slate-800 hidden md:block">Employees</h1>} />
                            <Route path="/attendance" element={<h1 className="text-xl font-semibold text-slate-800 hidden md:block">Attendance</h1>} />
                        </Routes>
                    </div>
                </header>

                <main className="flex-1 md:overflow-y-auto p-4 sm:p-5 lg:p-6">
                    <div className="max-w-7xl mx-auto w-full pb-12">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
