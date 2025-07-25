import React from "react";
import Card from "../common/Card";
import StatusIndicator from "../common/StatusIndicator";
import CountdownTimer from "../common/CountdownTimer";
import Button from "../common/Button";
import { Session } from "../../types";
import { Terminal, Power, Info } from "lucide-react";

interface SessionInfoProps {
  session: Session;
  onTerminateClick: () => void;
  onTimeWarning: () => void;
  onTimeComplete: () => void;
}

const SessionInfo: React.FC<SessionInfoProps> = ({
  session,
  onTerminateClick,
  onTimeWarning,
  onTimeComplete,
}) => {
  return (
    <Card variant="glass" className="w-full animate-fade-in">
      <div className="flex items-center mb-3">
        <Terminal size={18} className="text-primary-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">Session Info</h3>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Status</span>
            <StatusIndicator
              status={
                session.status === "connected" ? "connected" : "disconnected"
              }
              text={session.status}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Time Remaining</span>
            <CountdownTimer
              endTime={session.endTime}
              onWarning={onTimeWarning}
              onComplete={onTimeComplete}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <Button
            variant="danger"
            onClick={onTerminateClick}
            className="w-full flex items-center justify-center"
          >
            <Power size={16} className="mr-2" />
            Stop Session
          </Button>
        </div>

        <div className="flex items-start text-xs text-gray-400">
          <Info size={14} className="mr-1 flex-shrink-0 mt-0.5" />
          <p>
            Stopping the session will terminate all processes and lose any
            unsaved data.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SessionInfo;
