// "use server";
// import CryptoJS from "crypto-js";
// import { getUserByEmail } from "./user";

// export async function updateProfileImage(userEmail: string, image: string) {
//   try {
//     if (!(await getUserByEmail(userEmail)))
//       throw new Error("Internal Server Error");
//     await prisma?.user.update({
//       where: {
//         email: userEmail,
//       },
//       data: {
//         image,
//       },
//     });
//     return "Updated the Profile Pic";
//   } catch (error) {
//     throw new Error("Internal Server Error");
//   }
// }

// export async function encryptImageString(image: string) {
//   const encryptionKey = CryptoJS.enc.Utf8.parse(process.env.AES_KEY!);

//   const encryptedImage = CryptoJS.AES.encrypt(image, encryptionKey, {
//     mode: CryptoJS.mode.ECB,
//   });

//   return encryptedImage.ciphertext.toString(CryptoJS.enc.Base64);
// }

// export async function decryptImageString(image: string) {
//   const encryptionKey = CryptoJS.enc.Utf8.parse(process.env.AES_KEY!);

//   const decryptedImage = CryptoJS.AES.decrypt(image, encryptionKey, {
//     mode: CryptoJS.mode.ECB,
//   });

//   return decryptedImage.toString(CryptoJS.enc.Utf8);
// }
