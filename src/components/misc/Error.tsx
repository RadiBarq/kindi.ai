import React from "react";
import errorPyramidImage from "@/assets/error_pyramid.png";
import Image from "next/image";

interface ErrorProps {
  withImage: boolean;
  message: String;
}

export default function ErrorMessage({ message, withImage }: ErrorProps) {
  return (
    <div className="flex flex-row flex-wrap  items-center justify-center gap-14">
      <div className="pointer-events-none absolute inset-0 flex w-full items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-black"></div>
      <div className="max-w-2xl text-center text-4xl font-medium">
        {message}
      </div>
      {withImage && (
        <Image
          className="xl:max-w-xlg h-auto w-full max-w-sm shadow-lg shadow-gray-400 sm:max-w-sm md:mt-0 md:max-w-md lg:max-w-lg"
          src={errorPyramidImage}
          alt="Pyramid hero image"
          width={500}
        />
      )}
    </div>
  );
}
