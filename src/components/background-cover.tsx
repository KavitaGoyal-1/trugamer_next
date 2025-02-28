import { FC } from "react";

interface IProps {
  bgImage: string;
}

const BackgroundCover: FC<IProps> = ({ bgImage }) => {
  return (
    <>
      {bgImage ? (
        <div
          style={{
            zIndex: 1,
            backgroundImage: `radial-gradient(59.57% 62.95% at 50% 21.65%, rgba(10, 2, 18, 0) 0%, rgba(2, 6, 18, 0.95) 99.3%),  url(${bgImage})`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            height: "90vh",
            top: 0,
            left: 0,
            right: 0,
          }}
          className="bg-image"
         />
      ) : null}
    </>
  );
};

export default BackgroundCover;
