import React, { useState, useEffect, useRef } from "react";
import "../timer.css";

export default function Timer({
  clockAlliance,
  isRunning,
  initialTime = 300,
  increment = 5,
  setGameOver,
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef(null);
  const lastRunningState = useRef(isRunning);

  useEffect(() => {
    if (lastRunningState.current && !isRunning) {
      setTimeLeft((prev) => prev + increment);
    }
    lastRunningState.current = isRunning;

    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, increment]);

  // 💡 Only call setGameOver when timeLeft hits 0
  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver({ alliance: clockAlliance, finished: true });
    }
  }, [timeLeft, setGameOver, clockAlliance]);

  const formatTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timer">
      <div className="display">{formatTime()}</div>
    </div>
  );
}
