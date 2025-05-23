import React from "react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner" />
      <div style = {{ marginTop: 18, color: "#2461a6", fontWeight: 500 }}>{message}</div>
    </div>
  );
}