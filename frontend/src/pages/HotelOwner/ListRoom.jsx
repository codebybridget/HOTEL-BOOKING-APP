import React from "react";
import { useState } from "react";
import Title from "../../components/Title";
import { roomCommonData } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const ListRoom = () => {
  const { currency } = useAppContext();

  // Normalize data
  const normalizedRooms = roomCommonData.map((room, index) => ({
    _id: room._id || index,
    roomType: room.roomType || "Unnamed Room",
    amenities: Array.isArray(room.amenities) ? room.amenities : [],
    pricePerNight: room.pricePerNight || 0,
    isAvailable:
      typeof room.isAvailable === "boolean" ? room.isAvailable : false,
  }));

  const [rooms, setRooms] = useState(normalizedRooms);

  const toggleAvailability = (id) => {
    setRooms((prev) =>
      prev.map((room) =>
        room._id === id
          ? { ...room, isAvailable: !room.isAvailable }
          : room
      )
    );
  };

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms."
      />

      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className="w-full max-w-3xl border border-gray-300 rounded-lg mt-3 overflow-hidden">
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left max-sm:hidden">
                  Facilities
                </th>
                <th className="py-3 px-4 text-left">
                  Price / night
                </th>
                <th className="py-3 px-4 text-center">
                  Available
                </th>
              </tr>
            </thead>

            <tbody>
              {rooms.map((item) => (
                <tr key={item._id} className="border-t">
                  {/* Name */}
                  <td className="py-3 px-4 text-gray-700">
                    {item.roomType}
                  </td>

                  {/* Amenities */}
                  <td className="py-3 px-4 text-gray-700 max-sm:hidden">
                    {item.amenities.length > 0
                      ? item.amenities.join(", ")
                      : "No facilities"}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-gray-700">
                    {item.pricePerNight
                      ? `${currency}${item.pricePerNight}`
                      : "N/A"}
                  </td>

                  {/* Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() =>
                        toggleAvailability(item._id)
                      }
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                        item.isAvailable
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`bg-white w-4 h-4 rounded-full transform transition ${
                          item.isAvailable
                            ? "translate-x-6"
                            : ""
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListRoom;