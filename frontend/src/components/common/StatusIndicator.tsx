import React from 'react';
import { StatusIndicatorProps } from '../../types';

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, text }) => {
  let statusClass = '';
  let statusIcon = '';
  
  switch (status) {
    case 'connected':
      statusClass = 'status-badge-connected';
      statusIcon = '●';
      break;
    case 'disconnected':
      statusClass = 'status-badge-disconnected';
      statusIcon = '●';
      break;
    case 'warning':
      statusClass = 'status-badge-warning';
      statusIcon = '!';
      break;
    default:
      statusClass = 'status-badge-disconnected';
      statusIcon = '●';
  }
  
  return (
    <span className={statusClass}>
      <span className="mr-1">{statusIcon}</span>
      {text}
    </span>
  );
};

export default StatusIndicator;