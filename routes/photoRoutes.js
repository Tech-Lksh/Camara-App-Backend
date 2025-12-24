const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const Photo = require("../models/Photo");

/**
 * POST /api/photo/upload
 * Receives base64 image → uploads to Cloudinary → saves URL in MongoDB
 */
router.post("/upload", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "hidden_camera_app"
    });

    const savedPhoto = await Photo.create({
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

    res.status(201).json({
      success: true,
      photo: savedPhoto
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/photo/all
 * Fetch all uploaded photos
 */
router.get("/all", async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
