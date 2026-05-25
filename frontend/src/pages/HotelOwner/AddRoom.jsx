import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { assets, cities } from "../../assets/assets";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const initialAmenities = {
  "Free Wifi": false,
  "Free Breakfast": false,
  Service: false,
  "Mountain View": false,
  "Pool Access": false,
  Gym: false,
  Parking: false,
  Restaurant: false,
};

const AddRoom = () => {
  const { axios } = useAppContext();

  const [hotel, setHotel] = useState(null);
  const [showEditHotel, setShowEditHotel] = useState(false);

  const [hotelImage, setHotelImage] = useState(null);

  const [hotelForm, setHotelForm] = useState({
    name: "",
    address: "",
    contact: "",
    city: "",
    area: "",
  });

  const [editHotelForm, setEditHotelForm] = useState({
    name: "",
    address: "",
    contact: "",
    city: "",
    area: "",
  });

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    roomSize: "",
    description: "",
    maxGuests: 1,
    pricePerNight: "",
    amenities: initialAmenities,
  });

  const [loading, setLoading] = useState(false);
  const [hotelLoading, setHotelLoading] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data } = await axios.get("/api/hotels/owner/me");

        if (data?.success) {
          setHotel(data.hotel);
        }
      } catch {
        setHotel(null);
      }
    };

    fetchHotel();
  }, [axios]);

  const handleRegisterHotel = async (e) => {
    e.preventDefault();

    try {
      setHotelLoading(true);

      const formData = new FormData();

      formData.append("name", hotelForm.name);
      formData.append("address", hotelForm.address);
      formData.append("contact", hotelForm.contact);
      formData.append("city", hotelForm.city);
      formData.append("area", hotelForm.area);

      if (hotelImage) {
        formData.append("image", hotelImage);
      }

      const { data } = await axios.post("/api/hotels", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data?.success) {
        setHotel(data.hotel);

        toast.success("Hotel registered successfully");

        setHotelImage(null);
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register hotel");
    } finally {
      setHotelLoading(false);
    }
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();

    try {
      setHotelLoading(true);

      const formData = new FormData();

      formData.append("name", editHotelForm.name);
      formData.append("address", editHotelForm.address);
      formData.append("contact", editHotelForm.contact);
      formData.append("city", editHotelForm.city);
      formData.append("area", editHotelForm.area);

      if (hotelImage) {
        formData.append("image", hotelImage);
      }

      const { data } = await axios.patch(
        "/api/hotels/owner/me",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        setHotel(data.hotel);

        toast.success("Hotel updated successfully");

        setShowEditHotel(false);

        setHotelImage(null);
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update hotel");
    } finally {
      setHotelLoading(false);
    }
  };

  const handleImageChange = (key, file) => {
    setImages((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!hotel) {
        toast.error("Please register hotel first");
        return;
      }

      const uploadedImages = Object.values(images).filter(Boolean);

      if (uploadedImages.length === 0) {
        toast.error("Upload at least one room image");
        return;
      }

      const amenitiesArray = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );

      const formData = new FormData();

      formData.append("roomType", inputs.roomType);
      formData.append("roomSize", inputs.roomSize);
      formData.append("description", inputs.description);
      formData.append("maxGuests", Number(inputs.maxGuests));
      formData.append("pricePerNight", Number(inputs.pricePerNight));

      formData.append(
        "amenities",
        JSON.stringify(amenitiesArray)
      );

      uploadedImages.forEach((image) => {
        formData.append("images", image);
      });

      const { data } = await axios.post("/api/rooms", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!data?.success) {
        toast.error(data?.message || "Failed to add room");
        return;
      }

      toast.success("Room added successfully");

      setInputs({
        roomType: "",
        roomSize: "",
        description: "",
        maxGuests: 1,
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
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Register hotel and upload rooms with prices."
      />

      {!hotel && (
        <form
          onSubmit={handleRegisterHotel}
          className="bg-white border rounded-2xl p-8 mt-8 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Register Hotel
          </h2>

          <div className="mb-8">
            <p className="font-medium mb-3">
              Hotel Image
            </p>

            <label className="cursor-pointer">
              <img
                src={
                  hotelImage
                    ? URL.createObjectURL(hotelImage)
                    : assets.uploadArea
                }
                alt="hotel"
                className="w-40 h-40 object-cover rounded-2xl border"
              />

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setHotelImage(e.target.files[0])
                }
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="mb-2 font-medium">
                Hotel Name
              </p>

              <input
                type="text"
                required
                placeholder="Eko Hotel"
                value={hotelForm.name}
                onChange={(e) =>
                  setHotelForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="border p-4 rounded-xl w-full"
              />
            </div>

            <div>
              <p className="mb-2 font-medium">
                Phone Number
              </p>

              <input
                type="text"
                required
                placeholder="+234..."
                value={hotelForm.contact}
                onChange={(e) =>
                  setHotelForm((prev) => ({
                    ...prev,
                    contact: e.target.value,
                  }))
                }
                className="border p-4 rounded-xl w-full"
              />
            </div>

            <div>
              <p className="mb-2 font-medium">
                State / Location
              </p>

              <select
                required
                value={hotelForm.city}
                onChange={(e) =>
                  setHotelForm((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                className="border p-4 rounded-xl w-full"
              >
                <option value="">
                  Select State
                </option>

                {cities.map((city) => (
                  <option
                    key={city}
                    value={city.toLowerCase()}
                  >
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 font-medium">
                Area / District
              </p>

              <input
                type="text"
                required
                placeholder="Victoria Island"
                value={hotelForm.area}
                onChange={(e) =>
                  setHotelForm((prev) => ({
                    ...prev,
                    area: e.target.value,
                  }))
                }
                className="border p-4 rounded-xl w-full"
              />
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 font-medium">
                Hotel Address
              </p>

              <input
                type="text"
                required
                placeholder="Full hotel address"
                value={hotelForm.address}
                onChange={(e) =>
                  setHotelForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className="border p-4 rounded-xl w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={hotelLoading}
            className="bg-black text-white px-8 py-4 rounded-xl mt-8"
          >
            {hotelLoading
              ? "Registering..."
              : "Register Hotel"}
          </button>
        </form>
      )}

      {hotel && (
        <>
          <div className="bg-white border rounded-2xl p-6 mt-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={
                    hotel?.images?.[0] ||
                    assets.roomImg
                  }
                  alt="hotel"
                  className="w-32 h-32 rounded-2xl object-cover border"
                />

                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {hotel.name}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {hotel.address}
                  </p>

                  <p className="text-gray-500 mt-1">
                    {hotel.contact}
                  </p>

                  <div className="inline-block mt-4 bg-[#eef9ff] text-[#00ADEF] px-5 py-2 rounded-full capitalize">
                    {hotel.city} • {hotel.area}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowEditHotel(!showEditHotel);

                  setEditHotelForm({
                    name: hotel.name || "",
                    address: hotel.address || "",
                    contact: hotel.contact || "",
                    city: hotel.city || "",
                    area: hotel.area || "",
                  });
                }}
                className="bg-[#00ADEF] hover:bg-[#0095cc] text-white px-6 py-3 rounded-xl h-fit"
              >
                {showEditHotel
                  ? "Close Form"
                  : "Edit Hotel"}
              </button>
            </div>

            {showEditHotel && (
              <form
                onSubmit={handleUpdateHotel}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10"
              >
                <div className="md:col-span-2">
                  <p className="mb-3 font-medium">
                    Hotel Image
                  </p>

                  <label className="cursor-pointer">
                    <img
                      src={
                        hotelImage
                          ? URL.createObjectURL(
                              hotelImage
                            )
                          : hotel?.images?.[0] ||
                            assets.uploadArea
                      }
                      alt="hotel"
                      className="w-40 h-40 object-cover rounded-2xl border"
                    />

                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        setHotelImage(
                          e.target.files[0]
                        )
                      }
                    />
                  </label>
                </div>

                <div>
                  <p className="mb-2 font-medium">
                    Hotel Name
                  </p>

                  <input
                    type="text"
                    required
                    value={editHotelForm.name}
                    onChange={(e) =>
                      setEditHotelForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="border p-4 rounded-xl w-full"
                  />
                </div>

                <div>
                  <p className="mb-2 font-medium">
                    Phone Number
                  </p>

                  <input
                    type="text"
                    required
                    value={editHotelForm.contact}
                    onChange={(e) =>
                      setEditHotelForm((prev) => ({
                        ...prev,
                        contact: e.target.value,
                      }))
                    }
                    className="border p-4 rounded-xl w-full"
                  />
                </div>

                <div>
                  <p className="mb-2 font-medium">
                    State / Location
                  </p>

                  <select
                    required
                    value={editHotelForm.city}
                    onChange={(e) =>
                      setEditHotelForm((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="border p-4 rounded-xl w-full"
                  >
                    <option value="">
                      Select State
                    </option>

                    {cities.map((city) => (
                      <option
                        key={city}
                        value={city.toLowerCase()}
                      >
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-2 font-medium">
                    Area / District
                  </p>

                  <input
                    type="text"
                    required
                    value={editHotelForm.area}
                    onChange={(e) =>
                      setEditHotelForm((prev) => ({
                        ...prev,
                        area: e.target.value,
                      }))
                    }
                    className="border p-4 rounded-xl w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="mb-2 font-medium">
                    Hotel Address
                  </p>

                  <input
                    type="text"
                    required
                    value={editHotelForm.address}
                    onChange={(e) =>
                      setEditHotelForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="border p-4 rounded-xl w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={hotelLoading}
                  className="bg-black text-white px-8 py-4 rounded-xl w-fit"
                >
                  {hotelLoading
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </form>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Add Room
            </h2>

            <p className="font-medium text-lg mb-4">
              Room Images
            </p>

            <div className="grid grid-cols-2 sm:flex gap-4 flex-wrap">
              {Object.keys(images).map((key) => (
                <label key={key}>
                  <img
                    src={
                      images[key]
                        ? URL.createObjectURL(
                            images[key]
                          )
                        : assets.uploadArea
                    }
                    alt="upload"
                    className="w-36 h-36 object-cover rounded-2xl border cursor-pointer"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div>
                <p className="mb-2 font-medium">
                  Room Type
                </p>

                <select
                  required
                  value={inputs.roomType}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      roomType: e.target.value,
                    }))
                  }
                  className="border p-4 rounded-xl w-full"
                >
                  <option value="">
                    Select Room Type
                  </option>

                  <option value="Classic Room">
                    Classic Room
                  </option>

                  <option value="Executive Room">
                    Executive Room
                  </option>

                  <option value="Luxury Room">
                    Luxury Room
                  </option>

                  <option value="Family Suite">
                    Family Suite
                  </option>

                  <option value="Executive Suite">
                    Executive Suite
                  </option>

                  <option value="Presidential Suite">
                    Presidential Suite
                  </option>
                </select>
              </div>

              <div>
                <p className="mb-2 font-medium">
                  Room Size
                </p>

                <input
                  type="text"
                  required
                  placeholder="40 sqm"
                  value={inputs.roomSize}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      roomSize: e.target.value,
                    }))
                  }
                  className="border p-4 rounded-xl w-full"
                />
              </div>

              <div>
                <p className="mb-2 font-medium">
                  Max Guests
                </p>

                <input
                  type="number"
                  min="1"
                  required
                  value={inputs.maxGuests}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      maxGuests: e.target.value,
                    }))
                  }
                  className="border p-4 rounded-xl w-full"
                />
              </div>

              <div>
                <p className="mb-2 font-medium">
                  Price Per Night
                </p>

                <input
                  type="number"
                  required
                  min="1"
                  value={inputs.pricePerNight}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      pricePerNight:
                        e.target.value,
                    }))
                  }
                  className="border p-4 rounded-xl w-full"
                />
              </div>

              <div className="md:col-span-2">
                <p className="mb-2 font-medium">
                  Room Description
                </p>

                <textarea
                  rows="5"
                  required
                  value={inputs.description}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      description:
                        e.target.value,
                    }))
                  }
                  className="border p-4 rounded-xl w-full resize-none"
                />
              </div>
            </div>

            <p className="font-medium text-lg mt-10 mb-4">
              Amenities
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(inputs.amenities).map(
                (amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-3 bg-white border rounded-xl px-5 py-4"
                  >
                    <input
                      type="checkbox"
                      checked={
                        inputs.amenities[
                          amenity
                        ]
                      }
                      onChange={() =>
                        setInputs((prev) => ({
                          ...prev,
                          amenities: {
                            ...prev.amenities,
                            [amenity]:
                              !prev
                                .amenities[
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

            <button
              type="submit"
              disabled={loading}
              className="bg-[#00ADEF] hover:bg-[#0094cc] text-white px-10 py-4 mt-10 rounded-xl font-semibold"
            >
              {loading
                ? "Uploading..."
                : "Add Room"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddRoom;