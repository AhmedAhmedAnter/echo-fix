import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { callGeminiAPI } from '../utils/api';

export default function UploadPage() {
    const navigate = useNavigate();
    const { currentUpload, setCurrentUpload, setAnalysisResult, setIsAnalyzing, isAnalyzing, showNotification } = useApp();

    // Clear previous analysis when entering upload page
    React.useEffect(() => {
        setAnalysisResult(null);
        setCurrentUpload({ images: [], description: '', title: '' });
    }, []);

    const handleImageUpload = (e) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;

        const files = Array.from(fileList);

        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                showNotification(`الملف ${file.name} كبير جداً (أكبر من 5MB)`, "error");
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        showNotification("جاري معالجة الصور...", "success");

        Promise.all(validFiles.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        })).then(images => {
            setCurrentUpload(prev => ({ ...prev, images: [...prev.images, ...images] }));
            e.target.value = '';
        }).catch(err => {
            console.error("Image upload error:", err);
            showNotification("حدث خطأ أثناء رفع الصور", "error");
        });
    };

    const startAnalysis = async () => {
        if (currentUpload.images.length === 0 || !currentUpload.description) {
            showNotification("يرجى إضافة صور ووصف للمنتج", "error");
            return;
        }

        setIsAnalyzing(true);
        const result = await callGeminiAPI(currentUpload.title, currentUpload.description, currentUpload.images);
        setAnalysisResult(result);
        setIsAnalyzing(false);
        navigate('/analysis');
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 animate-fade-in border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Camera className="text-teal-600" /> فحص أداة جديدة
            </h2>
            <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2 text-sm">اسم الأداة / المنتج</label>
                <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition bg-gray-50"
                    placeholder="مثال: شنيور بوش قديم"
                    value={currentUpload.title || ''}
                    onChange={e => setCurrentUpload(prev => ({ ...prev, title: e.target.value }))}
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2 text-sm">صور المنتج</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 transition bg-gray-50 relative group">
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <div className="flex flex-col items-center group-hover:scale-105 transition">
                        <div className="bg-teal-100 p-4 rounded-full text-teal-600 mb-3"><Upload size={24} /></div>
                        <p className="text-gray-500 font-medium">اضغط لرفع الصور</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG حتى 5MB</p>
                    </div>
                </div>
                {currentUpload.images.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        {currentUpload.images.map((img, idx) => (
                            <img key={idx} src={img} alt="preview" className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-200" />
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-8">
                <label className="block text-gray-700 font-bold mb-2 text-sm">وصف الحالة</label>
                <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none h-32 resize-none transition bg-gray-50"
                    placeholder="وصف حالة الأداة، العيوب، وسبب البيع..."
                    value={currentUpload.description || ''}
                    onChange={e => setCurrentUpload(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
            </div>
            <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className={`w-full bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isAnalyzing ? 'جاري التقييم...' : 'قيّم السعر مع Fixer'}
            </button>
        </div>
    );
}
