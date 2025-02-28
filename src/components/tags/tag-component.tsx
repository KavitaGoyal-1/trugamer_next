import React from "react";
import {RxCross2} from 'react-icons/rx';
interface TagProps {
    tag: string;
    id: number;
    onRemove: (id: number) => void;
}

const TagComponent: React.FC<TagProps> = ({ tag, id , onRemove}) => {
    // Your component logic here
    const handleRemoveClick = () => {
        onRemove(id); // Call onRemove when the remove button is clicked
      };
    return (
        <div onClick={handleRemoveClick} className="rounded-md px-2 bg-white text-black flex flex-row justify-between inline-block h-8 items-center gap-2">
            <p className="block text-gray-700 text-sm font-bold ml-2">{tag}</p>
            <RxCross2 className="text-sm"/>
        </div>
    );
};

export default TagComponent;
