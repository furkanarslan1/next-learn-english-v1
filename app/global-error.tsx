"use client";

// Last resort: replaces the whole page when the root layout itself fails.
// It has no access to the app's styles, so it uses plain inline styles.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f7f6ff",
          color: "#1b1a3a",
        }}
      >
        <title>Bir şeyler ters gitti</title>
        <h1 style={{ margin: 0, fontSize: 24 }}>Bir şeyler ters gitti</h1>
        <p style={{ margin: 0, maxWidth: 320, opacity: 0.7 }}>
          Uygulama açılırken beklenmedik bir hata oluştu.
        </p>
        <button
          onClick={() => retry()}
          style={{
            height: 44,
            padding: "0 20px",
            border: 0,
            borderRadius: 12,
            background: "#4b3fd9",
            color: "#fff",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Tekrar dene
        </button>
      </body>
    </html>
  );
}
