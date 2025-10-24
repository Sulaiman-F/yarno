import React from "react";
import AnimatedNumber from "./AnimatedNumber";

function StatCard({
  icon: IconComponent,
  title,
  value,
  bgColor = "bg-sky-600",
}) {
  return (
    <div
      className={`flex gap-1 w-full ${bgColor} gap-5 items-center p-4 py-5 text-white rounded-lg shadow-md`}
    >
      <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 2xl:w-24 2xl:h-24 bg-white rounded-full flex items-center justify-center">
        <IconComponent className="text-black text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl" />
      </div>
      <div className="flex flex-col w-2/3 text-xl lg:text-2xl">
        <h1 className="font-semibold">
          <AnimatedNumber value={value} />
        </h1>
        <h1>{title}</h1>
      </div>
    </div>
  );
}

export default StatCard;
