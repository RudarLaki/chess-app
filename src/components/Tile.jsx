import React from "react";
import WP from "../assets/WP.png";
import BP from "../assets/BP.png";
import WR from "../assets/WR.png";
import BR from "../assets/BR.png";
import WN from "../assets/WN.png";
import BN from "../assets/BN.png";
import WB from "../assets/WB.png";
import BB from "../assets/BB.png";
import WQ from "../assets/WQ.png";
import BQ from "../assets/BQ.png";
import WK from "../assets/WK.png";
import BK from "../assets/BK.png";

const pieceImages = {
  White: {
    Pawn: WP,
    Rook: WR,
    Knight: WN,
    Bishop: WB,
    Queen: WQ,
    King: WK,
  },
  Black: {
    Pawn: BP,
    Rook: BR,
    Knight: BN,
    Bishop: BB,
    Queen: BQ,
    King: BK,
  },
};

function Tile({ index, piece, onClick, selectedTile, isHighlighted }) {
  const isLight = (Math.floor(index / 8) + (index % 8)) % 2 === 0;

  const renderPiece = (piece) => {
    if (!piece) return null;

    const pieceAlliance = piece.pieceAlliance;
    const pieceName = piece.constructor.name;
    const image = pieceImages[pieceAlliance]?.[pieceName];

    if (!image) return null;

    return (
      <img
        src={image}
        width={60}
        height={60}
        alt={pieceName}
        className="piece"
      />
    );
  };

  return (
    <div
      onClick={() => onClick(index)}
      className={`tile ${isLight ? "light" : "dark"}`}
    >
      {/* highlight overlays */}
      {isHighlighted &&
        (piece ? (
          <div className="highlight-ring" />
        ) : (
          <div className="highlight-dot" />
        ))}
      {selectedTile == index ? (
        <div className="selected-tile" />
      ) : (
        <div className="" />
      )}

      {renderPiece(piece)}
    </div>
  );
}

export default Tile;
