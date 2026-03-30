import { AlertCircle } from "lucide-react";
import type { ErrorStateProps } from "../../types/error";


function InlineErrorBanner({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="glass-panel"
      style={{
        marginBottom: "1rem",
        padding: "0.75rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        borderColor: "rgba(239,68,68,0.4)",
      }}>
      <AlertCircle size={18} color="var(--error)" />
      <p style={{ flex: 1, color: "var(--text-main)" }}>{message}. Showing last successful products.</p>
      <button type="button" onClick={onRetry} style={{ color: "var(--primary)", fontWeight: 600 }}>
        Retry
      </button>
    </div>
  );
}

export default InlineErrorBanner;
