import Hotel from "../models/Hotel.js";

export const registerHotel = async (req, res) => {
  try {
    const ownerId = req.auth.userId;
    const { name, address, contact, city } = req.body;

    if (!name || !address || !contact || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, address, contact, city) are required.",
      });
    }

    // Check if owner already registered a hotel
    const existingHotel = await Hotel.findOne({ owner: ownerId });
    if (existingHotel) {
      return res.status(400).json({
        success: false,
        message: "You already registered a hotel.",
      });
    }

    // Create hotel
    const hotel = await Hotel.create({
      owner: ownerId,
      name: name.trim(),
      address: address.trim(),
      contact: contact.trim(),
      city: city.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Hotel registered successfully!",
      hotel,
    });
  } catch (error) {
    console.error("Hotel registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during hotel registration.",
    });
  }
};
