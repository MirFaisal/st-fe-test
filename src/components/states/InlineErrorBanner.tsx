import { AlertCircle, X } from "lucide-react";
import type { InlineErrorBannerProps } from "../../types/error";

function InlineErrorBanner({ message, onRetry, onDismiss }: InlineErrorBannerProps) {
  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        right: "19px",
        top: "19px",
        width: "min(420px, calc(100vw - 38px))",
        padding: "14px 15px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background: "linear-gradient(135deg, #b91c1c, #ef4444)",
        color: "#fff",
        border: "1px solid rgba(255, 255, 255, 0.28)",
        borderRadius: "14px",
        boxShadow: "0 16px 38px rgba(185, 28, 28, 0.38)",
        zIndex: 45,
        animation: "toastEnter 240ms ease-out",
      }}>
      <div style={{ display: "flex", width: "100%", alignItems: "flex-start", gap: "9px" }}>
        <AlertCircle size={18} color="#fff" style={{ marginTop: "2px", flexShrink: 0 }} />
        <p style={{ flex: 1, lineHeight: 1.45, fontSize: "14px" }}>
          {message} You're still viewing the most recently loaded products.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error notification"
          style={{ color: "#fff", opacity: 0.9 }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onRetry}
          style={{
            color: "#991b1b",
            background: "#fff",
            borderRadius: "8px",
            padding: "6px 11px",
            fontWeight: 700,
          }}>
          Retry Now
        </button>
      </div>

      <style>
        {`
          @keyframes toastEnter {
            from { opacity: 0; transform: translateY(-8px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
    </div>
  );
}

export default InlineErrorBanner;
