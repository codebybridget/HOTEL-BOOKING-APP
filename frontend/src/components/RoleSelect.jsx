import React from "react";

const RoleSelect = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg flex flex-col gap-4 text-center">
        <h2 className="text-xl font-semibold">Choose Account Type</h2>

        <button
          onClick={() => onSelect("user")}
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          Continue as User
        </button>

        <button
          onClick={() => onSelect("hotelOwner")}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Continue as Hotel Owner
        </button>
      </div>
    </div>
  );
};

export default RoleSelect;