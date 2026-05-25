import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

// CHECK AVAILABILITY
export const checkAvailability = async ({
  checkInDate,
  checkOutDate,
  room,
}) => {
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const bookings = await Booking.find({
      room,
      status: { $ne: "cancelled" },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    return bookings.length === 0;
  } catch (error) {
    console.error(
      "Availability check failed:",
      error.message
    );

    return false;
  }
};

// CHECK AVAILABILITY API
export const checkAvailabilityAPI =
  async (req, res) => {
    try {
      const {
        checkInDate,
        checkOutDate,
        room,
      } = req.body;

      if (
        !checkInDate ||
        !checkOutDate ||
        !room
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing fields",
        });
      }

      const checkIn = new Date(
        checkInDate
      );

      const checkOut = new Date(
        checkOutDate
      );

      if (
        Number.isNaN(checkIn.getTime()) ||
        Number.isNaN(checkOut.getTime())
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }

      if (checkOut <= checkIn) {
        return res.status(400).json({
          success: false,
          message: "Invalid date range",
        });
      }

      const roomExists =
        await Room.findById(room);

      if (!roomExists) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      // SOLD OUT
      const availableRooms =
        Number(roomExists.totalRooms || 0) -
        Number(roomExists.bookedRooms || 0);

      if (availableRooms <= 0) {
        return res.json({
          success: true,
          isAvailable: false,
        });
      }

      if (!roomExists.isAvailable) {
        return res.json({
          success: true,
          isAvailable: false,
        });
      }

      const isAvailable =
        await checkAvailability({
          checkInDate,
          checkOutDate,
          room,
        });

      return res.json({
        success: true,
        isAvailable,
      });
    } catch (error) {
      console.error(
        "Check availability error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to check availability",
      });
    }
  };

// CREATE BOOKING
export const createBooking = async (
  req,
  res
) => {
  try {
    const {
      room,
      checkInDate,
      checkOutDate,
      guests,
    } = req.body;

    const user = req.auth?.userId;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      !room ||
      !checkInDate ||
      !checkOutDate ||
      !guests
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    const checkIn = new Date(
      checkInDate
    );

    const checkOut = new Date(
      checkOutDate
    );

    const guestCount =
      Number(guests);

    if (
      Number.isNaN(checkIn.getTime()) ||
      Number.isNaN(checkOut.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    if (
      Number.isNaN(guestCount) ||
      guestCount < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid guest count",
      });
    }

    const roomData =
      await Room.findById(room).populate(
        "hotel"
      );

    if (!roomData) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (!roomData.hotel) {
      return res.status(400).json({
        success: false,
        message:
          "Room is not linked to a hotel",
      });
    }

    // CHECK AVAILABLE COUNT
    const availableRooms =
      Number(roomData.totalRooms || 0) -
      Number(roomData.bookedRooms || 0);

    if (availableRooms <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "No rooms available",
      });
    }

    if (!roomData.isAvailable) {
      return res.status(400).json({
        success: false,
        message:
          "Room is currently unavailable",
      });
    }

    if (
      roomData.maxGuests &&
      guestCount >
        roomData.maxGuests
    ) {
      return res.status(400).json({
        success: false,
        message: `This room allows maximum ${roomData.maxGuests} guests`,
      });
    }

    const isAvailable =
      await checkAvailability({
        checkInDate,
        checkOutDate,
        room,
      });

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message:
          "Room is not available",
      });
    }

    const nights = Math.ceil(
      (checkOut.getTime() -
        checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const totalPrice =
      roomData.pricePerNight *
      nights;

    const booking =
      await Booking.create({
        user,
        room,
        hotel: roomData.hotel._id,
        guests: guestCount,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
      });

    // UPDATE BOOKED ROOMS
    roomData.bookedRooms =
      Number(roomData.bookedRooms || 0) + 1;

    // AUTO SOLD OUT
    if (
      roomData.bookedRooms >=
      roomData.totalRooms
    ) {
      roomData.isAvailable = false;
    }

    await roomData.save();

    return res.status(201).json({
      success: true,
      message:
        "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "Create booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// USER BOOKINGS
export const getUserBookings =
  async (req, res) => {
    try {
      const user =
        req.auth?.userId;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const bookings =
        await Booking.find({
          user,
        })
          .populate("room")
          .populate("hotel")
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        bookings,
      });
    } catch (error) {
      console.error(
        "User bookings fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// HOTEL DASHBOARD BOOKINGS
export const getHotelBookings =
  async (req, res) => {
    try {
      const ownerId =
        req.auth?.userId;

      if (!ownerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const hotel =
        await Hotel.findOne({
          owner: ownerId,
        });

      if (!hotel) {
        return res.json({
          success: true,
          dashboardData: {
            totalBookings: 0,
            totalRevenue: 0,
            bookings: [],
          },
        });
      }

      const bookings =
        await Booking.find({
          hotel: hotel._id,
        })
          .populate(
            "user",
            "username email image"
          )
          .populate("room")
          .populate("hotel")
          .sort({
            createdAt: -1,
          });

      const totalBookings =
        bookings.length;

      const totalRevenue =
        bookings.reduce(
          (acc, booking) =>
            acc +
            Number(
              booking.totalPrice || 0
            ),
          0
        );

      return res.json({
        success: true,
        dashboardData: {
          totalBookings,
          totalRevenue,
          bookings,
        },
      });
    } catch (error) {
      console.error(
        "Hotel booking fetch error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };