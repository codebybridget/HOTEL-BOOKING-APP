import React, { useState } from "react";

const RoleSelect = ({ onSelect }) => {
  const [loadingRole, setLoadingRole] = useState("");

  const handleSelect = async (role) => {
    try {
      setLoadingRole(role);
      await onSelect(role);
    } finally {
      setLoadingRole("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Choose Account Type
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2">
          Select how you want to use the platform.
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={() => handleSelect("user")}
            disabled={loadingRole !== ""}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              loadingRole === "user"
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loadingRole === "user"
              ? "Please wait..."
              : "Continue as User"}
          </button>

          <button
            onClick={() => handleSelect("hotelOwner")}
            disabled={loadingRole !== ""}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              loadingRole === "hotelOwner"
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {loadingRole === "hotelOwner"
              ? "Please wait..."
              : "Continue as Hotel Owner"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;