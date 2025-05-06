import React from "react";
import whitePawn from "../../assets/WP.png"; // Adjust path to your image
import blackPawn from "../../assets/BP.png"; // Adjust path to your image

function Pawn({ color }) {
  const pieceImage = color === "White" ? whitePawn : blackPawn;
  return (
    <img src={pieceImage} width={60} height={60} alt="Pawn" className="piece" />
  );
}

export default Pawn;
