
const SectionHeading = ({ title }: any) => {
    return (
        <div className="flex justify-start md:p-5 pb-4 p-3">
            <div className="relative w-full text-start">
                <h3 className="details-gradient section-heading-one">{title}</h3>
            </div>
        </div>
    )
}

export default SectionHeading;