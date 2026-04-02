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
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "#ffffff",
          borderBottom: "1px solid #eaeaea",
          padding: "14px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={LOGO_URL} alt="AMMOCAT" width={28} height={28} style={{ display: "block" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#111", letterSpacing: "0.5px" }}>Story</span>
          </div>
          <Link
            href="/"
            style={{
              padding: "8px 18px",
              background: "#fafafa",
              color: "#444",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontWeight: 500,
              textDecoration: "none",
              fontSize: "13px",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div style={{ paddingTop: "68px", paddingBottom: "48px", maxWidth: "1000px", margin: "0 auto", paddingLeft: "20px", paddingRight: "20px" }}>
        {/* Hero image */}
        <div style={{ textAlign: "center", padding: "28px 0 20px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "16px",
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #eaeaea",
            }}
          >
            <img
              src="https://twejikjgxkzmphocbvpt.supabase.co/storage/v1/object/public/havensvgs/Ammo%20Cat%20Original.jpg"
              alt="Ammo Cat"
              style={{ maxWidth: "100%", width: "380px", height: "auto", borderRadius: "8px", display: "block" }}
            />
          </div>
        </div>

        {/* Two columns */}
        <div
          className="story-two-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            alignItems: "start",
            marginTop: "24px",
          }}
        >
          {/* Left: story + open source */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #eaeaea",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p style={{ background: "#f8f8f8", padding: "14px", borderRadius: "8px", margin: "0 0 10px", fontSize: "15px", color: "#333", lineHeight: 1.5 }}>
                Ammo cat is enjoying life in his castle
              </p>
              <p style={{ background: "#f8f8f8", padding: "14px", borderRadius: "8px", margin: "0 0 10px", fontSize: "15px", color: "#333", lineHeight: 1.5 }}>
                when zombie neighbors start launching
              </p>
              <p style={{ background: "#f8f8f8", padding: "14px", borderRadius: "8px", margin: 0, fontSize: "15px", color: "#333", lineHeight: 1.5 }}>
                rockets at him and his friends!
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #eaeaea",
                borderRadius: "12px",
                padding: "14px 16px",
                textAlign: "center",
                fontSize: "13px",
                color: "#888",
              }}
            >
              AMMOCAT is open source —{" "}
              <a href="https://github.com/sailorjacob/ammo-cat" target="_blank" rel="noopener noreferrer" style={{ color: "#333", textDecoration: "underline", textUnderlineOffset: "2px", fontWeight: 500 }}>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Right: audio */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #eaeaea",
              borderRadius: "12px",
              padding: "24px",
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
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  background: isPlaying ? "#f5f5f5" : "#fafafa",
                  color: "#333",
                  fontSize: "24px",
                  lineHeight: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                {isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <span style={{ marginLeft: "3px" }}>▶</span>
                )}
              </button>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#999", marginBottom: "6px" }}>
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
                  height: "6px",
                  borderRadius: "3px",
                  background: `linear-gradient(to right, #666 0%, #666 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`,
                  appearance: "none",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* Imagery */}
        <div style={{ marginTop: "40px", paddingBottom: "40px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "12px",
            }}
          >
            {MEDIA.map((item, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  background: "#e5e7eb",
                  borderRadius: "10px",
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
