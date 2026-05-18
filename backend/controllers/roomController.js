import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { cloudinary } from "../configs/cloudinary.js";

// ==========================
// CREATE ROOM
// ==========================
export const createRoom = async (req, res) => {
  try {
    const ownerId = req.auth.userId;
    const { roomType, pricePerNight, amenities } = req.body;

    if (!roomType || !pricePerNight || !amenities) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const hotel = await Hotel.findOne({ owner: ownerId });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotel found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Room images are required",
      });
    }

    // Upload images
    let images = [];
    try {
      const uploads = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "hotel_rooms",
        })
      );

      const results = await Promise.all(uploads);
      images = results.map((r) => r.secure_url);
    } catch (err) {
      console.error("Image upload error:", err);
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    // Parse amenities
    let parsedAmenities = [];
    try {
      parsedAmenities = JSON.parse(amenities);

      if (!Array.isArray(parsedAmenities)) {
        throw new Error();
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid amenities format",
      });
    }

    const room = await Room.create({
      hotel: hotel._id,
      roomType: roomType.trim(),
      pricePerNight: Number(pricePerNight),
      amenities: parsedAmenities,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Room creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================
// GET ALL ROOMS
// ==========================
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

// ==========================
// GET OWNER ROOMS
// ==========================
export const getOwnerRooms = async (req, res) => {
  try {
    const ownerId = req.auth.userId;

    const hotel = await Hotel.findOne({ owner: ownerId });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const rooms = await Room.find({ hotel: hotel._id })
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Owner rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

// ==========================
// TOGGLE AVAILABILITY
// ==========================
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const room = await Room.findById(roomId).populate("hotel");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Fix ObjectId comparison
    if (room.hotel.owner.toString() !== req.auth.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.json({
      success: true,
      message: "Room availability updated",
      isAvailable: room.isAvailable,
    });
  } catch (error) {
    console.error("Toggle availability error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};