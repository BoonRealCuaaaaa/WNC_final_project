import { createHmac, createSign, createVerify } from "crypto";
import * as dotenv from "dotenv";
import { ASYMMETRIC_ENCRYPTION_ALGORITHM } from "../../constant/encryption-algorithm.js";
dotenv.config();
import * as openpgp from "openpgp";

export const generateHash = (algorithm, data) => {
  return createHmac(algorithm, process.env.SECRET_KEY)
    .update(data)
    .digest("hex");
};

export const generateRSASignature = (data, privateKey) => {
  const signer = createSign(ASYMMETRIC_ENCRYPTION_ALGORITHM.RSA);
  signer.update(data);
  signer.end();
  return signer.sign(privateKey, "hex");
};

export const verifyRSASignature = (data, signature, publicKey) => {
  const verifier = createVerify(ASYMMETRIC_ENCRYPTION_ALGORITHM.RSA);
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKey, signature, "hex");
};

export async function verifyPGPSignature(data, signature, publicKeyArmored) {
  try {
    const message = await openpgp.createMessage({ text: data });

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const sign = await openpgp.readSignature({
        armoredSignature: signature, // parse detached signature
    });

    const verificationResult = await openpgp.verify({
      message, // Message object
      signature: sign,
      verificationKeys: publicKey,
    });

    const { signatures } = verificationResult;

    if (signatures.length === 0) {
      return false; // No signatures found
    }

    if (signatures[0].verified) {
      console.log("The PGP signature is valid!");
      return true;
    } else {
      console.log("The PGP signature is invalid!");
      return false;
    }
  } catch (error) {
    console.error("Error verifying signed message:", error);
    return false; // Handle any errors that occur during the process
  }
}

export async function generatePGPSignature(message, privateKeyArmored) {
  try {
    // Read the private key
    const privateKey = await openpgp.readPrivateKey({
      armoredKey: privateKeyArmored,
    });

    const privateKeyPass = await openpgp.decryptKey({
      privateKey: privateKey,
      passphrase: "password123",
    });

    const detachedSignature = await openpgp.sign({
      message: await openpgp.createMessage({ text: message }),
      signingKeys: privateKeyPass,
      detached: true,
    });

    // const signature = await openpgp.readSignature({
    //   armoredSignature: detachedSignature, // parse detached signature
    // });

    return detachedSignature;
  } catch (error) {
    console.error("Error generating PGP signature:", error);
  }
}
