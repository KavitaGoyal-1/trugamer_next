import { selectAuthState } from "@/store/slices/auth-slice";
import { useSelector } from "react-redux";

const TestContextPage = () => {
  const { userData } = useSelector(selectAuthState);
  const { id, email, username } = userData;
  return (
    <div className="grid place-content-center place-items-center">
      <h1>TestContextPage</h1>

      {id && (
        <div>
          <p className="text-white">{`User name is ${username}`}</p>
          <p className="text-white">{`User email is ${email}`}</p>
        </div>
      )}
    </div>
  );
};

export default TestContextPage;
