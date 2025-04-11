// File: server/routes/fileRoutes.js
import express from "express";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

const router = express.Router();
let gfs;

mongoose.connection.once("open", () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

// GET /uploads/:filename - streams the file back to the client
router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  gfs.files.findOne({ filename }, (err, file) => {
    if (err || !file) {
      return res.status(404).json({ message: "No file exists" });
    }
    if (file.contentType.startsWith("image/")) {
      const readstream = gfs.createReadStream({ filename });
      res.set("Content-Type", file.contentType);
      readstream.pipe(res);
    } else {
      res.status(404).json({ message: "Not an image" });
    }
  });
});

export default router;
