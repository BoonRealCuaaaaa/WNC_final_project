import instance from "@/utils/axios";

export const loginApi = async ({ username, password }) => {
   return instance.post("/auth/login", { username, password });
};

export const refreshApi = async () => {
   return instance.post("/auth/refresh");
};

// Example of protected API
export const getHello = async () => {
   return instance.get("/hello");
};

export const generateForgotPasswordOtpApi = async (email) => {
   return instance.post("/auth/otp", { email });
}

export const verifyForgotPasswordOtpApi = async ({email, otp}) => {
   return instance.post("/auth/verify-otp", { email, otp });
}

export const resetPasswordApi = async ({email, password}) => {
   return instance.post("/auth/reset-password", { email, password });
}