import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const ListRoom = () => {
  const { currency, axios } = useAppContext();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerRooms = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/rooms/owner");

      if (data?.success) {
        setRooms(data.rooms || []);
      } else {
        setRooms([]);
        toast.error(data?.message || "Failed to fetch rooms");
      }
    } catch (error) {
      console.error(
        "Fetch owner rooms error:",
        error.response?.data || error.message
      );

      setRooms([]);
      toast.error(error.response?.data?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (roomId) => {
    try {
      const { data } = await axios.patch(`/api/rooms/${roomId}/availability`, {
        roomId,
      });

      if (!data?.success) {
        toast.error(data?.message || "Failed to update availability");
        return;
      }

      toast.success(data.message || "Availability updated");

      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? { ...room, isAvailable: data.isAvailable }
            : room
        )
      );
    } catch (error) {
      console.error(
        "Toggle availability error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    }
  };

  useEffect(() => {
    fetchOwnerRooms();
  }, []);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms."
      />

      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className="w-full max-w-4xl border border-gray-300 rounded-lg mt-3 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>

                <th className="py-3 px-4 text-left max-sm:hidden">
                  Facilities
                </th>

                <th className="py-3 px-4 text-left">Price / night</th>

                <th className="py-3 px-4 text-center">Available</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Loading rooms...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No rooms listed yet
                  </td>
                </tr>
              ) : (
                rooms.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="py-3 px-4 text-gray-700">
                      {item.roomType || "Unnamed Room"}
                    </td>

                    <td className="py-3 px-4 text-gray-700 max-sm:hidden">
                      {Array.isArray(item.amenities) && item.amenities.length > 0
                        ? item.amenities.join(", ")
                        : "No facilities"}
                    </td>

                    <td className="py-3 px-4 text-gray-700">
                      {currency}
                      {item.pricePerNight || 0}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(item._id)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                          item.isAvailable ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`bg-white w-4 h-4 rounded-full transform transition ${
                            item.isAvailable ? "translate-x-6" : ""
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListRoom;