import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { Toaster } from "./components/shared/toaster";

export default function App() {
   const queryClient = new QueryClient();
   return (
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <AppRouter />
            <Toaster />
         </BrowserRouter>
      </QueryClientProvider>
   );
}
