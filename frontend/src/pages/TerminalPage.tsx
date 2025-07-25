import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Terminal from "../components/terminal/Terminal";
import SessionInfo from "../components/terminal/SessionInfo";
import ConfirmationDialog from "../components/common/ConfirmationDialog";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { Session } from "../types";
import { sessionService } from "../services/api";
import {
  notifyError,
  notifyWarning,
  notifyInfo,
} from "../components/common/Toast";
import {
  Home,
  Terminal as TerminalIcon,
  Command,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";

const TerminalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    if (!location.state) {
      navigate("/");
      return;
    }

    const { terminalUrl, startTime, endTime } = location.state;

    if (!terminalUrl) {
      notifyError("Missing session information");
      navigate("/");
      return;
    }

    setSession({
      publicIp: terminalUrl,
      status: "connecting",
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    const timer = setTimeout(() => {
      setSession((prev) => {
        if (prev) {
          return { ...prev, status: "connected" };
        }
        return prev;
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleTerminalError = (error: Error) => {
    console.error("Terminal error:", error);
    setSession((prev) => {
      if (prev) {
        return { ...prev, status: "error" };
      }
      return prev;
    });
    notifyError("Terminal connection error: " + error.message);
  };

  const handleTimeWarning = () => {
    notifyWarning("Your session will expire in 5 minutes. Save your work!");
  };

  const handleTimeComplete = () => {
    notifyInfo("Your session has expired");
    navigate("/");
  };

  const handleTerminateClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleTerminateConfirm = async () => {
    if (!session) return;

    setIsTerminating(true);
    try {
      const response = await sessionService.terminateSession(session.publicIp);

      if (response.status === 200) {
        notifyInfo("Session terminated successfully");
        navigate("/");
      } else {
        notifyError(response.message || "Failed to terminate session");
      }
    } catch (error) {
      notifyError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsTerminating(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsSidebarVisible(!isFullscreen);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/[0.96]">
        <LoadingSpinner size={40} text="Loading session..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-black/[0.96]">
        {/* Header */}
        <header
          className={`bg-black/40 border-b border-white/10 backdrop-blur-sm py-2 sm:py-3 px-4 transition-opacity duration-300 ${
            isFullscreen ? "opacity-0 hover:opacity-100" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                aria-label="Go to home"
              >
                <Home
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="hidden sm:inline text-sm">Home</span>
              </button>

              <div className="flex items-center text-white">
                <TerminalIcon size={20} className="mr-2 text-primary-500" />
                <h1 className="text-base sm:text-lg font-semibold">
                  Terminal Session
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleSidebar}
                className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle sidebar"
              >
                <Command size={20} />
              </button>

              <div className="hidden sm:flex items-center text-sm text-gray-400">
                <Command size={14} className="mr-2" />
                <span className="hidden sm:inline">Session ID:</span>
                <ChevronRight size={14} className="mx-1" />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-2 sm:p-4 gap-4">
          {/* Terminal area */}
          <div className="relative flex-1 h-[60vh] sm:h-[70vh] lg:h-auto rounded-lg overflow-hidden border border-white/10 shadow-2xl">
            <button
              onClick={toggleFullscreen}
              className="absolute top-2 right-2 z-50 p-2 rounded-lg bg-black/60 text-gray-400 hover:text-white transition-colors backdrop-blur-sm border border-white/10"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <Terminal
              terminalUrl={session.publicIp}
              onError={handleTerminalError}
            />
          </div>

          {/* Sidebar */}
          <div
            className={`
              fixed lg:relative inset-0 z-50 lg:z-auto
              ${
                isSidebarVisible
                  ? "translate-x-0"
                  : "translate-x-full lg:translate-x-0"
              }
              ${isFullscreen ? "hidden lg:hidden" : ""}
              transition-transform duration-300 ease-in-out
              lg:w-80 bg-black/90 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none
            `}
          >
            <div className="h-full p-4 lg:p-0">
              <button
                onClick={toggleSidebar}
                className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <ChevronRight size={24} />
              </button>
              <SessionInfo
                session={session}
                onTerminateClick={handleTerminateClick}
                onTimeWarning={handleTimeWarning}
                onTimeComplete={handleTimeComplete}
              />
            </div>
          </div>
        </div>

        {/* Confirmation dialog */}
        <ConfirmationDialog
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleTerminateConfirm}
          title="Terminate Session"
          message="Are you sure you want to terminate this session? All your unsaved work will be lost."
          confirmText={isTerminating ? "Terminating..." : "Yes, Terminate"}
          cancelText="Cancel"
        />
      </div>
    </ErrorBoundary>
  );
};

export default TerminalPage;
