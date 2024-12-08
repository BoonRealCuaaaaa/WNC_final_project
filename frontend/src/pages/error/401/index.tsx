import { removeTokens } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

const PageError401 = () => {
   const navigate = useNavigate();
   return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
         <h1 className="text-9xl font-bold text-red-600">401</h1>
         <h2 className="text-2xl font-medium text-gray-700 mt-4">Unauthorized</h2>
         <button
         className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={() => {
               removeTokens();
               navigate("/login");
            }}>
            Logout
         </button>
      </div>
   );
};

export default PageError401;
