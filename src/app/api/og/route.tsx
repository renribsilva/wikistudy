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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          backgroundColor: palette.bg,
          fontFamily: "sans-serif",
        }}
      >
        {/* Faixa lateral esquerda */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "10px",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              backgroundColor: palette.orange,
            }}
          />
          <div
            style={{
              display: "flex",
              flex: 1,
              backgroundColor: palette.purple,
            }}
          />
          <div
            style={{ display: "flex", flex: 1, backgroundColor: palette.blue }}
          />
        </div>

        {/* Conteúdo principal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            height: "100%",
            padding: "56px 68px",
          }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              borderBottom: `1px solid ${palette.border}`,
              paddingBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  width: "10px",
                  height: "10px",
                  backgroundColor: palette.orange,
                }}
              />
              <div
                style={{
                  display: "flex",
                  width: "10px",
                  height: "10px",
                  backgroundColor: palette.purple,
                }}
              />
              <div
                style={{
                  display: "flex",
                  width: "10px",
                  height: "10px",
                  backgroundColor: palette.green,
                }}
              />
              <span
                style={{
                  fontSize: "15px",
                  color: palette.textSecondary,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginLeft: "6px",
                }}
              >
                WikiStudy / Estudo &amp; Cronograma
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "13px",
                color: palette.orange,
                backgroundColor: "#1f140d",
                border: `1px solid ${palette.orange}`,
                padding: "6px 12px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: 800,
              }}
            >
              Vídeos Grátis • YouTube
            </div>
          </div>

          {/* Centro */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "44px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "36px",
                    height: "3px",
                    backgroundColor: palette.purple,
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
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
                  fontSize: "68px",
                  fontWeight: 900,
                  color: palette.textPrimary,
                  margin: "0 0 14px 0",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.05,
                }}
              >
                wikistudy
              </h1>

              <p
                style={{
                  fontSize: "22px",
                  color: palette.textSecondary,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Seu mapa de aulas abertas do YouTube, organização por tema e
                cronograma sem perder o ritmo.
              </p>
            </div>

            {/* Cards laterais */}
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
                    fontSize: "12px",
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
                    fontSize: "17px",
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
                    fontSize: "12px",
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
                    fontSize: "17px",
                    color: palette.textPrimary,
                    fontWeight: 700,
                  }}
                >
                  Organização &amp; Cronograma
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "6px",
                  width: "100%",
                  marginTop: "2px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: "6px",
                    backgroundColor: palette.orange,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: "6px",
                    backgroundColor: palette.purple,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: "6px",
                    backgroundColor: palette.blue,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: "6px",
                    backgroundColor: palette.green,
                  }}
                />
                <div
                  style={{
                    display: "flex",
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
              paddingTop: "18px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
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
                fontSize: "13px",
                color: palette.green,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Estudo • Organização • Cronograma
            </span>
          </div>
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
