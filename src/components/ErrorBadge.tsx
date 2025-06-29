import React from "react";

interface ErrorBadgeProps {
  message: string;
}

const ErrorBadge: React.FC<ErrorBadgeProps> = ({ message }) => {
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
