

export const getfromS3 = async (filename, expiresIn = 600) => {

    const baseUrl = process.env.AGENT_SERVICE;

    if (!baseUrl) {
        throw new Error("AGENT_SERVICE_URL is not configured");
    }

    return `${baseUrl}/files/download/${encodeURIComponent(filename)}`;
};



// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { s3 } from "../config/s3.js";
// import { GetObjectCommand } from "@aws-sdk/client-s3";

// export const getfromS3 = async (filename, expiresIn = 600) => {
//     const command = new GetObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: filename,
//     });

//     return await getSignedUrl(
//         s3,
//         command,
//         {
//             expiresIn,
//         }
//     );
// };
