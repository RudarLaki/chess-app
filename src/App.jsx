import { io } from "socket.io-client";

import ChessBoard from "./components/ChessBoard";
import MoveHistory from "./components/MoveHistory";
import Timer from "./components/Timer";
import SettingsPanel from "./components/SettingsPanel";
import GameOverPanel from "./components/GameOverPanel";
import "./styling/timer.css";
import "./styling/history.css";
import "./styling/file.css";
import "./styling/board.css";
import { useEffect, useState } from "react";

function App() {
  const socket = io("http//localhost:3001");
  useEffect(() =>
    socket.on("connect", () => {
      console.log("connected to 3001");
    })
  );

  const [moveHistory, setMoveHistory] = useState([]);
  const whiteMoves = moveHistory.filter((_, i) => i % 2 === 0);
  const blackMoves = moveHistory.filter((_, i) => i % 2 === 1);
  const [isRunningWhite, setIsRunningWhite] = useState(true);
  const [isRunningBlack, setIsRunningBlack] = useState(false);
  const [gameOver, setGameOver] = useState({
    finished: false,
    checkMate: false,
    alliance: null,
  });

  const [gameSettings, setGameSettings] = useState(null);

  if (!gameSettings) {
    return <SettingsPanel onStart={setGameSettings} />;
  }

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
          <ChessBoard
            setMoveHistory={setMoveHistory}
            setIsRunningBlack={setIsRunningBlack}
            setIsRunningWhite={setIsRunningWhite}
            setGameOver={setGameOver}
          />
        </div>

        {/* Timers stacked vertically on the right */}
        <div className="timer-stack">
          <Timer
            clockAliance={"Black"}
            isRunning={isRunningBlack}
            initialTime={gameSettings.minutes * 60}
            increment={gameSettings.increment}
            setGameOver={setGameOver}
          />
          <Timer
            clockAlliance={"White"}
            isRunning={isRunningWhite}
            initialTime={gameSettings.minutes * 60}
            increment={gameSettings.increment}
            setGameOver={setGameOver}
          />
        </div>
      </div>
      {(gameOver.finished || gameOver.checkMate) && (
        <GameOverPanel
          alliance={gameOver.alliance}
          checkMate={gameOver.checkMate}
        />
      )}
    </div>
  );
}

export default App;
