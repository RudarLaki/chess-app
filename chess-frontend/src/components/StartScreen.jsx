import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StartScreen() {
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    const res = await axios.get("http://localhost:3001/newRoom");
    const { roomId } = res.data;
    navigate(`/play/${roomId}`);
  };

  const handleJoinGame = () => {
    if (joinCode.length > 0) {
      navigate(`/play/${joinCode}`);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Chess Multiplayer</h1>
      <button onClick={handleCreateGame} style={{ margin: "10px" }}>
        Create Game
      </button>
      <div>
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Enter Game Code"
          style={{ margin: "10px" }}
        />
        <button onClick={handleJoinGame}>Join Game</button>
      </div>
    </div>
  );
}

export default StartScreen;
