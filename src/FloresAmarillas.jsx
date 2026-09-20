import { useEffect, useMemo, useRef, useState } from "react";
import "./FloresAmarillas.css";

/**
 * FloresAmarillas
 * Página-regalo animada: cielo estrellado, pétalos cayendo,
 * reproductor decorativo y un jardín de girasoles generado por código.
 *
 * Uso:
 *   <FloresAmarillas
 *     titulo="Hoy es tu día"
 *     mensaje="Feliz 21 de marzo 🧡"
 *     firma="@Ameri50"
 *     flowerCount={22}
 *     duracion={23}
 *   />
 */
export default function FloresAmarillas({
  titulo = "Hoy es tu día",
  mensaje = "Feliz 21 de marzo 🧡",
  firma = "@Ameri50",
  flowerCount = 42,
  duracion = 23,
}) {
  const [stars, setStars] = useState([]);
  const [petals, setPetals] = useState([]);
  const [flowers, setFlowers] = useState([]);

  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // --- Generar estrellas una sola vez ---
  useEffect(() => {
    setStars(
      Array.from({ length: 70 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  // --- Generar pétalos cayendo una sola vez ---
  const glyphs = useMemo(() => ["🌼", "✿", "❀"], []);
  useEffect(() => {
    setPetals(
      Array.from({ length: 18 }, () => ({
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        left: Math.random() * 100,
        drift: Math.random() * 80 - 40,
        duration: 7 + Math.random() * 8,
        delay: Math.random() * 10,
        size: 10 + Math.random() * 10,
      }))
    );
  }, [glyphs]);

  // --- Generar ramo de girasoles, bien tupido y sin recortes ---
  useEffect(() => {
    const W = 400;
    const BASE = 300;
    const MARGIN = 30;
    const list = Array.from({ length: flowerCount }, (_, i) => {
      const x =
        MARGIN +
        (W - MARGIN * 2) * (i / Math.max(flowerCount - 1, 1)) +
        (Math.random() * 12 - 6);
      const peakY = 55 + Math.random() * 110;
      const ctrl1Y = BASE - (BASE - peakY) * 0.45;
      const drift = Math.random() * 20 - 10;
      const scale = 0.5 + Math.random() * 0.65;
      const stemDelay = +(Math.random() * 1.2).toFixed(2);
      const flowerDelay = +(stemDelay + 0.5).toFixed(2);
      const leafDelay = +(stemDelay + 0.3).toFixed(2);
      const swayDelay = +(Math.random() * 4).toFixed(2);
      const tipX = x + drift;
      const tipY = peakY + 10;

      return {
        id: i,
        scale,
        stemDelay,
        flowerDelay,
        leafDelay,
        swayDelay,
        hasLeaf: i % 2 === 0,
        stemPath: `M${x.toFixed(1)},${BASE} C${(x + drift * 0.3).toFixed(
          1
        )},${ctrl1Y.toFixed(1)} ${(x + drift * 0.7).toFixed(1)},${(
          peakY + 30
        ).toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}`,
        leafPath: (() => {
          const lx = x + drift * 0.5;
          const ly = (tipY + BASE) / 2;
          const dir = i % 4 < 2 ? 1 : -1;
          return `M${lx.toFixed(1)},${ly.toFixed(1)} C${(
            lx +
            20 * dir
          ).toFixed(1)},${(ly - 4).toFixed(1)} ${(lx + 24 * dir).toFixed(
            1
          )},${(ly + 12).toFixed(1)} ${(lx + 4 * dir).toFixed(1)},${(
            ly + 18
          ).toFixed(1)} Z`;
        })(),
        tipX,
        tipY,
      };
    });
    // Dibuja primero las de atrás (más arriba) para que las de adelante
    // queden completas por encima, como un ramo tupido real.
    list.sort((a, b) => a.tipY - b.tipY);
    setFlowers(list);
  }, [flowerCount]);

  // --- Reloj del reproductor ---
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => (e + 0.25 >= duracion ? 0 : e + 0.25));
      }, 250);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, duracion]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  const progressPct = Math.min((elapsed / duracion) * 100, 100);

  return (
    <div className="fa-root">
      <div className="fa-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="fa-star"
            style={{
              left: `${s.left}vw`,
              top: `${s.top}vh`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="fa-petals" aria-hidden="true">
        {petals.map((p, i) => (
          <span
            key={i}
            className="fa-petal"
            style={{
              left: `${p.left}vw`,
              fontSize: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
            }}
          >
            {p.glyph}
          </span>
        ))}
      </div>

      <main className="fa-main">
        <h1 className="fa-title">{titulo}</h1>

        <div className="fa-player">
          <button
            className="fa-play-btn"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pausar" : "Reproducir"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <rect x="5" y="4" width="5" height="16" rx="1" />
                <rect x="14" y="4" width="5" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            )}
          </button>

          <div className="fa-player-info">
            <div className="fa-track-label">{mensaje}</div>
            <div className="fa-progress-track">
              <div
                className="fa-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="fa-time-row">
              <span>{formatTime(elapsed)}</span>
              <span>{formatTime(duracion)}</span>
            </div>
          </div>
        </div>

        <div className="fa-garden">
          <svg viewBox="0 0 400 300">
            {flowers.map((f) => (
              <g key={f.id}>
                <path
                  className="fa-stem"
                  d={f.stemPath}
                  style={{ animationDelay: `${f.stemDelay}s` }}
                />
                {f.hasLeaf && (
                  <path
                    className="fa-leaf"
                    d={f.leafPath}
                    style={{ "--leaf-delay": `${f.leafDelay}s` }}
                  />
                )}
                <g
                  className="fa-flower fa-sway"
                  style={{
                    "--delay": `${f.flowerDelay}s`,
                    "--sway-delay": `${f.swayDelay}s`,
                    transform: `translate(${f.tipX.toFixed(
                      1
                    )}px, ${f.tipY.toFixed(1)}px) scale(${f.scale.toFixed(2)})`,
                  }}
                >
                  <g>
                    {Array.from({ length: 16 }, (_, k) => {
                      const angle = k * (360 / 16);
                      const rad = ((angle - 90) * Math.PI) / 180;
                      const cx = +(Math.cos(rad) * 16).toFixed(2);
                      const cy = +(Math.sin(rad) * 16).toFixed(2);
                      return (
                        <ellipse
                          key={k}
                          className="fa-petal-shape"
                          cx={cx}
                          cy={cy}
                          rx="6.5"
                          ry="20"
                          transform={`rotate(${angle} ${cx} ${cy})`}
                        />
                      );
                    })}
                    <circle className="fa-flower-center" r="13" />
                  </g>
                </g>
              </g>
            ))}
          </svg>
        </div>

        <div className="fa-signature">
          Hecho con amor y código <span>{firma}</span>
        </div>
      </main>
    </div>
  );
}
