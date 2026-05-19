import React, { useState, useEffect } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {
  const { setShowHotelReg, axios, navigate } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/hotels", formData);

      if (data?.success) {
        toast.success(data.message || "Hotel registered successfully!");
        setShowHotelReg(false);
        navigate("/owner");
        window.location.reload();
      } else {
        toast.error(data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Hotel registration error:", error.response?.data || error.message);

      toast.error(
        error?.response?.data?.message || "Failed to register hotel."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl w-full mx-4 overflow-hidden"
      >
        <img
          src={assets.regImage}
          alt="Hotel preview"
          className="w-1/2 hidden md:block object-cover"
        />

        <div className="relative flex flex-col w-full md:w-1/2 p-8 md:p-10">
          <button
            type="button"
            onClick={() => setShowHotelReg(false)}
            className="absolute top-4 right-4"
          >
            <img src={assets.closeIcon} alt="close" className="h-4 w-4" />
          </button>

          <h2 className="text-2xl font-semibold mt-6">
            Register Your Hotel
          </h2>

          {[
            { id: "name", label: "Hotel Name", type: "text" },
            { id: "contact", label: "Phone", type: "tel" },
            { id: "address", label: "Address", type: "text" },
          ].map((field) => (
            <div key={field.id} className="w-full mt-4">
              <label className="text-gray-500 text-sm">
                {field.label}
              </label>

              <input
                id={field.id}
                type={field.type}
                value={formData[field.id]}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500"
              />
            </div>
          ))}

          <div className="w-full mt-4">
            <label className="text-gray-500 text-sm">City</label>

            <select
              id="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 px-6 py-2 rounded text-white transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;