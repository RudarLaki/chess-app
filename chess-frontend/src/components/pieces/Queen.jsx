import React from "react";
import BlackQueen from "../../assets/BQ.png";
import WhiteQueen from "../../assets/WQ.png";

function Queen({ color }) {
  const pieceImage = color === "White" ? WhiteQueen : BlackQueen;
  return (
    <img
      src={pieceImage}
      width={60}
      height={60}
      alt="Queen"
      className="Piece"
    />
  );
}
export default Queen;
