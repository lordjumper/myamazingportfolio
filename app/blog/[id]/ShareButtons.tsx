"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    
    setShareUrl(window.location.href);
  }, []);

  const handleCopyLink = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-white/60">Share this post:</span>
      <div className="flex gap-3">
        <a
          href={
            shareUrl
              ? `https:
                  title,
                )}&url=${encodeURIComponent(shareUrl)}`
              : "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-[#00ff88] hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300"
          onClick={(e) => {
            if (!shareUrl) e.preventDefault();
          }}
        >
          <Icon icon="mdi:twitter" className="text-xl" />
        </a>
        <a
          href={
            shareUrl
              ? `https:
                  shareUrl,
                )}`
              : "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-[#00ff88] hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300"
          onClick={(e) => {
            if (!shareUrl) e.preventDefault();
          }}
        >
          <Icon icon="mdi:linkedin" className="text-xl" />
        </a>
        <button
          onClick={handleCopyLink}
          disabled={!shareUrl}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-[#00ff88] hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon icon="mdi:link-variant" className="text-xl" />
        </button>
      </div>
    </div>
  );
}
