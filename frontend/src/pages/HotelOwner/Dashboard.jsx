import React from "react";
import { useState, useEffect } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { currency, axios, setShowHotelReg } = useAppContext();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("/api/bookings/hotel");

        if (data.success) {
          setDashboardData(data.dashboardData);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listings, track bookings and analyze revenue — all in one place."
      />

      {/* Register Hotel Button */}
      <button
        onClick={() => setShowHotelReg(true)}
        className="mt-6 bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
      >
        Register Hotel
      </button>

      {/* Loading */}
      {loading && (
        <p className="mt-10 text-gray-500">Loading dashboard...</p>
      )}

      {/* Stats */}
      {!loading && dashboardData && (
        <>
          <div className="flex flex-wrap gap-4 my-8">
            {/* Bookings */}
            <div className="bg-primary/5 border border-primary/20 rounded flex items-center p-4 pr-8">
              <img
                src={assets.totalBookingIcon}
                className="hidden sm:block h-10"
                alt="Bookings"
              />

              <div className="flex flex-col sm:ml-4">
                <p className="text-blue-600 font-medium">
                  Total Bookings
                </p>

                <p className="text-gray-600 text-lg">
                  {dashboardData.totalBookings}
                </p>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-primary/5 border border-primary/20 rounded flex items-center p-4 pr-8">
              <img
                src={assets.totalRevenueIcon}
                className="hidden sm:block h-10"
                alt="Revenue"
              />

              <div className="flex flex-col sm:ml-4">
                <p className="text-blue-600 font-medium">
                  Total Revenue
                </p>

                <p className="text-gray-600 text-lg">
                  {currency}
                  {dashboardData.totalRevenue}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <h2 className="text-xl text-blue-900/70 font-medium mb-5">
            Recent Bookings
          </h2>

          <div className="w-full max-w-3xl border border-gray-300 rounded-lg overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="py-3 px-4 text-left">User</th>

                    <th className="py-3 px-4 text-left max-sm:hidden">
                      Room
                    </th>

                    <th className="py-3 px-4 text-center">
                      Amount
                    </th>

                    <th className="py-3 px-4 text-center">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboardData.bookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 text-gray-500"
                      >
                        No bookings yet
                      </td>
                    </tr>
                  ) : (
                    dashboardData.bookings.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3 px-4">
                          {item?.user?.username || "N/A"}
                        </td>

                        <td className="py-3 px-4 max-sm:hidden">
                          {item?.room?.roomType || "N/A"}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {currency}
                          {item?.totalPrice}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              item?.isPaid
                                ? "bg-green-200 text-green-600"
                                : "bg-yellow-200 text-yellow-600"
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