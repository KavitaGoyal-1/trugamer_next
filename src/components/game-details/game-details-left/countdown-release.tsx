import React from 'react';

const CountdownRelease: React.FC = () => {
  return (
    <div className="flex items-center justify-center border border-white rounded-lg p-2 gap-2 text-white" >
      <div className="flex items-baseline">
        <span className="text-sm font-bold">15</span>
        <span className="text-[10px] font-normal ml-1">Days</span>
      </div>
      <span className="text-lg font-bold">:</span>
      <div className="flex items-baseline">
        <span className="text-sm font-bold">03</span>
        <span className="text-[10px] font-normal ml-1">Hours</span>
      </div>
    </div>
  );
};

export default CountdownRelease;
