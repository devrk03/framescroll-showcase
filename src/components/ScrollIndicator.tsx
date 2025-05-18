import React from 'react';

const ScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
      <span className="text-white text-sm mb-2 font-sans">Scroll Down</span>
      <div className="w-6 h-10 relative">
        <div className="w-full h-full border-2 border-white rounded-full"></div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white rounded-full animate-scroll-arrow"></div>
      </div>
    </div>
  );
};

export default ScrollIndicator;
