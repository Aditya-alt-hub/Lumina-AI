// import express from "express";
// import {agent} from "../controllers/agent.controller.js";
// import multer from "../config/multer.js";

// const router=express.Router();

// router.post("/chat",multer.single("file"),agent);

// export default router;


import express from "express";
import fs from "fs";
import os from "os";
import path from "path";

import { agent } from "../controllers/agent.controller.js";
import multer from "../config/multer.js";

const router = express.Router();


// Chat / AI Agent
router.post(
    "/chat",
    multer.single("file"),
    agent
);


// Temporary file download
router.get("/files/download/:filename", async (req, res) => {

    const filename = path.basename(req.params.filename);
    const filePath = path.join(os.tmpdir(), filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            message: "File not found or has expired"
        });
    }

    try {

        const stats = fs.statSync(filePath);

        const fileAge = Date.now() - stats.mtimeMs;

        const TEN_MINUTES = 10 * 60 * 1000;

        if (fileAge > TEN_MINUTES) {

            fs.unlink(filePath, () => {});

            return res.status(404).json({
                message: "File not found or has expired"
            });
        }

        res.download(filePath, filename, (err) => {

            if (err) {
                console.error("Download error:", err);
            }

        });

    } catch (error) {

        console.error("File access error:", error);

        return res.status(500).json({
            message: "Unable to download file"
        });

    }

});


export default router;