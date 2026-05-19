import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const initialAmenities = {
  "Free Wifi": false,
  "Free Breakfast": false,
  Service: false,
  "Mountain View": false,
  "Pool Access": false,
};

const AddRoom = () => {
  const { axios } = useAppContext();

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: "",
    amenities: initialAmenities,
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE IMAGE CHANGE
  // =========================
  const handleImageChange = (key, file) => {
    setImages((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const uploadedImages = Object.values(images).filter(Boolean);

      if (uploadedImages.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      const amenitiesArray = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );

      const formData = new FormData();

      formData.append("roomType", inputs.roomType);

      formData.append(
        "pricePerNight",
        Number(inputs.pricePerNight)
      );

      formData.append(
        "amenities",
        JSON.stringify(amenitiesArray)
      );

      uploadedImages.forEach((image) => {
        formData.append("images", image);
      });

      const { data } = await axios.post(
        "/api/rooms",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!data?.success) {
        toast.error(data?.message || "Failed to add room");
        return;
      }

      toast.success("Room added successfully");

      // RESET FORM
      setInputs({
        roomType: "",
        pricePerNight: "",
        amenities: initialAmenities,
      });

      setImages({
        1: null,
        2: null,
        3: null,
        4: null,
      });
    } catch (error) {
      console.error(
        "Add room error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Title
          align="left"
          font="outfit"
          title="Add Room"
          subTitle="Fill in the details carefully and accurately."
        />

        {/* IMAGES */}
        <p className="text-gray-800 mt-10">Images</p>

        <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
          {Object.keys(images).map((key) => (
            <label key={key}>
              <img
                className="max-h-32 w-32 object-cover cursor-pointer opacity-80 rounded border"
                src={
                  images[key]
                    ? URL.createObjectURL(images[key])
                    : assets.uploadArea
                }
                alt="upload"
              />

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(
                    key,
                    e.target.files[0]
                  )
                }
              />
            </label>
          ))}
        </div>

        {/* ROOM DETAILS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div>
            <p className="mb-2">Room Type</p>

            <select
              value={inputs.roomType}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  roomType: e.target.value,
                }))
              }
              className="border p-2 rounded w-52"
              required
            >
              <option value="">Select</option>

              <option value="Single Bed">
                Single Bed
              </option>

              <option value="Double Bed">
                Double Bed
              </option>

              <option value="Luxury Room">
                Luxury Room
              </option>

              <option value="Family Suite">
                Family Suite
              </option>
            </select>
          </div>

          <div>
            <p className="mb-2">Price / Night</p>

            <input
              type="number"
              min="1"
              value={inputs.pricePerNight}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  pricePerNight: e.target.value,
                }))
              }
              className="border p-2 rounded w-52"
              placeholder="50000"
              required
            />
          </div>
        </div>

        {/* AMENITIES */}
        <p className="mt-6 mb-3 text-gray-800">
          Amenities
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.keys(inputs.amenities).map(
            (amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={
                    inputs.amenities[amenity]
                  }
                  onChange={() =>
                    setInputs((prev) => ({
                      ...prev,
                      amenities: {
                        ...prev.amenities,
                        [amenity]:
                          !prev.amenities[
                            amenity
                          ],
                      },
                    }))
                  }
                />

                <span>{amenity}</span>
              </label>
            )
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 mt-8 rounded disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;