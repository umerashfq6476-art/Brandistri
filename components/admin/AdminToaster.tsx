"use client";

import { Toaster } from "react-hot-toast";

/**
 * Site-wide toast container for the admin panel.
 *
 * Mounted once in app/admin/layout.tsx so every page / server-action result
 * can call `toast.success(...)` or `toast.error(...)` from anywhere. Styled
 * to match the Brandistri dark surface palette.
 */
export default function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#111111",
          color: "#FFFFFF",
          border: "1px solid #222222",
          borderRadius: "12px",
          padding: "12px 14px",
          fontSize: "13px",
          fontFamily: "Satoshi, system-ui, sans-serif",
        },
        success: {
          iconTheme: { primary: "#ADFF2F", secondary: "#0A0A0A" },
        },
        error: {
          iconTheme: { primary: "#F87171", secondary: "#0A0A0A" },
          duration: 5000,
        },
      }}
    />
  );
}
