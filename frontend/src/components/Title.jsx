import React from "react";
const Title = ({ title, subTitle, align = "center", font }) => {
  const alignmentClasses = {
    center: "items-center text-center",
    left: "items-start text-left",
    right: "items-end text-right",
  };

  return (
    <div
      className={`flex flex-col justify-center ${
        alignmentClasses[align] || alignmentClasses.center
      }`}
    >
      {/* Title */}
      <h1
        className={`text-3xl md:text-[40px] font-semibold ${
          font || "font-playfair"
        }`}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subTitle && (
        <p className="text-sm md:text-base text-gray-500 mt-3 max-w-xl leading-relaxed">
          {subTitle}
        </p>
      )}
    </div>
  );
};

export default Title;