import { AlertCircle } from "lucide-react";
import type { ErrorStateProps } from "../../types/error";

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem",
        border: "1px dashed var(--border)",
        borderRadius: "16px",
      }}>
      <AlertCircle size={40} color="var(--error)" style={{ marginBottom: "1rem" }} />
      <h2 style={{ marginBottom: "0.5rem" }}>Could not load products</h2>
      <p
        style={{
          color: "var(--text-muted)",
          textAlign: "center",
          maxWidth: "500px",
          marginBottom: "1rem",
        }}>
        {message}
      </p>
      <button type="button" className="btn-primary" style={{ textAlign: "center" }} onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

export default ErrorState;
