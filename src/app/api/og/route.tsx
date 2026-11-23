import { ImageResponse } from "next/og";

export const runtime = "edge";

const palette = {
  bg: "#0d0d0d",
  surface: "#141414",
  border: "#262626",
  textPrimary: "#fafafa",
  textSecondary: "#a3a3a3",
  textMuted: "#737373",
  orange: "#f97316",
  purple: "#8b5cf6",
  blue: "#3284eb",
  green: "#22c55e",
  pink: "#db2777",
};

export async function GET() {
  try {
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: palette.bg,
          fontFamily: "sans-serif",
          padding: "64px 76px",
          position: "relative",
        }}
      >
        {/* Faixa lateral com paleta jovem */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "10px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, backgroundColor: palette.orange }} />
          <div style={{ flex: 1, backgroundColor: palette.purple }} />
          <div style={{ flex: 1, backgroundColor: palette.blue }} />
        </div>

        {/* Barra superior */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderBottom: `1px solid ${palette.border}`,
            paddingBottom: "22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: palette.orange,
              }}
            />
            <span
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: palette.purple,
              }}
            />
            <span
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: palette.green,
              }}
            />
            <span
              style={{
                fontSize: 15,
                color: palette.textSecondary,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
                marginLeft: "6px",
              }}
            >
              WikiStudy / Estudo &amp; Cronograma
            </span>
          </div>

          <span
            style={{
              fontSize: 13,
              color: palette.orange,
              backgroundColor: "rgba(249, 115, 22, 0.14)",
              border: "1px solid rgba(249, 115, 22, 0.35)",
              padding: "6px 12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            Vídeos Grátis • YouTube
          </span>
        </div>

        {/* Corpo principal */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "48px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "3px",
                  backgroundColor: palette.purple,
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  color: palette.purple,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 800,
                }}
              >
                Wiki • Rotina &amp; Links de Aulas
              </span>
            </div>

            <h1
              style={{
                fontSize: 66,
                fontWeight: 900,
                color: palette.textPrimary,
                margin: "0 0 14px 0",
                letterSpacing: "-0.035em",
                lineHeight: 0.98,
              }}
            >
              wikistudy
            </h1>

            <p
              style={{
                fontSize: 22,
                color: palette.textSecondary,
                margin: 0,
                lineHeight: 1.38,
                maxWidth: "560px",
              }}
            >
              Seu mapa de aulas abertas do YouTube, organização por tema e
              cronograma sem perder o ritmo.
            </p>
          </div>

          {/* Cartões estruturais */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              width: "260px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${palette.border}`,
                backgroundColor: palette.surface,
                padding: "14px 16px",
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: palette.blue,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 800,
                }}
              >
                01 / Acervo
              </span>
              <span
                style={{
                  fontSize: 17,
                  color: palette.textPrimary,
                  fontWeight: 700,
                }}
              >
                Links de Vídeos no YouTube
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${palette.border}`,
                backgroundColor: palette.surface,
                padding: "14px 16px",
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: palette.pink,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 800,
                }}
              >
                02 / Planejamento
              </span>
              <span
                style={{
                  fontSize: 17,
                  color: palette.textPrimary,
                  fontWeight: 700,
                }}
              >
                Organização &amp; Cronograma
              </span>
            </div>

            <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
              <span
                style={{
                  flex: 1,
                  height: "6px",
                  backgroundColor: palette.orange,
                }}
              />
              <span
                style={{
                  flex: 1,
                  height: "6px",
                  backgroundColor: palette.purple,
                }}
              />
              <span
                style={{
                  flex: 1,
                  height: "6px",
                  backgroundColor: palette.blue,
                }}
              />
              <span
                style={{
                  flex: 1,
                  height: "6px",
                  backgroundColor: palette.green,
                }}
              />
              <span
                style={{
                  flex: 1,
                  height: "6px",
                  backgroundColor: palette.pink,
                }}
              />
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: `1px solid ${palette.border}`,
            paddingTop: "20px",
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: palette.textMuted,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            wikistudy.com.br
          </span>

          <span
            style={{
              fontSize: 13,
              color: palette.green,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Estudo • Organização • Cronograma
          </span>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Failed to generate the image: ${message}`, {
      status: 500,
    });
  }
}
