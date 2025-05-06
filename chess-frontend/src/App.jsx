import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import StartScreen from "./components/StartScreen"; // ✨ New screen
import ChessBoard from "./components/ChessBoard";
import MoveHistory from "./components/MoveHistory";
import Timer from "./components/Timer";
import SettingsPanel from "./components/SettingsPanel";
import GameOverPanel from "./components/GameOverPanel";

import "./styling/timer.css";
import "./styling/history.css";
import "./styling/file.css";
import "./styling/board.css";

const socket = io("http://localhost:3001"); // ✨ Create socket ONCE globally

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartScreen socket={socket} />} />
        <Route path="/play/:roomId" element={<ChessGame socket={socket} />} />
      </Routes>
    </BrowserRouter>
  );
}

function ChessGame({ socket }) {
  const { roomId } = useParams();
  const [moveHistory, setMoveHistory] = useState([]);
  const [isRunningWhite, setIsRunningWhite] = useState(true);
  const [isRunningBlack, setIsRunningBlack] = useState(false);
  const [gameOver, setGameOver] = useState({
    finished: false,
    checkMate: false,
    alliance: null,
  });
  const [gameSettings, setGameSettings] = useState(null);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit("joinRoom", roomId);
    }
  }, [socket, roomId]);

  if (!gameSettings) {
    return <SettingsPanel roomId={roomId} onStart={setGameSettings} />;
  }

  return (
    <div>
      {/* Same dropdown */}
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

      <div className="chess-container">
        <div className="move-history-container">
          <div className="history-column">
            <div className="move-history-header white">White Moves</div>
            {moveHistory
              .filter((_, i) => i % 2 === 0)
              .map((move, index) => (
                <div className="move-history-row" key={index}>
                  <MoveHistory index={index} move={move} />
                </div>
              ))}
          </div>

          <div className="history-column">
            <div className="move-history-header black">Black Moves</div>
            {moveHistory
              .filter((_, i) => i % 2 === 1)
              .map((move, index) => (
                <div className="move-history-row" key={index}>
                  <MoveHistory index={index} move={move} />
                </div>
              ))}
          </div>
        </div>

        <div className="board-style">
          <ChessBoard
            roomId={roomId}
            socket={socket}
            setMoveHistory={setMoveHistory}
            setIsRunningBlack={setIsRunningBlack}
            setIsRunningWhite={setIsRunningWhite}
            setGameOver={setGameOver}
          />
        </div>

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
