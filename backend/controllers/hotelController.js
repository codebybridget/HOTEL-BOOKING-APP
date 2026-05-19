import Hotel from "../models/Hotel.js";

export const registerHotel = async (req, res) => {
  try {
    const ownerId = req.auth.userId;
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

    const existingHotel = await Hotel.findOne({ owner: ownerId });

    if (existingHotel) {
      return res.json({
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

    res.status(201).json({
      success: true,
      message: "Hotel registered successfully",
      hotel,
    });
  } catch (error) {
    console.error("Hotel registration error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to register hotel",
    });
  }
};