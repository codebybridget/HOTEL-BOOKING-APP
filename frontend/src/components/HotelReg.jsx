import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {
  const { setShowHotelReg, axios, getToken, setIsOwner, navigate } = useAppContext();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = await getToken({ template: "default" });

      if (!token) {
        toast.error("No authentication token found. Please sign in first.");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        "/api/hotels/",
        { name, contact, address, city },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Hotel registered successfully!");
        setIsOwner(true);
        setShowHotelReg(false);
        navigate("/owner");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Failed to register hotel.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/70"
    >
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2">
        <img src={assets.regImage} alt="Hotel Registration"
          className="w-1/2 rounded-l-xl hidden md:block"/>

        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img src={assets.closeIcon} alt="Close-icon"
           className="absolute top-4 right-4 h-4 w-4 cursor-pointer" onClick={() => setShowHotelReg(false)}/>
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          {/* Hotel Name */}
          <div className="w-full mt-4">
            <label htmlFor="name" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Type hotel name"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required/>
          </div>

          {/* Phone */}
          <div className="w-full mt-4">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Phone
            </label>
            <input id="contact" type="text" value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter phone number"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light" required/>
          </div>

          {/* Address */}
          <div className="w-full mt-4">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input id="address" type="text"  value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter street address" className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 
              outline-indigo-500 font-light" required/>
          </div>
              
            {/* City */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label htmlFor="city" className="font-medium text-gray-500">
              City
            </label>
            <select id="city" value={city} onChange={(e) => setCity(e.target.value)}
              className="border border-gray-200
             rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light" required>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}> {city} </option>
              ))}
            </select>
          </div>
          
          {/* Submit */}
          <button
            type="submit"
            disabled={loading} 
            className={`${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
            } transition-all text-white mr-auto px-6 py-2 rounded mt-6 flex items-center gap-2`} >
              Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
