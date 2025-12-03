import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Camera, Hammer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, products } = useApp();

    const listedProducts = products.filter(p => p.status === 'listed');

    return (
        <div className="animate-fade-in space-y-8">
            <div className="bg-gradient-to-l from-teal-600 to-emerald-500 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">مرحباً، {user.name} 👋 <br /> جاهز لتجديد أدواتك؟</h2>
                    <p className="text-teal-50 text-lg mb-8 opacity-90">سواء كنت تريد بيع شنيور قديم، إصلاح جهاز، أو العثور على كنز مستعمل، Fixer هنا لمساعدتك.</p>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/upload')} className="bg-white text-teal-700 px-6 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition transform hover:-translate-y-1 flex items-center gap-2">
                            <Camera size={20} /> ابدأ الفحص
                        </button>
                        <button onClick={() => navigate('/shop')} className="bg-teal-700/30 backdrop-blur-sm text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold hover:bg-teal-700/50 transition">
                            تصفح المتجر
                        </button>
                    </div>
                </div>
                <div className="absolute left-0 bottom-0 opacity-10 transform translate-y-10 -translate-x-10">
                    <Hammer size={300} />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Sparkles className="text-teal-500" /> أحدث الإضافات</h3>
                    <button onClick={() => navigate('/shop')} className="text-teal-600 font-bold hover:underline text-sm">عرض الكل</button>
                </div>
                {listedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {listedProducts.slice(0, 4).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-400 font-medium">المتجر فارغ حالياً. كن أول من يضيف!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
