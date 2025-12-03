import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Home, ShoppingBag, ShoppingCart, Camera, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
    const { user, cart, logout } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/dashboard" className="flex items-center cursor-pointer gap-2">
                        <div className="bg-teal-600 text-white p-1.5 rounded-lg"><Sparkles size={20} /></div>
                        <span className="font-bold text-2xl text-gray-800">Echo Fix</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-reverse space-x-2">
                        <Link
                            to="/dashboard"
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${isActive('/dashboard') ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Home size={20} /> الرئيسية
                        </Link>
                        <Link
                            to="/shop"
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${isActive('/shop') ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <ShoppingBag size={20} /> المتجر
                        </Link>
                        <Link
                            to="/cart"
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition relative ${isActive('/cart') ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <ShoppingCart size={20} /> السلة
                            {cart.length > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
                        </Link>
                        <div className="h-6 w-px bg-gray-300 mx-2"></div>
                        <Link
                            to="/upload"
                            className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:bg-teal-700 transition flex items-center gap-2"
                        >
                            <Camera size={18} /> بيع أداة
                        </Link>
                        <button
                            onClick={logout}
                            className="text-red-400 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-full transition"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative text-gray-600">
                            <ShoppingCart size={24} />
                            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
                        </Link>
                        <Link to="/upload" className="text-teal-600"><Camera size={24} /></Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
