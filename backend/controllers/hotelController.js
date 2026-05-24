import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { cloudinary } from "../configs/cloudinary.js";

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "hotels",
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

// REGISTER HOTEL
export const registerHotel = async (req, res) => {
  try {
    const ownerId = req.auth?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let { name, address, contact, city, area } = req.body;

    if (!name || !address || !contact || !city || !area) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    name = name.trim();
    address = address.trim();
    contact = contact.trim();
    city = city.trim().toLowerCase();
    area = area.trim().toLowerCase();

    if (contact.length < 7) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact number",
      });
    }

    const existingHotel = await Hotel.findOne({
      owner: ownerId,
    });

    if (existingHotel) {
      return res.status(200).json({
        success: true,
        message: "Hotel already registered",
        hotel: existingHotel,
      });
    }

    let images = [];

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      images = [result.secure_url];
    }

    const hotel = await Hotel.create({
      owner: ownerId,
      name,
      address,
      contact,
      city,
      area,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Hotel registered successfully",
      hotel,
    });
  } catch (error) {
    console.error("Hotel registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register hotel",
    });
  }
};

// GET ALL HOTELS
export const getHotels = async (req, res) => {
  try {
    const { destination, area } = req.query;

    const filter = {
      isActive: true,
    };

    if (destination) {
      filter.city = {
        $regex: destination,
        $options: "i",
      };
    }

    if (area) {
      filter.area = {
        $regex: area,
        $options: "i",
      };
    }

    const hotels = await Hotel.find(filter).sort({
      createdAt: -1,
    });

    const hotelsWithRooms = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({
          hotel: hotel._id,
          isAvailable: true,
        }).sort({
          pricePerNight: 1,
        });

        return {
          ...hotel.toObject(),
          rooms,
          roomsCount: rooms.length,
          lowestPrice:
            rooms.length > 0
              ? Math.min(...rooms.map((room) => room.pricePerNight))
              : 0,
        };
      })
    );

    return res.json({
      success: true,
      hotels: hotelsWithRooms,
    });
  } catch (error) {
    console.error("Get hotels error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
    });
  }
};

// GET SINGLE HOTEL WITH ROOMS
export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const rooms = await Room.find({
      hotel: hotel._id,
      isAvailable: true,
    }).sort({
      pricePerNight: 1,
    });

    return res.json({
      success: true,
      hotel,
      rooms,
    });
  } catch (error) {
    console.error("Get hotel details error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotel details",
    });
  }
};

// GET OWNER HOTEL
export const getOwnerHotel = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.json({
      success: true,
      hotel,
    });
  } catch (error) {
    console.error("Get owner hotel error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotel",
    });
  }
};

// UPDATE OWNER HOTEL
export const updateOwnerHotel = async (req, res) => {
  try {
    const ownerId = req.auth?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let { name, address, contact, city, area } = req.body;

    if (!name || !address || !contact || !city || !area) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    name = name.trim();
    address = address.trim();
    contact = contact.trim();
    city = city.trim().toLowerCase();
    area = area.trim().toLowerCase();

    if (contact.length < 7) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact number",
      });
    }

    const updateData = {
      name,
      address,
      contact,
      city,
      area,
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      updateData.images = [result.secure_url];
    }

    const hotel = await Hotel.findOneAndUpdate(
      {
        owner: ownerId,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    return res.json({
      success: true,
      message: "Hotel details updated successfully",
      hotel,
    });
  } catch (error) {
    console.error("Update hotel error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update hotel",
    });
  }
};