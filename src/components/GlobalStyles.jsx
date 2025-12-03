import React from 'react';

export default function GlobalStyles() {
    return (
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
}
