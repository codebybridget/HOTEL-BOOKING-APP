import fs from "fs";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { cloudinary } from "../configs/cloudinary.js";

// CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    const ownerId = req.auth?.userId;
    const { roomType, pricePerNight, amenities } = req.body;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!roomType || !pricePerNight || !amenities) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const price = Number(pricePerNight);

    if (Number.isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price per night",
      });
    }

    const hotel = await Hotel.findOne({ owner: ownerId });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotel found for this user",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Room images are required",
      });
    }

    let parsedAmenities = [];

    try {
      parsedAmenities =
        typeof amenities === "string" ? JSON.parse(amenities) : amenities;

      if (!Array.isArray(parsedAmenities)) {
        throw new Error("Amenities must be an array");
      }

      parsedAmenities = parsedAmenities.map((item) => String(item).trim());
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid amenities format",
      });
    }

    let images = [];

    try {
      const results = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "hotel_rooms",
            resource_type: "image",
          })
        )
      );

      images = results.map((result) => result.secure_url);
    } catch (error) {
      console.error("Image upload error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    } finally {
      req.files.forEach((file) => {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    const room = await Room.create({
      hotel: hotel._id,
      roomType: roomType.trim(),
      pricePerNight: price,
      amenities: parsedAmenities,
      images,
      isAvailable: true,
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Room creation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL AVAILABLE ROOMS
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate("hotel")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

// GET OWNER ROOMS
export const getOwnerRooms = async (req, res) => {
  try {
    const ownerId = req.auth?.userId;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const hotel = await Hotel.findOne({ owner: ownerId });

    if (!hotel) {
      return res.json({
        success: true,
        rooms: [],
      });
    }

    const rooms = await Room.find({ hotel: hotel._id })
      .populate("hotel")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Owner rooms error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

// TOGGLE ROOM AVAILABILITY
export const toggleRoomAvailability = async (req, res) => {
  try {
    const ownerId = req.auth?.userId;
    const { roomId } = req.body;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

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

    if (room.hotel.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    return res.json({
      success: true,
      message: "Room availability updated",
      isAvailable: room.isAvailable,
      room,
    });
  } catch (error) {
    console.error("Toggle availability error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};