import React, { useRef, useEffect, useState } from 'react';
import { TerminalProps } from '../../types';
import ErrorBoundary from '../common/ErrorBoundary';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';

const Terminal: React.FC<TerminalProps> = ({ 
  terminalUrl,
  onError
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      const newError = new Error("Failed to load terminal for session");
      setError(newError);
      setIsLoading(false);
      onError && onError(newError);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [onError]);

  if (error) {
    return (
      <Card className="w-full h-full flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Terminal Error</h3>
          <p className="text-gray-300 mb-4">
            We couldn't connect to your terminal session. Please try refreshing the page.
          </p>
          <p className="text-sm text-gray-400">Error: {error.message}</p>
        </div>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className="terminal-container relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-terminal-black bg-opacity-90 z-10">
            <LoadingSpinner size={32} text="Connecting to terminal..." />
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={`http://${terminalUrl}`}
          className="w-full h-full border-0"
          title={`Linux Terminal - Session`}
          sandbox="allow-same-origin allow-scripts allow-forms"
          loading="lazy"
        />
      </div>
    </ErrorBoundary>
  );
};

export default Terminal;