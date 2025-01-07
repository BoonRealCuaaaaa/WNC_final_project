import { createHmac } from "node:crypto" 

export const generateHash = (algorithm, data, secretKey) => {
    return createHmac(algorithm, secretKey)
      .update(data)
      .digest("hex");
  };

  export const verifyRequestHash = (data, secretKey, providedHash) => {
    const payloadString = JSON.stringify(data);
    const computedHash = createHmac('sha256', secretKey).update(payloadString).digest('hex');
    return computedHash === providedHash;
};

const data = {data: "Hello"};
const secretKey = "secretKey";
const hash = generateHash('sha256', JSON.stringify(data), secretKey);
console.log(verifyRequestHash(data, secretKey, hash));