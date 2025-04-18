import React from "react";
import BlackBishop from "../../assets/BB.png";
import WhiteBishop from "../../assets/WB.png";

function Bishop({ color }) {
  const pieceImage = color === "White" ? WhiteBishop : BlackBishop;
  return (
    <img
      src={pieceImage}
      width={60}
      height={60}
      alt="Bishop"
      className="Piece"
    />
  );
}
export default Bishop;
