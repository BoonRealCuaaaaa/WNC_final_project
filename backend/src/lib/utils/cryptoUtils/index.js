import {createHmac, createSign, createVerify} from "node:crypto";
import * as dotenv from "dotenv";
dotenv.config();

const ASYMMETRIC_ENCRYPTION_ALGORITHM = process.env.ASYMMETRIC_ENCRYPTION_ALGORITHM || 'RSA-SHA256'

export const generateHash = (algorithm, data) => {
    return createHmac(algorithm, process.env.SECRET_KEY)
    .update()
    .digest("hex");
}

export const generateSignature = (data, privateKey) => {
    const signer = createSign(ASYMMETRIC_ENCRYPTION_ALGORITHM);
    signer.update(data);
    signer.end();
    return signer.sign(privateKey, 'based64');
}

export const verifySignature = (data, signature, publicKey) => {
    const verifier = createVerifier(ASYMMETRIC_ENCRYPTION_ALGORITHM);
    verifier.update(data);
    verifier.end();
    return verifier.verify(publicKey, signature, 'based64');
}