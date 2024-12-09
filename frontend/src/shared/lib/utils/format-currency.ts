export const formatCurrency = (value) => {
   return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
   })
      .format(value)
      .replace("₫", "đ"); // Định dạng kiểu "170.000đ"
};
