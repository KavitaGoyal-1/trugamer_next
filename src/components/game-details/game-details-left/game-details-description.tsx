const GameDetailsDescription = ({ description }: { description: string }) => {
    return (
        <div className="grid gap-4 pr-4">
            <h2 className="font-bold text-[24px]">Description</h2>
            <p className="font-normal opacity-60 text-base text-ellipsis overflow-hidden">{description}</p>
        </div>
    )
}
export default GameDetailsDescription;
