"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const LOGO_URL =
  "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/transparentshooter.png";
const AUDIO_URL =
  "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/ammocat1.mp3";

const MEDIA = [
  { type: "video" as const, src: "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/whitespace.mp4", alt: "" },
  { type: "image" as const, src: "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/zombiesss.jpeg", alt: "Zombies" },
  { type: "video" as const, src: "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/zombieprep.mp4", alt: "" },
  { type: "video" as const, src: "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/superammo.mp4", alt: "" },
  { type: "image" as const, src: "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/poster4.jpeg", alt: "Poster" },
  { type: "image" as const, src: "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/movieposter3.jpg", alt: "Movie poster" },
  { type: "image" as const, src: "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/movieposter.jpeg", alt: "Movie poster" },
  { type: "image" as const, src: "https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/ammocat/mmomovie.jpeg", alt: "MMO movie" },
];

export default function StoryPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      setCurrentTime(t);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div>
      {/* Header - same pattern as feedback */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          padding: "16px 20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={LOGO_URL} alt="AMMOCAT" width={35} height={35} style={{ display: "block" }} />
          </div>
          <Link
            href="/"
            style={{
              padding: "12px 24px",
              background: "#000000",
              color: "#ffffff",
              borderRadius: "9999px",
              fontWeight: 500,
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main content - padding top so content is below fixed header */}
      <div style={{ paddingTop: "72px", paddingBottom: "48px", maxWidth: "1200px", margin: "0 auto", paddingLeft: "20px", paddingRight: "20px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "24px",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              marginBottom: "24px",
            }}
          >
            <img
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs/Ammo%20Cat%20Original.jpg"
              alt="Ammo Cat"
              style={{ maxWidth: "100%", width: "400px", height: "auto", borderRadius: "12px", display: "block" }}
            />
          </div>
        </div>

        {/* Two columns - stack on narrow screens */}
        <div
          className="story-two-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            alignItems: "start",
            marginTop: "32px",
          }}
        >
          {/* Left: story */}
          <div>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <p style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px", margin: "0 0 12px", fontSize: "16px", color: "#374151", lineHeight: 1.5 }}>
                Ammo cat is enjoying life in his castle
              </p>
              <p style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px", margin: "0 0 12px", fontSize: "16px", color: "#374151", lineHeight: 1.5 }}>
                when zombie neighbors start launching
              </p>
              <p style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px", margin: 0, fontSize: "16px", color: "#374151", lineHeight: 1.5 }}>
                rockets at him and his friends!
              </p>
            </div>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                padding: "16px",
                textAlign: "center",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              AMMOCAT is open source —{" "}
              <a href="https://github.com/sailorjacob/ammo-cat" target="_blank" rel="noopener noreferrer" style={{ color: "#000000", textDecoration: "underline", fontWeight: 500 }}>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Right: audio */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e0e0e0",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              style={{ display: "none" }}
            >
              <source src={AUDIO_URL} type="audio/mpeg" />
            </audio>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={handlePlayPause}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: isPlaying ? "#374151" : "#000000",
                  color: "#ffffff",
                  fontSize: "28px",
                  lineHeight: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isPlaying ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <span style={{ marginLeft: "4px" }}>▶</span>
                )}
              </button>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={duration > 0 ? duration : 1}
                step="any"
                value={duration > 0 ? currentTime : 0}
                onChange={handleSeek}
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  background: `linear-gradient(to right, #000000 0%, #000000 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
                  appearance: "none",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* Imagery */}
        <div style={{ marginTop: "48px", paddingBottom: "48px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {MEDIA.map((item, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  background: "#e5e7eb",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="auto"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

