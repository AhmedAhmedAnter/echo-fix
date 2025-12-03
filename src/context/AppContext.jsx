import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export function AppProvider({ children }) {
    const navigate = useNavigate();

    // State Management
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [cart, setCart] = useState([]);
    const [messages, setMessages] = useState({});
    const [notification, setNotification] = useState(null);
    const [currentUpload, setCurrentUpload] = useState({ images: [], description: '', title: '' });
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('echo_users') || '[]');
        const storedProducts = JSON.parse(localStorage.getItem('echo_products') || '[]');
        const storedMessages = JSON.parse(localStorage.getItem('echo_messages') || '{}');
        const storedCart = JSON.parse(localStorage.getItem('echo_cart') || '[]');
        const storedSessionString = localStorage.getItem('echo_current_user');

        setUsers(storedUsers);
        setProducts(storedProducts);
        setMessages(storedMessages);
        setCart(storedCart);

        if (storedSessionString && storedSessionString !== 'null') {
            try {
                const storedSession = JSON.parse(storedSessionString);
                if (storedSession && storedSession.id) {
                    setUser(storedSession);
                }
            } catch (e) {
                console.error('Error parsing user session:', e);
                localStorage.removeItem('echo_current_user');
            }
        }
    }, []);

    // Save to localStorage
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

    // Helper Functions
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

        const soldIds = cart.map(p => p.id);
        const updatedProducts = products.map(p =>
            soldIds.includes(p.id) ? { ...p, status: 'sold', buyerId: user.id } : p
        );

        setProducts(updatedProducts);
        setCart([]);
        navigate('/dashboard');
        showNotification("تمت عملية الشراء بنجاح! مبروك عليك الأدوات الجديدة 🎉");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('echo_current_user');
        navigate('/');
    };

    const value = {
        user,
        setUser,
        products,
        setProducts,
        users,
        setUsers,
        cart,
        setCart,
        messages,
        setMessages,
        notification,
        currentUpload,
        setCurrentUpload,
        analysisResult,
        setAnalysisResult,
        isAnalyzing,
        setIsAnalyzing,
        showNotification,
        addToCart,
        removeFromCart,
        handleCheckout,
        logout
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
