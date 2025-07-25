import React, { useState, useEffect } from 'react';
import { CountdownTimerProps } from '../../types';
import { Clock } from 'lucide-react';

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  onWarning,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isWarning, setIsWarning] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date();
      let timeLeft = 0;

      if (difference > 0) {
        timeLeft = Math.floor(difference / 1000);
      }

      setTimeLeft(timeLeft);

      // Warning state when 5 minutes or less remaining
      if (timeLeft <= 300 && timeLeft > 0 && !isWarning) {
        setIsWarning(true);
        onWarning && onWarning();
      }

      // Session completed
      if (timeLeft <= 0) {
        onComplete && onComplete();
      }
    };

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [endTime, onWarning, onComplete, isWarning]);

  // Format time left as HH:MM:SS
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '00:00:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map(v => v < 10 ? '0' + v : v)
      .join(':');
  };

  return (
    <div className={`flex items-center ${isWarning ? 'text-terminal-yellow animate-pulse-slow' : 'text-gray-300'}`}>
      <Clock size={16} className="mr-2" />
      <span className="font-mono">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default CountdownTimer;