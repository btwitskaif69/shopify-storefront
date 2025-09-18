import React from "react";
import "./ProductUSP.css";
const ProductUSP = () => {
  const usps = [
    { icon: "/icons/shipping.png", text: "Free Shipping" },
    { icon: "/icons/cod.png", text: "COD Available" },
    { icon: "/icons/exchange.png", text: "15 Days Exchange/Return" },
    { icon: "/icons/fit.png", text: "Made to Fit Indian Body" },
  ];
  return (
    <div className="product-usp-section">
      {" "}
      {usps.map((usp, index) => (
        <div key={index} className="usp-item">
          {" "}
          <img src={usp.icon} alt={usp.text} className="usp-icon" />{" "}
          <p>{usp.text}</p>{" "}
        </div>
      ))}{" "}
    </div>
  );
};
export default ProductUSP;
