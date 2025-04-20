import React, { useState, useEffect, useRef } from "react";
import "../timer.css";

export default function Timer({ isRunning, initialTime = 300, increment = 5 }) {
  const [timeLeft, setTimeLeft] = useState(initialTime); // Time in seconds
  const intervalRef = useRef(null);
  const lastRunningState = useRef(isRunning);

  useEffect(() => {
    // Add increment only when transitioning from running to stopped
    if (lastRunningState.current && !isRunning) {
      setTimeLeft((prev) => prev + increment);
    }
    lastRunningState.current = isRunning;

    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, increment]);

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
