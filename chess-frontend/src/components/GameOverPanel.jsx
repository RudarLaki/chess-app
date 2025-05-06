import "../styling/gameOverPanel.css";

export default function GameOverPanel({ alliance, checkMate }) {
  return (
    <div className="game-over-overlay">
      <label className="game-over-label">
        {alliance.toString()} player won{" "}
        {checkMate ? "by checkmate" : "on time"}!
      </label>
    </div>
  );
}
