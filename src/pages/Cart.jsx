import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, CreditCard, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Cart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, handleCheckout } = useApp();

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <ShoppingCart className="text-teal-600" /> سلة الشراء
            </h2>

            {cart.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="md:col-span-2 space-y-4">
                        {cart.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                <img src={item.images[0]} alt={item.title} className="w-24 h-24 object-cover rounded-xl bg-gray-100" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.price === 0 ? 'مجاناً' : `${item.price} ج.م`}</p>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
                        <h3 className="font-bold text-xl text-gray-800 mb-6">ملخص الطلب</h3>
                        <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>عدد المنتجات</span>
                                <span>{cart.length}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>الشحن</span>
                                <span className="text-green-600 font-bold">مجاني</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                                <span>المجموع</span>
                                <span>{cart.reduce((total, item) => total + item.price, 0)} ج.م</span>
                            </div>
                        </div>
                        <button onClick={handleCheckout} className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition flex items-center justify-center gap-2">
                            <CreditCard size={20} /> إتمام الشراء
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                            <CheckCircle size={12} /> دفع آمن 100% (محاكاة)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <ShoppingCart size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">السلة فارغة</h3>
                    <p className="text-gray-500 mb-8">لم تقم بإضافة أي منتجات بعد.</p>
                    <button onClick={() => navigate('/shop')} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition">
                        تصفح المتجر
                    </button>
                </div>
            )}
        </div>
    );
}
