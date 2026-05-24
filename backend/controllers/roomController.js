import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { cloudinary } from "../configs/cloudinary.js";

const uploadRoomImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "hotel_rooms",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
};

// CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    const ownerId = req.auth?.userId;
    const { roomType, pricePerNight, amenities } = req.body;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
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

    const hotel = await Hotel.findOne({
      owner: ownerId,
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "No hotel found for this user",
      });
    }

    if (!hotel.area) {
      return res.status(400).json({
        success: false,
        message: "Please update your hotel area before adding rooms",
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

      parsedAmenities = parsedAmenities
        .map((item) => String(item).trim())
        .filter(Boolean);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid amenities format",
      });
    }

    let images = [];

    try {
      const results = await Promise.all(
        req.files.map((file) => uploadRoomImageToCloudinary(file))
      );

      images = results.map((result) => result.secure_url);
    } catch (error) {
      console.error("Image upload error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Image upload failed",
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

    const populatedRoom = await Room.findById(room._id).populate({
      path: "hotel",
      select: "name address contact city area images rating isActive owner",
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: populatedRoom,
    });
  } catch (error) {
    console.error("Room creation error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// GET ALL AVAILABLE ROOMS
export const getRooms = async (req, res) => {
  try {
    const { destination, area } = req.query;

    const hotelFilter = {
      isActive: true,
    };

    if (destination) {
      hotelFilter.city = {
        $regex: destination,
        $options: "i",
      };
    }

    if (area) {
      hotelFilter.area = {
        $regex: area,
        $options: "i",
      };
    }

    const hotels = await Hotel.find(hotelFilter).select("_id");

    const hotelIds = hotels.map((hotel) => hotel._id);

    const roomFilter = {
      isAvailable: true,
    };

    if (destination || area) {
      roomFilter.hotel = {
        $in: hotelIds,
      };
    }

    const rooms = await Room.find(roomFilter)
      .populate({
        path: "hotel",
        select: "name address contact city area images rating isActive owner",
      })
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
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const hotel = await Hotel.findOne({
      owner: ownerId,
    });

    if (!hotel) {
      return res.json({
        success: true,
        rooms: [],
      });
    }

    const rooms = await Room.find({
      hotel: hotel._id,
    })
      .populate({
        path: "hotel",
        select: "name address contact city area images rating isActive owner",
      })
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
    const roomId = req.params.id || req.body.roomId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
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

    const populatedRoom = await Room.findById(room._id).populate({
      path: "hotel",
      select: "name address contact city area images rating isActive owner",
    });

    return res.json({
      success: true,
      message: "Room availability updated",
      isAvailable: populatedRoom.isAvailable,
      room: populatedRoom,
    });
  } catch (error) {
    console.error("Toggle availability error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};