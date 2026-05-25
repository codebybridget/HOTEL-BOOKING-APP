import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { currency, axios, navigate } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    bookings: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/bookings/hotel");

        if (data?.success) {
          setDashboardData(data.dashboardData);
        } else {
          toast.error(data?.message || "Failed to load dashboard");
        }
      } catch (error) {
        console.error(
          "Dashboard error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [axios]);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor room listings, bookings and revenue in one place."
      />

      <button
        type="button"
        onClick={() => navigate("/owner/add-room")}
        className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
      >
        Register Hotel / Add Room
      </button>

      {loading ? (
        <p className="mt-10 text-gray-500">Loading dashboard...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 my-8">
            <div className="bg-primary/5 border border-primary/20 rounded-xl flex items-center p-4 pr-8">
              <img
                src={assets.totalBookingIcon}
                className="hidden sm:block h-10"
                alt="Bookings"
              />

              <div className="flex flex-col sm:ml-4">
                <p className="text-blue-600 font-medium">Total Bookings</p>

                <p className="text-gray-600 text-lg">
                  {dashboardData.totalBookings}
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl flex items-center p-4 pr-8">
              <img
                src={assets.totalRevenueIcon}
                className="hidden sm:block h-10"
                alt="Revenue"
              />

              <div className="flex flex-col sm:ml-4">
                <p className="text-blue-600 font-medium">Total Revenue</p>

                <p className="text-gray-600 text-lg">
                  {currency}
                  {Number(dashboardData.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-xl text-blue-900/70 font-medium mb-5">
            Recent Bookings
          </h2>

          <div className="w-full max-w-4xl border border-gray-300 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-left max-sm:hidden">Room</th>
                    <th className="py-3 px-4 text-center">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboardData.bookings.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-500">
                        No bookings yet
                      </td>
                    </tr>
                  ) : (
                    dashboardData.bookings.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3 px-4">
                          {item?.user?.username || "Guest"}
                        </td>

                        <td className="py-3 px-4 max-sm:hidden">
                          {item?.room?.roomType || "N/A"}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {currency}
                          {Number(item?.totalPrice || 0).toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              item?.isPaid
                                ? "bg-green-200 text-green-700"
                                : "bg-yellow-200 text-yellow-700"
                            }`}
                          >
                            {item?.isPaid ? "Completed" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;