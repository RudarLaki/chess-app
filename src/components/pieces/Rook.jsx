import React from "react";
import BlackRook from "../../assets/BR.png";
import WhiteRook from "../../assets/WR.png";

function Rook({ color }) {
  const pieceImage = color === "White" ? WhiteRook : BlackRook;
  return (
    <img src={pieceImage} width={60} height={60} alt="Rook" className="Piece" />
  );
}
export default Rook;
