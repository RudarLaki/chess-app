import React from "react";
import BlackKnight from "../../assets/BN.png";
import WhiteKnight from "../../assets/WN.png";
function Knight({ color }) {
  const pieceImage = color === "White" ? WhiteKnight : BlackKnight;
  return (
    <img
      src={pieceImage}
      width={60}
      height={60}
      alt="Knight"
      className="piece"
    />
  );
}
export default Knight;
