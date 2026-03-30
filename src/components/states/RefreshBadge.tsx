import { Loader2 } from "lucide-react";

function RefreshBadge() {
  return (
    <div
      className="glass-panel"
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        padding: "0.5rem 0.8rem",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
      }}>
      <Loader2 size={15} color="var(--primary)" style={{ animation: "spin 1.2s linear infinite" }} />
      <span style={{ fontSize: "0.85rem" }}>Updating results...</span>

      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default RefreshBadge;
