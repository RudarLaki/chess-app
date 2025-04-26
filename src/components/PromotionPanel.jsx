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
import "../styling/promotionPanel.css";

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
export default function PromotionPanel({ alliance, onSelect }) {
  const pieces = ["Queen", "Rook", "Bishop", "Knight"];
  const colorPrefix = alliance === "White" ? "W" : "B";

  return (
    <div className="promotion-overlay">
      <div className="promotion-options">
        {pieces.map((piece) => (
          <button
            key={piece}
            onClick={() => onSelect(piece)}
            className="promotion-option"
          >
            <img
              src={pieceImages[alliance][piece]}
              alt={`${colorPrefix}${piece.charAt(0)}`}
            />
            {piece}
          </button>
        ))}
      </div>
    </div>
  );
}
