import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Hammer,
  Heart,
  Upload,
  User,
  LogOut,
  Camera,
  Sparkles,
  ArrowRight,
  DollarSign,
  Menu,
  X,
  Loader2,
  CheckCircle,
  ShoppingCart,
  CreditCard,
  Info,
  Home,
  Trash2,
  Star
} from 'lucide-react';

// --- API Configuration ---
const apiKey = "AIzaSyCesXKeLJQpZx60wcQ25Ygwgg3wVBT2IAI"; // سيتم حقن المفتاح تلقائياً عند التشغيل

// --- Global Styles & Font Injection ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');
    
    body {
      font-family: 'Cairo', sans-serif;
      background-color: #f8fafc;
    }
    
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }

    .animate-bounce-slow {
      animation: bounce 2s infinite;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

// --- Dummy Data & Charities ---
const CHARITIES = [
  { id: 1, name: "جمعية رسالة للأعمال الخيرية" },
  { id: 2, name: "بنك الطعام المصري" },
  { id: 3, name: "جمعية الهلال الأحمر" },
  { id: 0, name: "Echo Fix (مجاني للموقع)" }
];

// --- Main Application Component ---
export default function EchoFixApp() {
  // --- State Management ---
  const [currentPage, setCurrentPage] = useState('landing'); // landing, login, register, dashboard, upload, analysis, shop, chat, product-details, cart
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Upload State
  const [currentUpload, setCurrentUpload] = useState({ images: [], description: '', title: '' });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [notification, setNotification] = useState(null);
  const [showCharityModal, setShowCharityModal] = useState(false);

  // Auth Inputs
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });

  // --- Effects (Local Storage) ---
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('echo_users') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('echo_products') || '[]');
    const storedMessages = JSON.parse(localStorage.getItem('echo_messages') || '{}');
    const storedCart = JSON.parse(localStorage.getItem('echo_cart') || '[]');
    const storedSession = JSON.parse(localStorage.getItem('echo_current_user'));

    setUsers(storedUsers);
    setProducts(storedProducts);
    setMessages(storedMessages);
    setCart(storedCart);
    if (storedSession) {
      setUser(storedSession);
      setCurrentPage('dashboard');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('echo_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('echo_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('echo_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('echo_cart', JSON.stringify(cart));
  }, [cart]);

  // --- Helper Functions ---
  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product) => {
    if (cart.find(p => p.id === product.id)) {
      showNotification("المنتج موجود بالفعل في السلة", "error");
      return;
    }
    setCart([...cart, product]);
    showNotification("تمت الإضافة للسلة بنجاح");
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(p => p.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Mark items as sold
    const soldIds = cart.map(p => p.id);
    const updatedProducts = products.map(p =>
      soldIds.includes(p.id) ? { ...p, status: 'sold', buyerId: user.id } : p
    );

    setProducts(updatedProducts);
    setCart([]);
    setCurrentPage('dashboard');
    showNotification("تمت عملية الشراء بنجاح! مبروك عليك الأدوات الجديدة 🎉");
  };

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
  };

  // --- Auth Handlers ---
  const handleRegister = (e) => {
    e.preventDefault();
    if (users.find(u => u.email === authForm.email)) {
      showNotification("البريد الإلكتروني مسجل بالفعل", "error");
      return;
    }
    const newUser = { ...authForm, id: Date.now().toString() };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem('echo_current_user', JSON.stringify(newUser));
    setCurrentPage('dashboard');
    showNotification("تم إنشاء الحساب بنجاح!");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find(u => u.email === authForm.email && u.password === authForm.password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('echo_current_user', JSON.stringify(foundUser));
      setCurrentPage('dashboard');
      showNotification("مرحباً بك مجدداً!");
    } else {
      showNotification("بيانات الدخول غير صحيحة", "error");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('echo_current_user');
    setCurrentPage('landing');
  };

  // --- Image Handling ---
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

  // --- AI Logic (Real Fixer with Gemini) ---
  const callGeminiAPI = async (title, description, base64Images) => {
    try {
      const model = "gemini-2.5-flash-preview-09-2025";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const imageParts = base64Images.map(img => ({
        inlineData: {
          mimeType: "image/jpeg",
          data: img.split(',')[1]
        }
      }));

      const prompt = `
        أنت خبير في تقييم الأدوات والأغراض المنزلية المستعملة (أثاث، أجهزة، أدوات يدوية، إلكترونيات قديمة، إلخ) واسمك "Fixer".
        الهدف: مساعدة المستخدم في بيع أشيائه المستعملة بسعر عادل وواقعي.
        قم بتحليل الصور المرفقة بدقة ووصف المستخدم: "${description}" والعنوان "${title}".
        المطلوب منك هو إرجاع رد بصيغة JSON فقط يحتوي على الحقول التالية باللغة العربية:
        1. "detected": اسم العنصر بدقة.
        2. "condition": تقييم صريح للحالة.
        3. "aiTitle": عنوان واضح ومباشر للبيع.
        4. "aiDescription": وصف حقيقي وأمين للمنتج يذكر المميزات والعيوب إن وجدت.
        5. "estimatedPrice": سعر عادل وواقعي جداً لسوق المستعمل في مصر (بالجنية المصري بسعر مخفض  - رقم صحيح فقط).
        6. "fixSuggestions": مصفوفة (Array) تحتوي على 3 نصائح عملية جداً لتنظيف المنتج أو إصلاحه.
        تأكد أن الرد هو JSON صالح فقط بدون أي نصوص إضافية.
      `;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, ...imageParts] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) throw new Error('AI Request failed');
      const data = await response.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);

    } catch (error) {
      console.error("AI Error:", error);
      return {
        detected: "أداة غير معروفة",
        condition: "مستعمل",
        aiTitle: title || "أداة مستعملة للبيع",
        aiDescription: description || "أداة مستعملة بحالة مقبولة.",
        estimatedPrice: 50,
        fixSuggestions: ["تنظيف الغبار", "التأكد من التشغيل", "تصوير واضح"]
      };
    }
  };

  const startAnalysis = async () => {
    if (currentUpload.images.length === 0 || !currentUpload.description) {
      showNotification("يرجى إضافة صور ووصف للمنتج", "error");
      return;
    }

    setIsAnalyzing(true);
    setCurrentPage('analysis');

    const result = await callGeminiAPI(currentUpload.title, currentUpload.description, currentUpload.images);

    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

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
      // Fix: Donate always sets price to 0 so it appears in shop as free
      price: action === 'sell' ? analysisResult.estimatedPrice : action === 'donate' ? 0 : null,
      title: action === 'sell' ? analysisResult.aiTitle : currentUpload.title,
      finalDescription: action === 'sell' ? analysisResult.aiDescription : currentUpload.description,
      aiAnalysis: analysisResult, // Store full analysis for product page
      charity: payload.charityName || null,
      createdAt: new Date().toISOString()
    };

    if (action === 'sell') {
      setProducts(prev => [newProduct, ...prev]);
      setCurrentUpload({ images: [], description: '', title: '' });
      setAnalysisResult(null);
      showNotification("تم عرض المنتج للبيع في المتجر بنجاح! 💰");
      setCurrentPage('shop');
      return;
    }

    if (action === 'donate') {
      setProducts(prev => [newProduct, ...prev]);

      // Create chat message but don't navigate to chat
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

      // Notify and redirect to Shop
      showNotification("تم عرض التبرع في المتجر بنجاح! ❤️");
      setCurrentPage('shop');
      return;
    }

    if (action === 'fix') {
      const initialMessage = `أهلاً بك! أنا Fixer 🤖. قرار حكيم. إليك خطة إصلاح لـ "${analysisResult.detected}":\n\n${analysisResult.fixSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nكيف يمكنني مساعدتك في الخطوة الأولى؟`;
      const newChat = {
        id: productId,
        productId: productId,
        productName: currentUpload.title,
        messages: [{ sender: 'ai', text: initialMessage, time: new Date().toLocaleTimeString() }]
      };
      setMessages(prev => ({ ...prev, [productId]: newChat.messages }));
      setActiveChat({ productId, product: newProduct });
      setCurrentUpload({ images: [], description: '', title: '' });
      setAnalysisResult(null);
      setCurrentPage('chat');
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const chatId = activeChat.productId;
    const newMsg = { sender: 'user', text, time: new Date().toLocaleTimeString() };

    setMessages(prev => {
      const chatMsgs = prev[chatId] || [];
      return { ...prev, [chatId]: [...chatMsgs, newMsg] };
    });

    // Get AI response
    try {
      const chatHistory = messages[chatId] || [];
      const product = activeChat.product;

      // Build conversation context
      const conversationContext = chatHistory
        .map(msg => `${msg.sender === 'user' ? 'المستخدم' : 'Fixer'}: ${msg.text}`)
        .join('\n');

      const model = "gemini-2.5-flash-preview-09-2025";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const prompt = `أنت "Fixer" - خبير إصلاح الأدوات والأجهزة المنزلية المستعملة باللغة العربية.
      
معلومات المنتج:
- الاسم: ${product.originalTitle || product.title}
- الوصف: ${product.description}
${product.aiAnalysis ? `- التحليل السابق: ${product.aiAnalysis.detected}
- الحالة: ${product.aiAnalysis.condition}
- نصائح الإصلاح المقترحة:
${product.aiAnalysis.fixSuggestions.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}` : ''}

سياق المحادثة السابقة:
${conversationContext}

سؤال المستخدم الجديد: ${text}

المطلوب: قدم إجابة عملية ومفيدة ومباشرة بناءً على سؤال المستخدم. كن ودوداً ومحترفاً. اشرح بالتفصيل خطوات الإصلاح إذا طلب المستخدم ذلك. استخدم اللغة العربية الفصحى المبسطة.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) throw new Error('AI Request failed');
      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;

      const aiReply = {
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString()
      };

      setMessages(prev => {
        const chatMsgs = prev[chatId] || [];
        return { ...prev, [chatId]: [...chatMsgs, aiReply] };
      });

    } catch (error) {
      console.error("Chat AI Error:", error);
      const errorReply = {
        sender: 'ai',
        text: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => {
        const chatMsgs = prev[chatId] || [];
        return { ...prev, [chatId]: [...chatMsgs, errorReply] };
      });
    }
  };

  // --- Handlers for Inputs ---
  const handleDescriptionChange = (e) => setCurrentUpload(prev => ({ ...prev, description: e.target.value }));
  const handleTitleChange = (e) => setCurrentUpload(prev => ({ ...prev, title: e.target.value }));

  // --- Sub-Components ---

  const ProductCard = ({ product }) => (
    <div onClick={() => viewProductDetails(product)} className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400"><ShoppingBag /></div>
        )}
        {product.price === 0 && (
          <span className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Heart size={10} fill="white" /> تبرع
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 truncate mb-1">{product.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 h-10 mb-3">{product.finalDescription}</p>

        <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
          <span className={`font-bold text-lg ${product.price === 0 ? 'text-rose-600' : 'text-teal-600'}`}>
            {product.price === 0 ? 'مجاناً' : `${product.price} جنية`}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="text-teal-600 bg-teal-50 hover:bg-teal-600 hover:text-white p-2 rounded-full transition duration-300"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  // --- VIEW RENDERS ---

  // 1. Landing Page (New)
  if (currentPage === 'landing') {
    return (
      <>
        <GlobalStyles />
        <div className="min-h-screen bg-white" dir="rtl">
          {/* Header */}
          <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="bg-teal-600 text-white p-2 rounded-lg"><Sparkles size={24} /></div>
              <span className="font-bold text-2xl text-gray-800">Echo Fix</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setCurrentPage('login')} className="text-gray-600 hover:text-teal-600 font-bold px-4 py-2">تسجيل الدخول</button>
              <button onClick={() => setCurrentPage('register')} className="bg-teal-600 text-white px-6 py-2 rounded-full font-bold hover:bg-teal-700 transition shadow-lg">ابدأ الآن</button>
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
                <button onClick={() => setCurrentPage('register')} className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition transform flex items-center gap-2">
                  جرب التحليل الذكي <Sparkles size={20} />
                </button>
                <button onClick={() => setCurrentPage('login')} className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-teal-600 hover:text-teal-600 transition">
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
      </>
    );
  }

  // 2. Login/Register Wrappers
  if (currentPage === 'login' || currentPage === 'register') {
    return (
      <>
        <GlobalStyles />
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50" dir="rtl">
          {/* Back Button */}
          <button onClick={() => setCurrentPage('landing')} className="absolute top-6 right-6 text-gray-500 hover:text-teal-600 flex items-center gap-2 font-bold">
            <ArrowRight size={20} /> العودة للرئيسية
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md animate-fade-in border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="bg-teal-100 p-4 rounded-2xl rotate-3">
                <Sparkles className="w-10 h-10 text-teal-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Echo Fix</h1>
            <p className="text-center text-gray-500 mb-8">{currentPage === 'login' ? 'مرحباً بعودتك!' : 'ابدأ رحلتك معنا'}</p>

            <form onSubmit={currentPage === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {currentPage === 'register' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-gray-50" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-gray-50" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
                <input type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-gray-50" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} />
              </div>
              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition duration-300 shadow-lg mt-2">
                {currentPage === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={() => setCurrentPage(currentPage === 'login' ? 'register' : 'login')} className="text-teal-600 hover:underline font-bold text-sm">
                {currentPage === 'login' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- Authenticated App ---
  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-gray-50 font-cairo" dir="rtl">
        {/* Navbar */}
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center cursor-pointer gap-2" onClick={() => setCurrentPage('dashboard')}>
                <div className="bg-teal-600 text-white p-1.5 rounded-lg"><Sparkles size={20} /></div>
                <span className="font-bold text-2xl text-gray-800">Echo Fix</span>
              </div>

              <div className="hidden md:flex items-center space-x-reverse space-x-2">
                <button onClick={() => setCurrentPage('dashboard')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${currentPage === 'dashboard' ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Home size={20} /> الرئيسية
                </button>
                <button onClick={() => setCurrentPage('shop')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${currentPage === 'shop' ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <ShoppingBag size={20} /> المتجر
                </button>
                <button onClick={() => setCurrentPage('cart')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition relative ${currentPage === 'cart' ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <ShoppingCart size={20} /> السلة
                  {cart.length > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
                </button>
                <div className="h-6 w-px bg-gray-300 mx-2"></div>
                <button onClick={() => setCurrentPage('upload')} className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:bg-teal-700 transition flex items-center gap-2">
                  <Camera size={18} /> بيع أداة
                </button>
                <button onClick={logout} className="text-red-400 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-full transition">
                  <LogOut size={20} />
                </button>
              </div>

              {/* Mobile Menu Icon */}
              <div className="md:hidden flex items-center gap-4">
                <button onClick={() => setCurrentPage('cart')} className="relative text-gray-600">
                  <ShoppingCart size={24} />
                  {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
                </button>
                <button onClick={() => setCurrentPage('upload')} className="text-teal-600"><Camera size={24} /></button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {notification && (
            <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 animate-fade-in flex items-center gap-3 font-bold ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'} text-white`}>
              {notification.type === 'error' ? <X size={18} /> : <CheckCircle size={18} />}
              {notification.msg}
            </div>
          )}

          {/* DASHBOARD */}
          {currentPage === 'dashboard' && (
            <div className="animate-fade-in space-y-8">
              <div className="bg-gradient-to-l from-teal-600 to-emerald-500 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">مرحباً، {user.name} 👋 <br /> جاهز لتجديد أدواتك؟</h2>
                  <p className="text-teal-50 text-lg mb-8 opacity-90">سواء كنت تريد بيع شنيور قديم، إصلاح جهاز، أو العثور على كنز مستعمل، Fixer هنا لمساعدتك.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setCurrentPage('upload')} className="bg-white text-teal-700 px-6 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-gray-50 transition transform hover:-translate-y-1 flex items-center gap-2">
                      <Camera size={20} /> ابدأ الفحص
                    </button>
                    <button onClick={() => setCurrentPage('shop')} className="bg-teal-700/30 backdrop-blur-sm text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold hover:bg-teal-700/50 transition">
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
                  <button onClick={() => setCurrentPage('shop')} className="text-teal-600 font-bold hover:underline text-sm">عرض الكل</button>
                </div>
                {products.filter(p => p.status === 'listed').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.filter(p => p.status === 'listed').slice(0, 4).map(product => (
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
          )}

          {/* SHOP */}
          {currentPage === 'shop' && (
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
                {products.filter(p => p.status === 'listed' || (p.status === 'donated' && p.price === 0)).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* PRODUCT DETAILS PAGE (NEW) */}
          {currentPage === 'product-details' && selectedProduct && (
            <div className="animate-fade-in max-w-5xl mx-auto">
              <button onClick={() => setCurrentPage('shop')} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-teal-600 transition font-bold">
                <ArrowRight size={20} /> العودة للمتجر
              </button>

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 grid md:grid-cols-2">
                {/* Image Side */}
                <div className="bg-gray-100 relative h-96 md:h-auto">
                  <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-sm">
                    {selectedProduct.status === 'listed' ? 'متاح للبيع' : selectedProduct.status === 'donated' ? 'تبرع خيري' : 'تم البيع'}
                  </div>
                </div>

                {/* Info Side */}
                <div className="p-8 md:p-10 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.title}</h1>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={16} /> <span>البائع: {selectedProduct.sellerName}</span>
                        <span>•</span>
                        <span>{new Date(selectedProduct.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-teal-600">
                      {selectedProduct.price === 0 ? 'مجاناً' : `${selectedProduct.price} ج.م`}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><Info size={18} className="text-teal-500" /> وصف المنتج</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.finalDescription}</p>
                  </div>

                  {selectedProduct.aiAnalysis && (
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Sparkles size={18} className="text-purple-500" /> تقييم Fixer</h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-bold border border-purple-100">{selectedProduct.aiAnalysis.condition}</span>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100">{selectedProduct.aiAnalysis.detected}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto flex gap-4">
                    <button
                      onClick={() => addToCart(selectedProduct)}
                      className="flex-1 bg-teal-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart /> أضف للسلة
                    </button>
                    {/* Extra button if needed later */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CART PAGE (NEW) */}
          {currentPage === 'cart' && (
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
                  <button onClick={() => setCurrentPage('shop')} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition">
                    تصفح المتجر
                  </button>
                </div>
              )}
            </div>
          )}

          {/* UPLOAD, ANALYSIS, CHAT (Existing Logic kept same but wrapped in new layout) */}
          {currentPage === 'upload' && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 animate-fade-in border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Camera className="text-teal-600" /> فحص أداة جديدة
              </h2>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2 text-sm">اسم الأداة / المنتج</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition bg-gray-50" placeholder="مثال: شنيور بوش قديم" value={currentUpload.title || ''} onChange={handleTitleChange} />
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
                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none h-32 resize-none transition bg-gray-50" placeholder="وصف حالة الأداة، العيوب، وسبب البيع..." value={currentUpload.description || ''} onChange={handleDescriptionChange}></textarea>
              </div>
              <button onClick={startAnalysis} disabled={isAnalyzing} className={`w-full bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isAnalyzing ? 'جاري التقييم...' : 'قيّم السعر مع Fixer'}
              </button>
            </div>
          )}

          {currentPage === 'analysis' && analysisResult && (
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
          )}

          {currentPage === 'chat' && activeChat && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-[75vh] flex flex-col animate-fade-in max-w-4xl mx-auto border border-gray-200">
              <div className="bg-gray-50 border-b p-4 flex items-center gap-4">
                <div className="relative">
                  <div className="bg-teal-600 p-3 rounded-full text-white"><Sparkles size={20} /></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">المساعد الذكي Fixer</h3>
                  <p className="text-xs text-gray-500">متصل الآن • بخصوص {activeChat.productName}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {(messages[activeChat.productId] || []).map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${msg.sender === 'user' ? 'bg-gray-100 text-gray-800 rounded-tr-none' : 'bg-teal-600 text-white rounded-tl-none'
                      }`}>
                      <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                      <span className={`text-[10px] block mt-2 opacity-60 ${msg.sender === 'user' ? 'text-left' : 'text-right'}`}>{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t flex gap-2">
                <input type="text" placeholder="اكتب رسالتك..." className="flex-1 px-6 py-4 rounded-xl border-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm outline-none" onKeyPress={(e) => e.key === 'Enter' && sendMessage(e.target.value)} id="chatInput" />
                <button onClick={() => { const input = document.getElementById('chatInput'); sendMessage(input.value); input.value = ''; }} className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-xl transition shadow-md"><ArrowRight className="transform rotate-180" /></button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}