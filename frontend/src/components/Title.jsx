import React from "react";

const Title = ({
  title,
  subTitle,
  align = "center",
  font = "font-playfair",
  className = "",
}) => {
  const alignmentClasses = {
    center: "items-center text-center",
    left: "items-start text-left",
    right: "items-end text-right",
  };

  return (
    <div
      className={`flex flex-col justify-center ${
        alignmentClasses[align] || alignmentClasses.center
      } ${className}`}
    >
      {/* Title */}
      <h2
        className={`text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 ${font}`}
      >
        {title}
      </h2>

      {/* Subtitle */}
      {subTitle && (
        <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-gray-500">
          {subTitle}
        </p>
      )}
    </div>
  );
};

export default Title;