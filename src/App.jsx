import { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import MoveHistory from "./components/MoveHistory";

function App() {
  const [moveHistory, setMoveHistory] = useState([]);

  // Split moves into white and black
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

      {/* Chessboard and Move History side-by-side */}
      <div className="chess-container">
        <div className="board-style">
          <ChessBoard setMoveHistory={setMoveHistory} />
        </div>

        <div className="move-history-container">
          {/* White Moves */}
          <div className="history-column">
            <div className="move-history-header white">White Moves</div>
            {whiteMoves.map((move, index) => (
              <div className="move-history-row" key={index}>
                <MoveHistory index={index} move={move} />
              </div>
            ))}
          </div>

          {/* Black Moves */}
          <div className="history-column">
            <div className="move-history-header black">Black Moves</div>
            {blackMoves.map((move, index) => (
              <div className="move-history-row" key={index}>
                <MoveHistory index={index} move={move} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
