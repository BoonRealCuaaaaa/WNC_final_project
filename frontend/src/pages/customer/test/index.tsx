import { getHello } from "@/api/auth.api";
import { removeTokens } from "@/utils/auth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const TestPage = () => {
   const navigate = useNavigate();

   const query = useQuery({ queryKey: ["todos"], queryFn: getHello });
   return (
      <>
         <div>Test Page</div>
         <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={() => {
               removeTokens();
               navigate("/auth/login");
            }}>
            Logout
         </button>
         <h1>{query.data?.data}</h1>
         <button
            onClick={() => {
               query.refetch();
            }}>
            Refetch
         </button>
      </>
   );
};

export default TestPage;
