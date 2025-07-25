export interface Session {
  publicIp: string;
  status: "connecting" | "connected" | "disconnected" | "error";
  startTime: Date;
  endTime: Date;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface CreateSessionResponse {
  InstanceIP: string;
}

export interface SessionStatus {
  status: "connecting" | "connected" | "disconnected" | "error";
  timeRemaining: number; // in seconds
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass";
}

export interface StatusIndicatorProps {
  status: "connected" | "disconnected" | "warning";
  text: string;
}

export interface CountdownTimerProps {
  endTime: Date;
  onWarning?: () => void;
  onComplete?: () => void;
}

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface TerminalProps {
  terminalUrl: string;
  onError?: (error: Error) => void;
}
