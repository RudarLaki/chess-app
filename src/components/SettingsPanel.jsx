import { useState } from "react";
import "../settingsPanel.css";
export default function SettingsPanel({ onStart }) {
  const [minutes, setMinutes] = useState(5);
  const [increment, setIncrement] = useState(3);
  function handleSubmit() {
    onStart({
      minutes: Number(minutes),
      increment: Number(increment),
    });
  }
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
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
}
