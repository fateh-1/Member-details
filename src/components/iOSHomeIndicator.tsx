import React from 'react';

export const IOSHomeIndicator: React.FC<{ bg?: string }> = ({ bg = 'bg-white' }) => {
  return (
    <div
      className={`w-full pb-2 pt-1 ${bg} flex justify-center items-center select-none`}
      data-purpose="home-indicator-bar"
    >
      <div className="w-32 h-1 bg-slate-300 rounded-full" />
    </div>
  );
};
