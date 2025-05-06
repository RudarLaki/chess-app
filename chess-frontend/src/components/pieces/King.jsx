import React from "react";
import BlackKing from "../../assets/BK.png";
import WhiteKing from "../../assets/WK.png";

function King({ color }) {
  const pieceImage = color === "White" ? WhiteKing : BlackKing;
  return (
    <img src={pieceImage} width={60} height={60} alt="King" className="Piece" />
  );
}
export default King;
