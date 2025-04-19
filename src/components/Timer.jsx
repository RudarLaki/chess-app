import React from "react";
import "../timer.css";
import { useState, useEffect, useRef } from "react";
export default function Timer() {
  const [isRunning, setIsRunning] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const startTimeRef = useRef(300000);
  useEffect(() => {}, [isRunning]);
  function start() {}
  function stop() {}
  function formatTime() {
    return "00:00:00";
  }
  return (
    <div className="timer">
      <div className="display">{formatTime()}</div>
    </div>
  );
}
