import { getAccessToken, getRefreshToken, removeTokens, setAccessToken } from "./auth";
import axios, {
   AxiosError,
   AxiosRequestConfig,
   AxiosRequestHeaders,
   HttpStatusCode,
   InternalAxiosRequestConfig,
} from "axios";

const instance = axios.create({
   baseURL: import.meta.env.VITE_API_APP,
});

const requestAuthInterceptor = (req: AxiosRequestConfig): InternalAxiosRequestConfig => {
   const token = getAccessToken();

   if (token) {
      return {
         ...req,
         headers: {
            ...req.headers,
            Authorization: `Bearer ${token}`,
         } as AxiosRequestHeaders,
      };
   }

   return req as InternalAxiosRequestConfig;
};

const refreshAccessToken = async () => {
   const refreshToken = getRefreshToken();

   if (!refreshToken) {
      throw new Error("No refresh token found");
   }

   try {
      const response = await axios.post(`${import.meta.env.VITE_API_APP}/auth/refresh-token`, {
         refreshToken,
      });

      const newAccessToken = response.data.accessToken;

      if (newAccessToken) {
         setAccessToken(newAccessToken);
         return newAccessToken;
      }

      throw new Error("Failed to get new access token");
   } catch (error) {
      console.log(error);
      throw new Error("Failed to refresh token");
   }
};

const responseAuthErrorInterceptor = async (error: AxiosError) => {
   const { response, config } = error;
   const status = response?.status;


   if (status === HttpStatusCode.Unauthorized && !(config as any)._unretryable) {
      try {
         const newAccessToken = await refreshAccessToken();

         if (newAccessToken) {
            (config as any)._unretryable = true;
            (config as any).headers.Authorization = `Bearer ${newAccessToken}`;
            return await instance(config!);
         }
      } catch (refreshError) {
         removeTokens();
         window.location.href = "/login";
         return Promise.reject(refreshError);
      }
   }

   return Promise.reject(error);
};

instance.interceptors.request.use(requestAuthInterceptor);
instance.interceptors.response.use((response) => response, responseAuthErrorInterceptor);

export default instance;