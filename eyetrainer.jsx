import { useEffect, useMemo, useRef, useState } from "react";
import { EyeTrainerController } from "./src/cloneEngine";

const STORAGE_KEYS = {
  darkMode: "eyetrainer_dark_mode",
  selectedSkin: "eyetrainer_selected_skin",
};

const EXERCISES = [
  {
    id: "comprehensive",
    mode: "comprehensive",
    name: "综合训练",
    nameEn: "Comprehensive",
    desc: "自动依次跑完全部训练模式，适合整套练习",
    icon: "◈",
  },
  {
    id: "verticalWaves",
    mode: "single",
    backendIndex: 0,
    name: "垂直波形",
    nameEn: "Vertical Waves",
    desc: "竖向锯齿路径，训练上下追踪稳定性",
    icon: "∿",
  },
  {
    id: "stellarTrail",
    mode: "single",
    backendIndex: 1,
    name: "星形轨迹",
    nameEn: "Stellar Trail",
    desc: "五角星折线追踪，训练方向切换",
    icon: "✦",
  },
  {
    id: "infinityTrail",
    mode: "single",
    backendIndex: 2,
    name: "无限轨迹",
    nameEn: "Infinity Trail",
    desc: "∞ 轨迹平滑追踪，训练连续眼动",
    icon: "∞",
  },
  {
    id: "circularTrail",
    mode: "single",
    backendIndex: 3,
    name: "环形轨迹",
    nameEn: "Circular Trail",
    desc: "圆形持续追踪，训练环向控制",
    icon: "◯",
  },
  {
    id: "horizontalWave",
    mode: "single",
    backendIndex: 4,
    name: "水平波形",
    nameEn: "Horizontal Wave",
    desc: "横向波形路径，训练左右追踪",
    icon: "↔",
  },
  {
    id: "flickPulse",
    mode: "single",
    backendIndex: 5,
    name: "闪跳脉冲",
    nameEn: "Flick Pulse",
    desc: "多点闪跳切换，训练扫视反应",
    icon: "⚡",
  },
  {
    id: "horizontalBalls",
    mode: "single",
    backendIndex: 6,
    name: "横向多球",
    nameEn: "Horizontal Balls",
    desc: "多目标横向移动，训练分配注意力",
    icon: "◉",
  },
  {
    id: "verticalBalls",
    mode: "single",
    backendIndex: 7,
    name: "纵向多球",
    nameEn: "Vertical Balls",
    desc: "多目标纵向移动，训练切换追踪",
    icon: "⋮",
  },
  {
    id: "horizontalFast",
    mode: "single",
    backendIndex: 8,
    name: "横向高速",
    nameEn: "Horizontal Fast",
    desc: "更快的横向多球节奏",
    icon: "⇢",
  },
  {
    id: "verticalFast",
    mode: "single",
    backendIndex: 9,
    name: "纵向高速",
    nameEn: "Vertical Fast",
    desc: "更快的纵向多球节奏",
    icon: "⇣",
  },
  {
    id: "freeBall",
    mode: "single",
    backendIndex: 10,
    name: "自由球",
    nameEn: "Free Ball",
    desc: "随机平滑游走，训练稳定追踪",
    icon: "⬡",
  },
  {
    id: "peripheral1",
    mode: "single",
    backendIndex: 11,
    name: "外周视觉 1",
    nameEn: "Peripheral 1",
    desc: "双目标外周训练，强化边缘感知",
    icon: "⊹",
  },
  {
    id: "randomFlick",
    mode: "single",
    backendIndex: 12,
    name: "随机闪跳",
    nameEn: "Random Flick",
    desc: "随机位置切换，训练快速定位",
    icon: "✹",
  },
  {
    id: "peripheral2",
    mode: "single",
    backendIndex: 13,
    name: "外周视觉 2",
    nameEn: "Peripheral 2",
    desc: "围绕图像目标切换注视点",
    icon: "◎",
  },
];

const SKINS = {
  default: {
    name: "经典",
    color: "#00d610",
    lightColor: "#00b050",
    glow: "0 0 20px #00d61066, 0 0 40px #00d61033",
    lightGlow: "0 0 20px #00b05066, 0 0 40px #00b05033",
  },
  red: {
    name: "红色",
    color: "#ff2a2a",
    lightColor: "#df1d1d",
    glow: "0 0 20px #ff2a2a66, 0 0 40px #ff2a2a33",
    lightGlow: "0 0 20px #df1d1d66, 0 0 40px #df1d1d33",
  },
  ice: {
    name: "冰蓝",
    color: "#22aaff",
    lightColor: "#2266dd",
    glow: "0 0 20px #22aaff66, 0 0 40px #22aaff33",
    lightGlow: "0 0 20px #2266dd66, 0 0 40px #2266dd33",
  },
  gold: {
    name: "黄金",
    color: "#ffcc00",
    lightColor: "#cc8800",
    glow: "0 0 20px #ffcc0066, 0 0 40px #ffcc0033",
    lightGlow: "0 0 20px #cc880066, 0 0 40px #cc880033",
  },
  purple: {
    name: "紫电",
    color: "#aa44ff",
    lightColor: "#8822cc",
    glow: "0 0 20px #aa44ff66, 0 0 40px #aa44ff33",
    lightGlow: "0 0 20px #8822cc66, 0 0 40px #8822cc33",
  },
  white: {
    name: "纯白",
    color: "#ffffff",
    lightColor: "#333333",
    glow: "0 0 20px #ffffff44, 0 0 40px #ffffff22",
    lightGlow: "0 0 20px #33333344, 0 0 40px #33333322",
  },
};

function darkenHex(hex, factor = 0.25) {
  const value = hex.replace("#", "");
  if (value.length !== 6) {
    return hex;
  }
  const r = Math.max(0, Math.min(255, Math.round(parseInt(value.slice(0, 2), 16) * (1 - factor))));
  const g = Math.max(0, Math.min(255, Math.round(parseInt(value.slice(2, 4), 16) * (1 - factor))));
  const b = Math.max(0, Math.min(255, Math.round(parseInt(value.slice(4, 6), 16) * (1 - factor))));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function buildDotPalette(skin) {
  return {
    dark: {
      primary: skin.color,
      secondary: darkenHex(skin.color, 0.22),
      outline: "transparent",
    },
    light: {
      primary: skin.lightColor,
      secondary: darkenHex(skin.lightColor, 0.2),
      outline: "transparent",
    },
  };
}

export default function EyeTrainer() {
  const [screen, setScreen] = useState("menu");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    const saved = window.localStorage.getItem(STORAGE_KEYS.darkMode);
    if (saved == null) {
      return true;
    }
    return saved === "1";
  });
  const [selectedSkin, setSelectedSkin] = useState(() => {
    if (typeof window === "undefined") {
      return "default";
    }
    const saved = window.localStorage.getItem(STORAGE_KEYS.selectedSkin);
    if (saved === "fire") {
      return "red";
    }
    if (saved && SKINS[saved]) {
      return saved;
    }
    return "default";
  });
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentExerciseLabel, setCurrentExerciseLabel] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const canvasRef = useRef(null);
  const controllerRef = useRef(null);

  const skinData = SKINS[selectedSkin];
  const accent = darkMode ? skinData.color : skinData.lightColor;
  const accentGlow = darkMode ? skinData.glow : skinData.lightGlow;

  const bgCard = darkMode ? "#13131a" : "#ffffff";
  const bgCardHover = darkMode ? "#1a1a24" : "#f8f8fc";
  const textPrimary = darkMode ? "#e8e8f0" : "#1a1a2e";
  const textSecondary = darkMode ? "#8888a0" : "#666688";
  const border = darkMode ? "#222233" : "#ddddee";
  const dotPalette = useMemo(() => buildDotPalette(skinData), [selectedSkin]);
  const stageBackground = darkMode ? "#040713" : "#f1f1f4";
  const exerciseNameMap = useMemo(() => {
    const map = {};
    for (let i = 0; i < EXERCISES.length; i += 1) {
      map[EXERCISES[i].nameEn] = EXERCISES[i].name;
    }
    return map;
  }, []);

  useEffect(() => {
    if (screen !== "exercise" || !selectedExercise) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const controller = new EyeTrainerController(canvas, {
      onExerciseNameChange: (nameEn) => {
        setCurrentExerciseLabel(exerciseNameMap[nameEn] ?? nameEn);
      },
    });

    controller.setShowGrid(true);
    controller.setDarkMode(darkMode);
    controller.setDotPalette(dotPalette);
    if (selectedExercise.mode === "comprehensive") {
      controller.startComprehensive();
    } else {
      controller.startSingleTrainer(selectedExercise.backendIndex);
    }

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [screen, selectedExercise, exerciseNameMap]);

  useEffect(() => {
    controllerRef.current?.setDarkMode(darkMode);
  }, [darkMode]);

  useEffect(() => {
    controllerRef.current?.setDotPalette(dotPalette);
  }, [dotPalette]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.darkMode, darkMode ? "1" : "0");
  }, [darkMode]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.selectedSkin, selectedSkin);
  }, [selectedSkin]);

  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentExerciseLabel(exercise.name);
    setIsRunning(true);
    setScreen("exercise");
  };

  const stopExercise = () => {
    setIsRunning(false);
    if (controllerRef.current) {
      controllerRef.current.destroy();
      controllerRef.current = null;
    }
    setScreen("menu");
  };

  if (screen === "exercise") {
    const chipBg = darkMode ? "rgba(7, 10, 24, 0.68)" : "rgba(255, 255, 255, 0.82)";
    const chipBorder = darkMode ? "rgba(255,255,255,0.12)" : "rgba(130,130,150,0.24)";
    const chipShadow = darkMode ? "0 10px 30px rgba(0,0,0,0.32)" : "0 10px 24px rgba(130,130,150,0.16)";

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: stageBackground,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          color: textPrimary,
        }}
      >
        <canvas
          ref={canvasRef}
          width={1000}
          height={800}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 18,
            left: 18,
            display: "flex",
            alignItems: "center",
            gap: 12,
            zIndex: 20,
          }}
        >
          <button
            onClick={stopExercise}
            style={{
              background: chipBg,
              border: `1px solid ${chipBorder}`,
              color: textPrimary,
              padding: "8px 14px",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "inherit",
              boxShadow: chipShadow,
            }}
          >
            ← 返回
          </button>
          <span
            style={{
              color: textSecondary,
              fontSize: 13,
              padding: "8px 12px",
              borderRadius: 12,
              border: `1px solid ${chipBorder}`,
              background: chipBg,
              boxShadow: chipShadow,
            }}
          >
            {currentExerciseLabel}
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            onClick={() => controllerRef.current?.prevTrainer()}
            style={{
              background: chipBg,
              border: `1px solid ${chipBorder}`,
              color: textPrimary,
              borderRadius: 12,
              width: 40,
              height: 36,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: chipShadow,
            }}
          >
            ←
          </button>
          <button
            onClick={() => controllerRef.current?.nextTrainer()}
            style={{
              background: chipBg,
              border: `1px solid ${chipBorder}`,
              color: textPrimary,
              borderRadius: 12,
              width: 40,
              height: 36,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: chipShadow,
            }}
          >
            →
          </button>
        </div>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          style={{
            position: "absolute",
            left: 18,
            bottom: 18,
            zIndex: 20,
            background: chipBg,
            border: `1px solid ${chipBorder}`,
            color: textPrimary,
            borderRadius: 12,
            minWidth: 108,
            height: 38,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            boxShadow: chipShadow,
            padding: "0 14px",
          }}
        >
          {darkMode ? "☀ 亮色" : "🌙 暗色"}
        </button>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { margin: 0; overflow: hidden; }
        `}</style>
      </div>
    );
  }

  if (screen === "settings") {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: darkMode
            ? "radial-gradient(ellipse at 30% 20%, #0f0f1a 0%, #060609 100%)"
            : "radial-gradient(ellipse at 30% 20%, #f8f8ff 0%, #e8e8f0 100%)",
          color: textPrimary,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          overflow: "auto",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <button
              onClick={() => setScreen("menu")}
              style={{
                background: "none",
                border: `1px solid ${border}`,
                color: textPrimary,
                padding: "6px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              ← 返回
            </button>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>⚙ 设置</h2>
          </div>

          <div
            style={{
              background: bgCard,
              borderRadius: 16,
              border: `1px solid ${border}`,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h3
              style={{
                margin: "0 0 20px",
                fontSize: 14,
                color: textSecondary,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              显示设置
            </h3>

            {[
              { label: "深色模式", value: darkMode, set: setDarkMode },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: `1px solid ${border}`,
                }}
              >
                <span style={{ fontSize: 14 }}>{item.label}</span>
                <div
                  onClick={() => item.set(!item.value)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: item.value ? accent : darkMode ? "#333" : "#ccc",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: item.value ? 22 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: bgCard,
              borderRadius: 16,
              border: `1px solid ${border}`,
              padding: 24,
            }}
          >
            <h3
              style={{
                margin: "0 0 20px",
                fontSize: 14,
                color: textSecondary,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              UI 皮肤
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {Object.entries(SKINS).map(([key, skin]) => {
                const c = darkMode ? skin.color : skin.lightColor;
                const g = darkMode ? skin.glow : skin.lightGlow;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedSkin(key)}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: `2px solid ${selectedSkin === key ? c : border}`,
                      background: selectedSkin === key ? (darkMode ? `${c}11` : `${c}15`) : "transparent",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: c,
                        boxShadow: g,
                        margin: "0 auto 8px",
                      }}
                    />
                    <div style={{ fontSize: 12 }}>{skin.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { margin: 0; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 3px; }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: darkMode
          ? "radial-gradient(ellipse at 50% 0%, #111128 0%, #060609 60%)"
          : "radial-gradient(ellipse at 50% 0%, #f0f0ff 0%, #e0e0ea 60%)",
        color: textPrimary,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        overflow: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "40%",
          background: `radial-gradient(ellipse, ${accent}08, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: accent,
                boxShadow: accentGlow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: darkMode ? "#000" : "#fff",
                }}
              />
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: -1,
                color: textPrimary,
                textShadow: `0 0 18px ${accent}33`,
              }}
            >
              Eye Trainer
            </h1>
          </div>
          <p style={{ color: textSecondary, fontSize: 14, margin: 0, letterSpacing: 1 }}>
            视力训练 · 提高动态视力反应速度
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 40 }}>
          {[
            { label: "⚙ 设置", onClick: () => setScreen("settings") },
            { label: darkMode ? "☀ 亮色" : "🌙 暗色", onClick: () => setDarkMode(!darkMode) },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              style={{
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${border}`,
                color: textPrimary,
                padding: "8px 20px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {EXERCISES.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => startExercise(exercise)}
              style={{
                background: bgCard,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: "24px 20px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = bgCardHover;
                event.currentTarget.style.borderColor = accent;
                event.currentTarget.style.transform = "translateY(-2px)";
                event.currentTarget.style.boxShadow = `0 8px 32px ${accent}15`;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = bgCard;
                event.currentTarget.style.borderColor = border;
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: `${accent}06`,
                }}
              />
              <div
                style={{
                  fontSize: 28,
                  marginBottom: 12,
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${accent}11`,
                  borderRadius: 12,
                }}
              >
                {exercise.icon}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{exercise.name}</div>
              <div style={{ fontSize: 11, color: textSecondary, marginBottom: 8, letterSpacing: 0.5 }}>
                {exercise.nameEn}
              </div>
              <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.5 }}>{exercise.desc}</div>
              <div style={{ marginTop: 16, fontSize: 12, color: accent, fontWeight: 600 }}>开始训练 →</div>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 48,
            padding: "20px 0",
            borderTop: `1px solid ${border}`,
            color: textSecondary,
            fontSize: 12,
          }}
        >
          <div style={{ marginBottom: 8 }}>
            当前设置: 主题 {darkMode ? "暗色" : "亮色"} · 皮肤 {SKINS[selectedSkin].name}
          </div>
          <div style={{ opacity: 0.6 }}>提示：进入训练后，保持头部不动，仅用眼睛追踪目标</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}
