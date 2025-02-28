import { FiAward } from 'react-icons/fi';
const GameRating = ({ rating }: { rating: number }) => {
   
    return (
        <div className="flex ">
            <div className="flex flex-col my-2 md:flex-row justify-center	items-center	">
                {rating && <div className='flex items-center mb-2 md:md-0 gap-1'>
                    <FiAward  size={28} className='text-blue-500  '/>
                    <span className="text-[24px] font-bold ml-2 mt-[2px]">
                    {+(rating)}/ 10 Rating
                    </span>

                </div>}
              
                
            </div>
            
        </div>
    );
};

export default GameRating;
