import Hotel from "../models/Hotel.js";

export const registerHotel = async (req, res) => {
  try {
    const ownerId = req.auth.userId;
    let { name, address, contact, city } = req.body;

    // Validate
    if (!name || !address || !contact || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Normalize inputs
    name = name.trim();
    address = address.trim();
    contact = contact.trim();
    city = city.trim();

    // Prevent duplicate registration
    const existingHotel = await Hotel.findOne({ owner: ownerId });

    if (existingHotel) {
      return res.status(409).json({
        success: false,
        message: "Hotel already registered for this user",
      });
    }

    // Create hotel
    const hotel = await Hotel.create({
      owner: ownerId,
      name,
      address,
      contact,
      city,
    });

    // Clean response
    const responseHotel = {
      _id: hotel._id,
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
    };

    return res.status(201).json({
      success: true,
      message: "Hotel registered successfully",
      hotel: responseHotel,
    });
  } catch (error) {
    console.error("❌ Hotel registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to register hotel",
    });
  }
};