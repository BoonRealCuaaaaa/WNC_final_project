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
