import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

// Create Room
export const createRoom = async (req, res) => {
  try {
    const ownerId = req.auth.userId;
    const { roomType, pricePerNight, amenities } = req.body;

    // Validate fields
    if (!roomType || !pricePerNight || !amenities) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const hotel = await Hotel.findOne({ owner: ownerId });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "No hotel found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Room images are required" });
    }

    let images = [];

    // Upload each image
    try {
      const uploads = req.files.map((file) =>
        cloudinary.uploader.upload(file.path).then((res) => res.secure_url)
      );
      images = await Promise.all(uploads);
    } catch (uploadErr) {
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    let parsedAmenities = [];
    try {
      parsedAmenities = JSON.parse(amenities);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid amenities format" });
    }

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: parsedAmenities,
      images,
    });

    return res.status(201).json({ success: true, message: "Room created successfully" });
  } catch (error) {
    console.error("Room creation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all available rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get rooms for authenticated hotel owner
export const getOwnerRooms = async (req, res) => {
  try {
    const ownerId = req.auth.userId;
    const hotel = await Hotel.findOne({ owner: ownerId });

    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    const rooms = await Room.find({ hotel: hotel._id }).populate("hotel");

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("Owner rooms error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ success: false, message: "Room ID is required" });
    }

    const room = await Room.findById(roomId).populate("hotel");

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Ensure owner matches
    if (room.hotel.owner !== req.auth.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.json({ success: true, message: "Room availability updated" });
  } catch (error) {
    console.error("Toggle availability error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
