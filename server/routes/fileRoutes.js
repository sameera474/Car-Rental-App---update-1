// server/routes/fileRoutes.js
import express from "express";
import mongoose from "mongoose";
import gridfsStream from "gridfs-stream";

const router = express.Router();

let gfs;
// When the connection is open, initialize GridFS stream.
mongoose.connection.once("open", () => {
  gfs = gridfsStream(mongoose.connection.db, mongoose.mongo);
  // Set the collection (bucket name) to "uploads"
  gfs.collection("uploads");
});

// GET /files/:filename - Stream file from GridFS
router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  gfs.files.findOne({ filename: filename }, (err, file) => {
    if (err || !file) {
      return res.status(404).json({ message: "File not found" });
    }

    // If the file is found, set the appropriate headers.
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);

    // Create a read stream and pipe to response.
    const readstream = gfs.createReadStream({ filename: file.filename });
    readstream.on("error", (err) => {
      console.error("Read stream error:", err);
      res.status(500).json({ message: "Error reading file" });
    });
    readstream.pipe(res);
  });
});

export default router;
