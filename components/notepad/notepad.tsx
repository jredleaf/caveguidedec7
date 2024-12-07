"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ZoomToolsMenu } from "@/components/zoom-tools/zoom-tools-menu";

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const DEFAULT_ZOOM = 1;

export function Notepad() {
  const [content, setContent] = useState("");
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const handleReset = () => {
    setZoom(DEFAULT_ZOOM);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <ZoomToolsMenu
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
          />
        </div>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
            className="min-h-[300px] resize-none"
          />
        </div>
      </div>
    </Card>
  );
}