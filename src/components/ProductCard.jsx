import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart } = useApp();

    const handleClick = () => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full"
        >
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
                        onClick={handleAddToCart}
                        className="text-teal-600 bg-teal-50 hover:bg-teal-600 hover:text-white p-2 rounded-full transition duration-300"
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
