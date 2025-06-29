import React, { useEffect, useState } from "react";

interface ErrorBadgeProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

const ErrorBadge: React.FC<ErrorBadgeProps> = ({ message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className="alert alert-danger position-fixed top-0 end-0 m-3"
      role="alert"
      style={{ zIndex: 9999, maxWidth: "300px" }}
    >
      {message}
    </div>
  );
};

export default ErrorBadge;
