import Link from "next/link";
import React from "react";
import { SITE_INFO } from "@/lib/data";

const LOGO_DOTS = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];

export default function Footer() {
  return (
    <>
      <hr className="divider" style={{ margin: "0 clamp(32px, 6vw, 96px)" }} />

      <footer
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "32px clamp(32px, 6vw, 96px) 64px",
        }}
      >
        <div className="flex items-center gap-2" style={{ opacity: 0.5 }}>
          {/* <span className="logo-dots" aria-hidden="true">
            {LOGO_DOTS.map((c) => (
              <span key={c} style={{ background: c }} />
            ))}
          </span> */}
          {SITE_INFO.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={SITE_INFO.logoUrl}
              alt={SITE_INFO.name || "Logo"}
              className="logo-img-footer"
            />
          )}
        </div>

        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", fontWeight: 500 }}>
          Built for designers. Loved by developers.
        </p>

        <div className="flex gap-5">
          <Link
            href="/privacy"
            style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.85rem", fontWeight: 600 }}
            className="hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.85rem", fontWeight: 600 }}
            className="hover:text-white transition-colors"
          >
            Terms
          </Link>
          <Link
            href="https://github.com"
            style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.85rem", fontWeight: 600 }}
            className="hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </div>
      </footer>
    </>
  );
}
