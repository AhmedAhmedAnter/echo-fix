import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Register() {
    const navigate = useNavigate();
    const { users, setUsers, setUser, showNotification } = useApp();
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (users.find(u => u.email === formData.email)) {
            showNotification("البريد الإلكتروني مسجل بالفعل", "error");
            return;
        }
        const newUser = { ...formData, id: Date.now().toString() };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setUser(newUser);
        localStorage.setItem('echo_current_user', JSON.stringify(newUser));
        navigate('/dashboard');
        showNotification("تم إنشاء الحساب بنجاح!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50" dir="rtl">
            <button onClick={() => navigate('/')} className="absolute top-6 right-6 text-gray-500 hover:text-teal-600 flex items-center gap-2 font-bold">
                <ArrowRight size={20} /> العودة للرئيسية
            </button>

            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md animate-fade-in border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-teal-100 p-4 rounded-2xl rotate-3">
                        <Sparkles className="w-10 h-10 text-teal-600" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Echo Fix</h1>
                <p className="text-center text-gray-500 mb-8">ابدأ رحلتك معنا</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-gray-50"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-gray-50"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-gray-50"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition duration-300 shadow-lg mt-2">
                        إنشاء حساب
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-teal-600 hover:underline font-bold text-sm">
                        ليدك حساب بالفعل؟ سجل دخولك
                    </Link>
                </div>
            </div>
        </div>
    );
}
