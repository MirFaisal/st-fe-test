import { Loader2 } from "lucide-react";

function RefreshBadge() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        right: "1.1rem",
        bottom: "1.1rem",
        padding: "0.62rem 0.95rem",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        gap: "0.55rem",
        zIndex: 40,
        background: "linear-gradient(135deg, var(--primary), #1a4fb8)",
        color: "#fff",
        border: "1px solid rgba(255, 255, 255, 0.35)",
        boxShadow: "0 8px 24px rgba(37, 99, 235, 0.42)",
        animation: "badgePulse 1.5s ease-in-out infinite",
      }}>
      <span
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "rgba(255, 255, 255, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.32)",
        }}>
        <Loader2 size={13} color="#fff" style={{ animation: "spin 1.1s linear infinite" }} />
      </span>
      <span style={{ fontSize: "0.86rem", fontWeight: 600, letterSpacing: "0.01em" }}>
        Updating results...
      </span>

      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }

          @keyframes badgePulse {
            0% { box-shadow: 0 8px 24px rgba(37, 99, 235, 0.42); transform: translateY(0); }
            50% { box-shadow: 0 10px 28px rgba(37, 99, 235, 0.56); transform: translateY(-1px); }
            100% { box-shadow: 0 8px 24px rgba(37, 99, 235, 0.42); transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default RefreshBadge;
