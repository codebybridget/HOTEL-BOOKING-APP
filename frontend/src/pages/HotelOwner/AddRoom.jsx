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

  const [hotels, setHotels] = useState([]);
  const [hotel, setHotel] = useState(null);

  const [showHotelForm, setShowHotelForm] = useState(false);

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
    totalRooms: 1,
    pricePerNight: "",
    amenities: initialAmenities,
  });

  const [loading, setLoading] = useState(false);

  const [hotelLoading, setHotelLoading] = useState(false);

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get(
        "/api/hotels/owner/me"
      );

      if (data?.success) {
        const fetchedHotels =
          data.hotels || [];

        setHotels(fetchedHotels);

        if (
          fetchedHotels.length > 0
        ) {
          setHotel(
            fetchedHotels[0]
          );
        } else {
          setShowHotelForm(
            true
          );
        }
      }
    } catch (error) {
      console.error(error);

      setShowHotelForm(true);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const resetRoomForm = () => {
    setInputs({
      roomType: "",
      roomSize: "",
      description: "",
      maxGuests: 1,
      totalRooms: 1,
      pricePerNight: "",
      amenities:
        initialAmenities,
    });

    setImages({
      1: null,
      2: null,
      3: null,
      4: null,
    });
  };

  const handleRegisterHotel =
    async (e) => {
      e.preventDefault();

      try {
        setHotelLoading(true);

        const formData =
          new FormData();

        formData.append(
          "name",
          hotelForm.name
        );

        formData.append(
          "address",
          hotelForm.address
        );

        formData.append(
          "contact",
          hotelForm.contact
        );

        formData.append(
          "city",
          hotelForm.city
        );

        formData.append(
          "area",
          hotelForm.area
        );

        if (hotelImage) {
          formData.append(
            "image",
            hotelImage
          );
        }

        const { data } =
          await axios.post(
            "/api/hotels",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (data?.success) {
          toast.success(
            "Hotel registered successfully"
          );

          setHotels((prev) => [
            data.hotel,
            ...prev,
          ]);

          setHotel(
            data.hotel
          );

          setShowHotelForm(
            false
          );

          setHotelImage(
            null
          );

          setHotelForm({
            name: "",
            address: "",
            contact: "",
            city: "",
            area: "",
          });
        } else {
          toast.error(
            data?.message ||
              "Registration failed"
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to register hotel"
        );
      } finally {
        setHotelLoading(
          false
        );
      }
    };

  const handleUpdateHotel =
    async (e) => {
      e.preventDefault();

      try {
        setHotelLoading(true);

        if (!hotel?._id) {
          toast.error(
            "Hotel not found"
          );

          return;
        }

        const formData =
          new FormData();

        formData.append(
          "name",
          editHotelForm.name
        );

        formData.append(
          "address",
          editHotelForm.address
        );

        formData.append(
          "contact",
          editHotelForm.contact
        );

        formData.append(
          "city",
          editHotelForm.city
        );

        formData.append(
          "area",
          editHotelForm.area
        );

        if (hotelImage) {
          formData.append(
            "image",
            hotelImage
          );
        }

        const { data } =
          await axios.patch(
            `/api/hotels/owner/${hotel._id}`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (data?.success) {
          toast.success(
            "Hotel updated successfully"
          );

          setHotel(
            data.hotel
          );

          setHotels((prev) =>
            prev.map((item) =>
              item._id ===
              data.hotel._id
                ? data.hotel
                : item
            )
          );

          setShowEditHotel(
            false
          );

          setHotelImage(
            null
          );
        } else {
          toast.error(
            data?.message ||
              "Update failed"
          );
        }
      } catch (error) {
        console.error(
          error.response?.data ||
            error
        );

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to update hotel"
        );
      } finally {
        setHotelLoading(
          false
        );
      }
    };

  const handleImageChange = (
    key,
    file
  ) => {
    setImages((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        if (!hotel?._id) {
          toast.error(
            "Select hotel first"
          );

          return;
        }

        const uploadedImages =
          Object.values(
            images
          ).filter(Boolean);

        if (
          uploadedImages.length ===
          0
        ) {
          toast.error(
            "Upload at least one image"
          );

          return;
        }

        const amenitiesArray =
          Object.keys(
            inputs.amenities
          ).filter(
            (key) =>
              inputs
                .amenities[key]
          );

        const formData =
          new FormData();

        formData.append(
          "hotelId",
          hotel._id
        );

        formData.append(
          "roomType",
          inputs.roomType
        );

        formData.append(
          "roomSize",
          inputs.roomSize
        );

        formData.append(
          "description",
          inputs.description
        );

        formData.append(
          "maxGuests",
          Number(
            inputs.maxGuests
          )
        );

        formData.append(
          "totalRooms",
          Number(
            inputs.totalRooms
          )
        );

        formData.append(
          "pricePerNight",
          Number(
            inputs.pricePerNight
          )
        );

        formData.append(
          "amenities",
          JSON.stringify(
            amenitiesArray
          )
        );

        uploadedImages.forEach(
          (image) => {
            formData.append(
              "images",
              image
            );
          }
        );

        const { data } =
          await axios.post(
            "/api/rooms",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        if (!data?.success) {
          toast.error(
            data?.message ||
              "Failed to add room"
          );

          return;
        }

        toast.success(
          "Room added successfully"
        );

        resetRoomForm();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Upload failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="pb-20 overflow-x-hidden">
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Register hotels and upload rooms."
      />

      {hotels.length > 0 && (
        <div className="bg-white border rounded-2xl p-4 sm:p-6 mt-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-5 lg:items-end lg:justify-between">
            <div className="flex-1">
              <p className="mb-2 font-medium">
                Select Hotel
              </p>

              <select
                value={
                  hotel?._id || ""
                }
                onChange={(e) => {
                  const selectedHotel =
                    hotels.find(
                      (item) =>
                        item._id ===
                        e.target.value
                    );

                  setHotel(
                    selectedHotel ||
                      null
                  );

                  resetRoomForm();
                }}
                className="border p-4 rounded-xl w-full"
              >
                {hotels.map(
                  (item) => (
                    <option
                      key={
                        item._id
                      }
                      value={
                        item._id
                      }
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowHotelForm(
                  true
                );

                setHotel(
                  null
                );
              }}
              className="bg-black text-white px-6 py-4 rounded-xl"
            >
              Register Another Hotel
            </button>
          </div>
        </div>
      )}

      {/* KEEP THE REST OF YOUR JSX BELOW THIS */}
    </div>
  );
};

export default AddRoom;