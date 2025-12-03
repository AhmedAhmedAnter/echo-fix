import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function Shop() {
    const { products } = useApp();

    const shopProducts = products.filter(p => p.status === 'listed' || (p.status === 'donated' && p.price === 0));

    return (
        <div className="animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">سوق الأدوات المستعملة</h2>
                    <p className="text-gray-500 text-sm">تصفح أفضل العروض على الأدوات والمعدات</p>
                </div>
                <div className="relative w-full md:w-96">
                    <input type="text" placeholder="ابحث عن أداة (مثلاً: شنيور، مطرقة)..." className="w-full bg-gray-50 border border-gray-200 pl-4 pr-10 py-3 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition" />
                    <div className="absolute left-3 top-3 text-gray-400"><ShoppingBag size={18} /></div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {shopProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
