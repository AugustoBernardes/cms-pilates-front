import React, { useEffect, useState } from "react";

interface SuccessBadgeProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

const SuccessBadge: React.FC<SuccessBadgeProps> = ({ message, duration = 5000, onClose }) => {
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
      className="alert alert-success position-fixed top-0 end-0 m-3"
      role="alert"
      style={{ zIndex: 9999, maxWidth: "300px" }}
    >
      {message}
    </div>
  );
};

export default SuccessBadge;
