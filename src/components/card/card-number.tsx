interface ICardNumber{
    number: string|number;
    top?: string;
    bottom?: string;
    right?: string;
    left?: string;
}
const CardNumber = ({ number, top, bottom, right, left }:ICardNumber) => {
    return (
        <span
            className={`absolute text-[80px] font-bold text-cPurple-light
            ${top ? `top-[${top}px]` : ""}
            ${bottom ? `bottom-[${bottom}px]` : ""}
            ${right ? `right-[${right}px]` : ""}
            ${left ? `left-[${left}px]` : ""}
            `}
            style={{textShadow:' 8px 0 #0F111F, -4px 0 #0F111F, 0 8px #0F111F, 0 -8px #0F111F,4px 4px #0F111F, -4px -4px #0F111F, 4px -4px #0F111F, -4px 4px #0F111F'}}
        
        >
            {number}
        </span>
    );
};

export default CardNumber;