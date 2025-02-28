import moment from "moment";

const CardReleseDate = ({
  releaseDate,
  type,
}: {
  releaseDate: string;
  type: string;
}) => {
  const formatedDate = releaseDate
    ? moment(releaseDate).format("MM/DD/YYYY")
    : "";
    return (
    <>
      {releaseDate && (
        <span
          className={`absolute bg-cPurple-light  border-cBlack-dark border-4 md:border-[6px] top-[-10px]  text-cBlack-dark font-medium  min-[320px]  ${
            type == "related"
              ? "-left-inherit right-[-10px] text-sm p-0 px-0.5 rounded-xl"
              : "-right-[5%] text-base p-2 rounded-xl"
          }`}
        >
          {`${formatedDate}`}
        </span>
      )}
    </>
  );
};

export default CardReleseDate;
