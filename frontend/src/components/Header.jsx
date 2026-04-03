import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onLogout, toggleSidebar }) => { // <-- Thêm toggleSidebar vào đây
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md transition-all duration-300">
            <div className="flex justify-between items-center px-4 md:px-8 py-3.5">
                
                {/* BÊN TRÁI: Logo và Tên trường */}
                <div className="flex items-center gap-4">
                    {/* NÚT HAMBURGER MOBILE - Đã thêm onClick */}
                    <button 
                        onClick={toggleSidebar} 
                        className="md:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors focus:outline-none border-none outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    
                    <Link to="/" className="flex items-center gap-3 no-underline">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm text-xl">
                            🏫
                        </div>
                        <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight hidden sm:block m-0">
                            Trường THCS Trần Phú
                        </h1>
                    </Link>
                </div>

                {/* BÊN PHẢI: Thông báo & Profile */}
                <div className="flex items-center gap-3 md:gap-6">
                    
                    {/* Nút Thông Báo */}
                    <button className="relative text-gray-500 hover:bg-gray-100 hover:text-blue-600 p-2.5 rounded-full transition-colors outline-none border-none bg-transparent">
                        <span className="text-xl leading-none">🔔</span>
                        <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                            3
                        </span>
                    </button>

                    {/* Vạch kẻ dọc phân cách */}
                    <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                    {/* Dropdown User Profile */}
                    <div className="relative">
                        <button 
                            onClick={toggleProfile}
                            className="flex items-center gap-3 focus:outline-none border border-transparent hover:border-gray-200 hover:bg-gray-50 p-1.5 pr-3 rounded-full md:rounded-xl transition-all duration-200 bg-transparent"
                        >
                            <img 
                                src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff" 
                                alt="Avatar" 
                                className="w-9 h-9 rounded-full border border-gray-200 object-cover shadow-sm"
                            />
                            <div className="hidden md:flex flex-col text-left">
                                <span className="text-sm font-bold text-gray-800 leading-none mb-1.5">
                                    Quản trị viên
                                </span>
                                <span className="text-[11px] text-gray-500 font-medium leading-none">
                                    admin@tranphu.edu.vn
                                </span>
                            </div>
                            <svg className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Menu xổ xuống */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                                <div className="px-4 py-3 border-b border-gray-100 md:hidden mb-1 bg-gray-50/50">
                                    <p className="text-sm font-bold text-gray-800">Quản trị viên</p>
                                    <p className="text-xs text-gray-500 mt-0.5">admin@tranphu.edu.vn</p>
                                </div>
                                
                                <Link 
                                    to="/ho-so" 
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors no-underline"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <span className="text-lg opacity-80">👤</span> Hồ sơ cá nhân
                                </Link>
                                
                                <div className="px-3 my-1">
                                    <hr className="border-gray-100" />
                                </div>
                                
                                <button 
                                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors outline-none border-none font-medium bg-transparent"
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        if(onLogout) onLogout();
                                    }}
                                >
                                    <span className="text-lg opacity-80">🚪</span> Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;