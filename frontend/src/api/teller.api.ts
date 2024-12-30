import instance from "@/utils/axios";

export const getAllCustomerApi = () => {
    return instance.get("/teller/customer");
}

export const createCustomerApi = (data) => {
    return instance.post("/teller/customer/create", data);
}

export const depositCustomerApi = (data) => {
    return instance.post("/teller/deposit", data);
}

export const getCustomerTransactionApi = (customerId) => {
    return instance.get(`/teller/customer/${customerId}/history`);
}