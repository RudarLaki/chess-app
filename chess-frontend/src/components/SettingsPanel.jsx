import { useState } from "react";
import "../styling/settingsPanel.css";
export default function SettingsPanel({ roomId, onStart }) {
  const [minutes, setMinutes] = useState(5);
  const [increment, setIncrement] = useState(3);
  const handleSubmit = (e) => {
    e.preventDefault(); // This is correct
    onStart({
      minutes: Number(minutes),
      increment: Number(increment),
    });
  };
  return (
    <div className="settings-panel">
      <form onSubmit={handleSubmit}>
        <label className="label">
          Start Time(m):
          <input
            className="input"
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </label>
        <label className="label">
          Bonus Time(s):
          <input
            className="input"
            type="number"
            value={increment}
            onChange={(e) => setIncrement(e.target.value)}
          />
        </label>
        <label className="room-id">Room ID: {roomId}</label>
        <div className="button-allign">
          <button className="button" type="submit">
            Start Game
          </button>
        </div>
      </form>
    </div>
  );
}
