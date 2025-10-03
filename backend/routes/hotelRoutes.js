import express from "express";
import { protect } from "../middleware/protect.js";
import Hotel from "../models/Hotel.js";

const router = express.Router();


router.post("/hotels", protect, async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;

    if (!name || !address || !contact || !city) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newHotel = await Hotel.create({
      name,
      address,
      contact,
      city,
      owner: req.user._id,
    });

    res.status(201).json({ success: true, message: "Hotel registered successfully", hotel: newHotel });
  } catch (error) {
    console.error(" Hotel creation error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
