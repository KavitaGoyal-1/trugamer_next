import { postCommentFn } from "@/services/comments";
import { Comment } from "@/types/comments";
import { getToken } from "@/utills/cookies";
import React, { FC, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface Iprops {
  threadOf?: number;
  thread?: Comment | null;
  commentId?: number;
  setThreadData?: React.Dispatch<SetStateAction<Comment | null>>;
  refetch: () => void;
}

const PostComment: FC<Iprops> = ({
  thread,
  commentId,
  setThreadData,
  refetch,
}) => {
  const [comment, setComment] = useState("");
  const pathname = usePathname();
  const user = useSelector((state: any) => state?.authState?.userData);
  const token = getToken();
  const router = useRouter();

  const postComment = async (e: any) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to comment", { toastId: "1" });
      router.push("/sign-in");
      return;
    }

    // if (!pathname.state.newsId && !user) {
    //   toast.error("Something went wrong", { toastId: "2" });
    // }

    let dataToSend: any = {
      author: {
        id: user?.id,
        name: user?.username,
        avatar: user?.picture?.url,
      },
      content: comment,
    };
    try {
      // await postCommentFn(
      //   dataToSend,
      //   // loc.state.newsId,
      //   thread?.id ? thread?.id : commentId
      // );
      setComment("");
      setThreadData && setThreadData(null);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`w-full relative ${thread ? "mt-12" : ""}`}>
      {thread && (
        <div className="absolute -top-8 bg-gray-800 transition-all w-[85%] md:w-[90%] left-4 md:left-8 m-auto p-1 rounded-t-xl">
          <p className="px-2 w-full flex justify-between items-center">
            <span className="text-xs">Replying to {thread?.author?.name}</span>
            <span onClick={() => setThreadData && setThreadData(null)}>x</span>
          </p>
        </div>
      )}
      <form onSubmit={postComment}>
        <div className="z-10 flex items-center px-2 py-1 rounded-3xl  bg-gray-500 gap-2">
          <Image
            className="w-9 h-9  rounded-full"
            width={36}
            height={36}
            alt="post comment icon"
            title="post comment icon"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr46ydiwgJKxiV5C7tTyEzY-vIOEF_KtcAtg&usqp=CAU"
          />
          <div className="flex gap-2 w-full flex items-center h-full">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-white !h-full rounded-2xl bg-transparent focus:outline-none border-none p-2"
              placeholder="Write a comment..."
            />
            <div className="flex justify-end"></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostComment;
