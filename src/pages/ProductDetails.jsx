import React from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, User, ShoppingCart, Info, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { products, addToCart } = useApp();

    const product = location.state?.product || products.find(p => p.id === id);

    if (!product) {
        navigate('/shop');
        return null;
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <Link to="/shop" className="mb-6 flex items-center gap-2 text-gray-500 hover:text-teal-600 transition font-bold">
                <ArrowRight size={20} /> العودة للمتجر
            </Link>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 grid md:grid-cols-2">
                {/* Image Side */}
                <div className="bg-gray-100 relative h-96 md:h-auto">
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-sm">
                        {product.status === 'listed' ? 'متاح للبيع' : product.status === 'donated' ? 'تبرع خيري' : 'تم البيع'}
                    </div>
                </div>

                {/* Info Side */}
                <div className="p-8 md:p-10 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <User size={16} /> <span>الب ائع: {product.sellerName}</span>
                                <span>•</span>
                                <span>{new Date(product.createdAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-teal-600">
                            {product.price === 0 ? 'مجاناً' : `${product.price} ج.م`}
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><Info size={18} className="text-teal-500" /> وصف المنتج</h3>
                        <p className="text-gray-600 leading-relaxed">{product.finalDescription}</p>
                    </div>

                    {product.aiAnalysis && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Sparkles size={18} className="text-purple-500" /> تقييم Fixer</h3>
                            <div className="flex gap-2 flex-wrap">
                                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-bold border border-purple-100">{product.aiAnalysis.condition}</span>
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100">{product.aiAnalysis.detected}</span>
                            </div>
                        </div>
                    )}

                    <div className="mt-auto flex gap-4">
                        <button
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-teal-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
                        >
                            <ShoppingCart /> أضف للسلة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
