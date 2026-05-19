import Hotel from "../models/Hotel.js";

export const registerHotel = async (req, res) => {
  try {
    const ownerId = req.auth?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let { name, address, contact, city } = req.body;

    if (!name || !address || !contact || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    name = name.trim();
    address = address.trim();
    contact = contact.trim();
    city = city.trim().toLowerCase();

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

    const hotel = await Hotel.create({
      owner: ownerId,
      name,
      address,
      contact,
      city,
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
      message: "Failed to register hotel",
    });
  }
};