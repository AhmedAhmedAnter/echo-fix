import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Camera, DollarSign } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            {/* Header */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-teal-600 text-white p-2 rounded-lg"><Sparkles size={24} /></div>
                    <span className="font-bold text-2xl text-gray-800">Echo Fix</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-teal-600 font-bold px-4 py-2">تسجيل الدخول</button>
                    <button onClick={() => navigate('/register')} className="bg-teal-600 text-white px-6 py-2 rounded-full font-bold hover:bg-teal-700 transition shadow-lg">ابدأ الآن</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                        أدواتك القديمة <br /> <span className="text-teal-600">كنز مخفي</span>
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                        منصة ذكية تساعدك في بيع، إصلاح، أو التبرع بالأدوات والأجهزة المستعملة باستخدام الذكاء الاصطناعي "Fixer".
                    </p>
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => navigate('/register')} className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition transform flex items-center gap-2">
                            جرب التحليل الذكي <Sparkles size={20} />
                        </button>
                        <button onClick={() => navigate('/login')} className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-teal-600 hover:text-teal-600 transition">
                            تصفح المتجر
                        </button>
                    </div>
                </div>
                <div className="relative animate-fade-in hidden md:block">
                    <div className="absolute top-0 left-10 bg-yellow-400 w-24 h-24 rounded-full opacity-20 animate-bounce-slow"></div>
                    <div className="absolute bottom-10 right-10 bg-teal-400 w-32 h-32 rounded-full opacity-20"></div>
                    <img src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Fixing Tools" className="relative z-10 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500" />
                </div>
            </header>

            {/* Features */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12">كيف يعمل Echo Fix؟</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center text-teal-600 mx-auto mb-6"><Camera size={32} /></div>
                            <h3 className="text-xl font-bold mb-3">صور الأداة</h3>
                            <p className="text-gray-500">التقط صور واضحة لأي أداة أو جهاز قديم لديك.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6"><Sparkles size={32} /></div>
                            <h3 className="text-xl font-bold mb-3">تحليل Fixer</h3>
                            <p className="text-gray-500">الذكاء الاصطناعي يحلل الحالة ويقترح السعر العادل أو طريقة الإصلاح.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6"><DollarSign size={32} /></div>
                            <h3 className="text-xl font-bold mb-3">بيع أو تبرع</h3>
                            <p className="text-gray-500">اعرضه للبيع في المتجر فوراً أو تبرع به للجمعيات الخيرية.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
