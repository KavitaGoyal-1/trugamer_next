import React, { FC, SetStateAction } from "react";
 
 

const CommentBody: FC<{
  comment: Comment;
  setThreadData: React.Dispatch<SetStateAction<Comment | null>>;
  handleDelete: (commentId: string) => void;
  parent?: Comment;
}> = ({ comment, setThreadData, parent, handleDelete }) => {
  return (
     <></>
  );
};

 

const Replies: FC<any> = ({ replies, setThreadData, handleDelete }) => {
  return (
    <>
      <div className={`bg-cBlue-special rounded-2xl py-2 ml-2 `}>
        <CommentBody
          comment={replies}
          setThreadData={setThreadData}
          parent={replies}
          handleDelete={handleDelete}
        />
      </div>
      {replies?.children && replies?.children?.length > 0 && (
        <div className={`  `}>
          {replies?.children?.map((reply: any, index: number) => (
            <Replies
              key={index}
              replies={reply}
              setThreadData={setThreadData}
              handleDelete={handleDelete}
              parent={replies}
            />
          ))}
        </div>
      )}
    </>
  );
};

 
 

 
 
 
