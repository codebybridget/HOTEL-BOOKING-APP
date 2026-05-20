import React, {
  useEffect,
  useState,
} from "react";

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

  const [hotel, setHotel] =
    useState(null);

  const [images, setImages] =
    useState({
      1: null,
      2: null,
      3: null,
      4: null,
    });

  const [inputs, setInputs] =
    useState({
      roomType: "",
      pricePerNight: "",
      amenities:
        initialAmenities,
    });

  const [loading, setLoading] =
    useState(false);

  // =========================
  // FETCH OWNER HOTEL
  // =========================
  useEffect(() => {
    const fetchHotel =
      async () => {
        try {
          const { data } =
            await axios.get(
              "/api/hotels/owner"
            );

          console.log(data);

          if (data?.success) {
            setHotel(data.hotel);
          }
        } catch (error) {
          console.error(
            "Fetch hotel error:",
            error.response?.data ||
              error.message
          );
        }
      };

    fetchHotel();
  }, [axios]);

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (
    key,
    file
  ) => {
    setImages((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const uploadedImages =
        Object.values(images).filter(
          Boolean
        );

      if (
        uploadedImages.length === 0
      ) {
        toast.error(
          "Please upload at least one image"
        );

        return;
      }

      const amenitiesArray =
        Object.keys(
          inputs.amenities
        ).filter(
          (key) =>
            inputs.amenities[key]
        );

      const formData =
        new FormData();

      formData.append(
        "roomType",
        inputs.roomType
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

      setInputs({
        roomType: "",
        pricePerNight: "",
        amenities:
          initialAmenities,
      });

      setImages({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
      });
    } catch (error) {
      console.error(
        "Add room error:",
        error.response?.data ||
          error.message
      );

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
    <div>
      <form onSubmit={handleSubmit}>
        <Title
          align="left"
          font="outfit"
          title="Add Room"
          subTitle="Fill in room details carefully."
        />

        {/* HOTEL INFO */}
        {hotel && (
          <div className="bg-white border rounded-2xl p-6 mt-8 shadow-sm mb-10">
            <div className="flex items-center gap-5">
              <img
                src={
                  hotel?.images?.[0] ||
                  assets.roomImg
                }
                alt="hotel"
                className="w-28 h-28 rounded-xl object-cover"
              />

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {hotel.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {hotel.address}
                </p>

                <span className="inline-block mt-3 bg-[#eef9ff] text-[#00ADEF] px-4 py-1 rounded-full text-sm font-medium capitalize">
                  {hotel.city}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ROOM IMAGES */}
        <p className="text-gray-800 mt-6 font-medium text-lg">
          Room Images
        </p>

        <div className="grid grid-cols-2 sm:flex gap-4 my-4 flex-wrap">
          {Object.keys(images).map(
            (key) => (
              <label key={key}>
                <img
                  className="h-36 w-36 object-cover cursor-pointer rounded-2xl border border-gray-300"
                  src={
                    images[key]
                      ? URL.createObjectURL(
                          images[key]
                        )
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
            )
          )}
        </div>

        {/* ROOM TYPE + PRICE */}
        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          <div>
            <p className="mb-2 font-medium">
              Room Type
            </p>

            <select
              value={
                inputs.roomType
              }
              onChange={(e) =>
                setInputs(
                  (prev) => ({
                    ...prev,
                    roomType:
                      e.target.value,
                  })
                )
              }
              className="border p-4 rounded-xl w-80"
              required
            >
              <option value="">
                Select
              </option>

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
            <p className="mb-2 font-medium">
              Price / Night
            </p>

            <input
              type="number"
              min="1"
              value={
                inputs.pricePerNight
              }
              onChange={(e) =>
                setInputs(
                  (prev) => ({
                    ...prev,
                    pricePerNight:
                      e.target.value,
                  })
                )
              }
              className="border p-4 rounded-xl w-80"
              placeholder="50000"
              required
            />
          </div>
        </div>

        {/* AMENITIES */}
        <p className="mt-10 mb-4 font-medium text-lg">
          Amenities
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(
            inputs.amenities
          ).map((amenity) => (
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
                  setInputs(
                    (prev) => ({
                      ...prev,
                      amenities: {
                        ...prev.amenities,
                        [amenity]:
                          !prev
                            .amenities[
                            amenity
                          ],
                      },
                    })
                  )
                }
              />

              <span className="text-gray-700">
                {amenity}
              </span>
            </label>
          ))}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#00ADEF] hover:bg-[#0094cc] text-white px-10 py-4 mt-10 rounded-xl font-semibold transition"
        >
          {loading
            ? "Uploading..."
            : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;