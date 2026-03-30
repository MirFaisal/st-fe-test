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
        padding: "64px",
        border: "1px dashed var(--border)",
        borderRadius: "16px",
      }}>
      <AlertCircle size={40} color="var(--error)" style={{ marginBottom: "16px" }} />
      <h2 style={{ marginBottom: "8px" }}>Could not load products</h2>
      <p
        style={{
          color: "var(--text-muted)",
          textAlign: "center",
          maxWidth: "500px",
          marginBottom: "16px",
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
