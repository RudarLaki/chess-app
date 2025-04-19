import { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import MoveHistory from "./components/MoveHistory";
import Timer from "./components/Timer";
import "./timer.css";
import "./history.css";
import "./file.css";
import "./board.css";

function App() {
  const [moveHistory, setMoveHistory] = useState([]);
  const whiteMoves = moveHistory.filter((_, i) => i % 2 === 0);
  const blackMoves = moveHistory.filter((_, i) => i % 2 === 1);

  return (
    <div>
      {/* Dropdown Menu */}
      <div className="dropdown-menu">
        <button className="drop-button">
          <span className="big-text">File</span>
        </button>
        <div className="dropdown-content">
          <a href="#">Resign</a>
          <a href="#">Offer Draw</a>
          <a href="#">Return Move</a>
          <a href="#">Add Time</a>
        </div>
      </div>

      {/* Main Layout: Move History - Board - Timers */}
      <div className="chess-container">
        {/* Move History on the left */}
        <div className="move-history-container">
          <div className="history-column">
            <div className="move-history-header white">White Moves</div>
            {whiteMoves.map((move, index) => (
              <div className="move-history-row" key={index}>
                <MoveHistory index={index} move={move} />
              </div>
            ))}
          </div>

          <div className="history-column">
            <div className="move-history-header black">Black Moves</div>
            {blackMoves.map((move, index) => (
              <div className="move-history-row" key={index}>
                <MoveHistory index={index} move={move} />
              </div>
            ))}
          </div>
        </div>

        {/* Chessboard in the middle */}
        <div className="board-style">
          <ChessBoard setMoveHistory={setMoveHistory} />
        </div>

        {/* Timers stacked vertically on the right */}
        <div className="timer-stack">
          <Timer />
          <Timer />
        </div>
      </div>
    </div>
  );
}

export default App;
