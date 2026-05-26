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
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

// CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    const ownerId = req.auth?.userId;

    const {
      hotelId,
      roomType,
      roomSize,
      description,
      maxGuests,
      totalRooms,
      pricePerNight,
      amenities,
    } = req.body;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      !hotelId ||
      !roomType ||
      !roomSize ||
      !description ||
      !pricePerNight ||
      !totalRooms
    ) {
      return res.status(400).json({
        success: false,
        message: "All room fields are required",
      });
    }

    const hotel = await Hotel.findOne({
      _id: hotelId,
      owner: ownerId,
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Selected hotel not found",
      });
    }

    const price = Number(pricePerNight);
    const total = Number(totalRooms);

    if (Number.isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid room price",
      });
    }

    if (Number.isNaN(total) || total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total rooms count",
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
        parsedAmenities = [];
      }

      parsedAmenities = parsedAmenities
        .map((item) => String(item).trim())
        .filter(Boolean);
    } catch {
      parsedAmenities = [];
    }

    let images = [];

    try {
      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadRoomImageToCloudinary(file))
      );

      images = uploadedImages.map((item) => item.secure_url);
    } catch (error) {
      console.error("Cloudinary upload error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Failed to upload images",
      });
    }

    const room = await Room.create({
      hotel: hotel._id,
      roomType: roomType.trim(),
      roomSize: roomSize.trim(),
      description: description.trim(),
      maxGuests: Number(maxGuests) || 1,
      totalRooms: total,
      bookedRooms: 0,
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
      message: "Room added successfully",
      room: populatedRoom,
    });
  } catch (error) {
    console.error("Create room error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create room",
    });
  }
};

// GET ALL ROOMS
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

    const roomFilter = {};

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
      .sort({
        createdAt: -1,
      });

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

    const ownerHotels = await Hotel.find({
      owner: ownerId,
    }).select("_id");

    const hotelIds = ownerHotels.map((hotel) => hotel._id);

    const rooms = await Room.find({
      hotel: {
        $in: hotelIds,
      },
    })
      .populate({
        path: "hotel",
        select: "name address contact city area images rating isActive owner",
      })
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Get owner rooms error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch owner rooms",
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
    });
  } catch (error) {
    console.error("Toggle room error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update room",
    });
  }
};