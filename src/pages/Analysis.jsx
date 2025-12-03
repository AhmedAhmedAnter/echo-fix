import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, DollarSign, ShoppingBag, Hammer, Heart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHARITIES } from '../utils/constants';

export default function Analysis() {
    const navigate = useNavigate();
    const { analysisResult, currentUpload, setCurrentUpload, setAnalysisResult, setProducts, setMessages, user, showNotification } = useApp();
    const [showCharityModal, setShowCharityModal] = useState(false);

    if (!analysisResult) {
        navigate('/upload');
        return null;
    }

    const handleAIAction = (action, payload = {}) => {
        const productId = Date.now().toString();
        const newProduct = {
            id: productId,
            sellerId: user.id,
            sellerName: user.name,
            originalTitle: currentUpload.title,
            description: currentUpload.description,
            images: currentUpload.images,
            status: action === 'sell' ? 'listed' : action === 'donate' ? 'donated' : 'fixing',
            price: action === 'sell' ? analysisResult.estimatedPrice : action === 'donate' ? 0 : null,
            title: action === 'sell' ? analysisResult.aiTitle : currentUpload.title,
            finalDescription: action === 'sell' ? analysisResult.aiDescription : currentUpload.description,
            aiAnalysis: analysisResult,
            charity: payload.charityName || null,
            createdAt: new Date().toISOString()
        };

        if (action === 'sell') {
            setProducts(prev => [newProduct, ...prev]);
            setCurrentUpload({ images: [], description: '', title: '' });
            setAnalysisResult(null);
            showNotification("تم عرض المنتج للبيع في المتجر بنجاح! 💰");
            navigate('/shop');
            return;
        }

        if (action === 'donate') {
            setProducts(prev => [newProduct, ...prev]);
            const newChat = {
                id: productId,
                productId: productId,
                productName: currentUpload.title,
                messages: [{ sender: 'ai', text: `أنت شخص رائع! ❤️ لقد تم عرض المنتج في المتجر مجاناً كتبرع لصالح ${payload.charityName || 'الجميع'}. شكراً لمساهمتك.`, time: new Date().toLocaleTimeString() }]
            };
            setMessages(prev => ({ ...prev, [productId]: newChat.messages }));
            setCurrentUpload({ images: [], description: '', title: '' });
            setAnalysisResult(null);
            setShowCharityModal(false);
            showNotification("تم عرض التبرع في المتجر بنجاح! ❤️");
            navigate('/shop');
            return;
        }

        if (action === 'fix') {
            const initialMessage = `أهلاً بك! أنا Fixer 🤖. قرار حكيم. إليك خطة إصلاح لـ "${analysisResult.detected}":\n\n${analysisResult.fixSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nكيف يمكنني مساعدتك في الخطوة الأولى؟`;

            // Save messages
            setMessages(prev => ({
                ...prev,
                [productId]: [{ sender: 'ai', text: initialMessage, time: new Date().toLocaleTimeString() }]
            }));

            // Navigate to chat immediately
            navigate('/chat', { state: { productId, product: newProduct } });
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                <div className="bg-gray-900 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-teal-400" />
                        <h2 className="text-xl font-bold">تقرير التقييم</h2>
                    </div>
                    <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-bold border border-white/10">{analysisResult.condition}</span>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-10">
                    <div>
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-md mb-6 relative">
                            <img src={currentUpload.images[0]} alt="Analyzed" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <p className="text-white font-bold">{analysisResult.detected}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">وصفك الأصلي</span>
                            <p className="text-gray-600 text-sm mt-1">{currentUpload.description}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-teal-50 border border-teal-100 p-6 rounded-2xl">
                            <h3 className="font-bold text-teal-900 mb-3 flex items-center gap-2"><Sparkles size={18} className="text-teal-600" /> العنوان المقترح</h3>
                            <h4 className="font-bold text-gray-800 text-lg mb-2">{analysisResult.aiTitle}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{analysisResult.aiDescription}</p>
                        </div>

                        <div className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                                <DollarSign size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold">السعر العادل المتوقع</p>
                                <p className="text-3xl font-black text-gray-800">{analysisResult.estimatedPrice} <span className="text-sm font-normal text-gray-400">جنية مصري</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <button onClick={() => handleAIAction('sell')} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-6 text-right transition shadow-lg hover:shadow-emerald-500/30 group">
                    <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition"><ShoppingBag className="text-white" /></div>
                    <h3 className="text-xl font-bold mb-1">بيع الآن</h3>
                    <p className="text-emerald-100 text-sm opacity-90">موافق على السعر؟ اعرضه في المتجر.</p>
                </button>

                <button onClick={() => handleAIAction('fix')} className="bg-white border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 text-gray-800 rounded-2xl p-6 text-right transition group">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition"><Hammer /></div>
                    <h3 className="text-xl font-bold mb-1">خطة إصلاح</h3>
                    <p className="text-gray-500 text-sm">أريد نصائح لإصلاحه قبل البيع.</p>
                </button>

                <div className="relative group h-full">
                    <button onClick={() => setShowCharityModal(!showCharityModal)} className="w-full h-full bg-white border-2 border-gray-100 hover:border-rose-500 hover:bg-rose-50 text-gray-800 rounded-2xl p-6 text-right transition">
                        <div className="bg-rose-100 w-12 h-12 rounded-full flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition"><Heart /></div>
                        <h3 className="text-xl font-bold mb-1">تبرع خيري</h3>
                        <p className="text-gray-500 text-sm">أريد التبرع به مجاناً.</p>
                    </button>
                    {showCharityModal && (
                        <div className="absolute bottom-full left-0 w-full bg-white shadow-xl rounded-xl border border-gray-200 p-2 mb-2 z-20">
                            <div className="flex justify-between items-center px-3 py-2 border-b mb-2">
                                <p className="text-xs font-bold text-gray-500">اختر الجهة:</p>
                                <button onClick={(e) => { e.stopPropagation(); setShowCharityModal(false); }} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                            </div>
                            {CHARITIES.map(charity => (
                                <button key={charity.id} onClick={() => handleAIAction('donate', { charityId: charity.id, charityName: charity.name })} className="w-full text-right px-4 py-2 hover:bg-rose-50 text-gray-700 rounded-lg text-sm font-bold">
                                    {charity.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
