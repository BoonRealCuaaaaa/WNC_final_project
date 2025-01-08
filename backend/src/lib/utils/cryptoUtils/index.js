import { createHmac, createSign, createVerify, constants } from "crypto";
import * as dotenv from "dotenv";
import { ASYMMETRIC_ENCRYPTION_ALGORITHM } from "../../constant/encryption-algorithm.js";
dotenv.config();
import * as openpgp from "openpgp";

export const generateHash = (algorithm, data, secretKey) => {
  return createHmac(algorithm, secretKey).update(data).digest("hex");
};

export const generateRSASignature = (data, privateKey) => {
  const signer = createSign(ASYMMETRIC_ENCRYPTION_ALGORITHM.RSA);
  signer.update(data);
  signer.end();
  return signer.sign(privateKey, "base64");
};

export const verifyRSASignature = (data, signature, publicKey) => {
  const verifier = createVerify(ASYMMETRIC_ENCRYPTION_ALGORITHM.RSA);
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKey, signature, "base64");
};

// export async function verifyPGPSignature(data, signature, publicKeyArmored) {
//   try {
//     const message = await openpgp.createMessage({ text: data });

//     const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

//     const sign = await openpgp.readSignature({
//       armoredSignature: signature, // parse detached signature
//     });

//     const verificationResult = await openpgp.verify({
//       message, // Message object
//       signature: sign,
//       verificationKeys: publicKey,
//     });

//     const { signatures } = verificationResult;

//     if (signatures.length === 0) {
//       return false; // No signatures found
//     }

//     if (signatures[0].verified) {
//       console.log("The PGP signature is valid!");
//       return true;
//     } else {
//       console.log("The PGP signature is invalid!");
//       return false;
//     }
//   } catch (error) {
//     console.error("Error verifying signed message:", error);
//     return false; // Handle any errors that occur during the process
//   }
//}

export const verifyPGPSignature = async (data, providedSignature, publicKeyArmored) => {
  try {
      // Read the public key
      const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

      // Read the signed message
      const message = await openpgp.readMessage({ armoredMessage: providedSignature });

      // Verify the signature
      const verification = await openpgp.verify({
          message,
          verificationKeys: publicKey,
      });

      const isVerified = await verification.signatures[0].verified;
      return isVerified;
  } catch (error) {
      console.error('Error verifying PGP signature:', error);
      throw error;
  }
};


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

export async function generateSignature(algo, data, privateKey) {
  if (algo.toUpperCase() === "RSA") {
    return generateRSASignature(data, privateKey);
  } else if (algo.toUpperCase() === 'PGP') {
    return await generatePGPSignature(data, privateKey);
  }
  return '';
}

export async function verifySignature(algo, data, signature, publicKey) {
  if (algo.toUpperCase() === "RSA") {
    return verifyRSASignature(data, signature, publicKey);
  } else if (algo.toUpperCase() === 'PGP') {
    publicKey =  Buffer.from(publicKey, 'base64').toString('ascii');
    return await verifyPGPSignature(data, signature, publicKey);
  }
  return false;
}
