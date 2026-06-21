import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (buffer: Buffer, folder: string) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    console.log("🔥 CLOUDINARY ERROR FULL:");
                    console.dir(error, { depth: null });
                    return reject(error);
                }

                if (!result) {
                    console.log("❌ NO RESULT FROM CLOUDINARY");
                    return reject(new Error("No result"));
                }

                console.log("✅ CLOUDINARY SUCCESS");
                console.log(result);

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        stream.on("error", (err) => {
            console.log("🔥 STREAM ERROR:", err);
            reject(err);
        });

        stream.end(buffer);
    });
};

export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};
