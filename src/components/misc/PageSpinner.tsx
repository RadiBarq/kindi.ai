import React from "react";

export default function PageSpinner() {
  return (
    <>
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-base font-medium text-gray-950">Loading...</p>
    </>
  );
}
