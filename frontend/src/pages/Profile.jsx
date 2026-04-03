import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const Profile = () => {
    // 1. STATE THÔNG TIN USER
    const [user, setUser] = useState({
        fullName: 'Đang tải...',
        email: '...',
        role: '...',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&size=256' // Avatar mặc định
    });

    // 2. STATE FORM ĐỔI MẬT KHẨU
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Giả lập lấy thông tin user (Sau này ông nối API /auth/me vào đây)
    useEffect(() => {
        // Mock data tạm thời
        setUser({
            fullName: 'Hồ Nguyễn Quốc Dũng',
            email: 'admin@tranphu.edu.vn',
            role: 'Quản trị viên hệ thống',
            phone: '0987.654.321',
            avatar: 'https://ui-avatars.com/api/?name=Quoc+Dung&background=2563eb&color=fff&size=256'
        });
    }, []);

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        
        // Kiểm tra khớp mật khẩu
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Mật khẩu mới không khớp! Vui lòng nhập lại.');
            return;
        }

        try {
            // Chỗ này gọi API đổi mật khẩu:
            // await axiosClient.put('/auth/change-password', passwordForm);
            
            alert('🎉 Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            setIsPasswordModalOpen(false);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            
            // Xử lý đăng xuất ở đây nếu cần...
        } catch (error) {
            alert(error.response?.data?.message || 'Mật khẩu hiện tại không đúng!');
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans bg-transparent">
            {/* HEADER */}
            <div className="mb-8">
                <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb]">
                    Hồ Sơ Cá Nhân
                </h2>
                <p className="text-gray-500 mt-1">Quản lý thông tin và bảo mật tài khoản của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CỘT TRÁI: AVATAR VÀ THÔNG TIN CƠ BẢN */}
                <div className="col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <img 
                                src={user.avatar} 
                                alt="Avatar" 
                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-md"
                            />
                            {/* Nút giả lập đổi avatar */}
                            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg outline-none border-none">
                                📷
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{user.fullName}</h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mt-2 mb-4">
                            {user.role}
                        </span>
                        
                        <div className="w-full pt-4 border-t border-gray-100 flex flex-col gap-3 text-left">
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Tài khoản / Email</p>
                                <p className="text-sm font-medium text-gray-800">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Số điện thoại</p>
                                <p className="text-sm font-medium text-gray-800">{user.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: CÀI ĐẶT BẢO MẬT */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span>🛡️</span> Cài Đặt Bảo Mật
                        </h3>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="mb-4 sm:mb-0">
                                <h4 className="font-semibold text-gray-800">Mật khẩu tài khoản</h4>
                                <p className="text-sm text-gray-500">Đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn.</p>
                            </div>
                            <button 
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="bg-[#2453c9] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm outline-none border-none whitespace-nowrap"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL ĐỔI MẬT KHẨU */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-[#2453c9]">
                                Đổi Mật Khẩu
                            </h3>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl font-light leading-none outline-none border-none">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={submitPasswordChange} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
                                <input 
                                    type="password" name="oldPassword" value={passwordForm.oldPassword} onChange={handlePasswordChange} required 
                                    placeholder="Nhập mật khẩu đang sử dụng"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" 
                                />
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                                <input 
                                    type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required minLength="6"
                                    placeholder="Mật khẩu phải từ 6 ký tự trở lên"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nhập lại mật khẩu mới</label>
                                <input 
                                    type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required minLength="6"
                                    placeholder="Xác nhận lại mật khẩu mới"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" 
                                />
                            </div>

                            <div className="pt-4 mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors outline-none">
                                    Hủy
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-lg bg-[#2453c9] text-white text-sm font-medium hover:bg-blue-800 transition-colors outline-none border-none">
                                    Cập nhật mật khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;