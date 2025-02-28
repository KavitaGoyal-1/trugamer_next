import React from 'react';

interface RatingButtonProps {
  number: number;
  bgcolor?: boolean;
  onClick?: () => void; // Make bgcolor prop optional with '?'
}

const RatingButton: React.FC<RatingButtonProps> = ({ number, bgcolor, onClick }) => {
  return (
    <div className={`text-white w-6 h-6 flex items-center justify-center px-1 rounded-full ${bgcolor ? 'bg-sky-400' : 'bg-cPurple-light'} `}>
      <button className='text-xs font-semibold w-full' onClick={onClick}>{number}
      </button>
    </div>
  );
}

export default RatingButton;
