"use client";

import { useState } from "react";
import { Music, Bell, Coffee, FileText, Megaphone, Link2, Pencil } from "lucide-react";
import { TimerHeader } from "./timer-header";
import { MenuItem } from "./menu-item";
import { SocialFooter } from "./social-footer";
import { MusicPlayer } from "./music-player";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ShiftFetcher } from "@/components/homebase/shift-fetcher";

export function ZoomMenu() {
  const [notes, setNotes] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleMenuClick = (item: string) => {
    setActiveSection(activeSection === item ? null : item);
  };

  return (
    <div className="w-[371px] h-[700px] bg-white rounded-xl shadow-lg flex flex-col">
      <TimerHeader />

      <main className="flex-1 overflow-y-auto p-2 space-y-1">
        <MenuItem
          icon={<Music className="w-4 h-4" />}
          label="Background Music"
          onClick={() => handleMenuClick('backgroundMusic')}
        />
        {activeSection === 'backgroundMusic' && <MusicPlayer />}
        
        <MenuItem
          icon={<Bell className="w-4 h-4" />}
          label="Chimes"
          onClick={() => handleMenuClick('chimes')}
        />
        <MenuItem
          icon={<Coffee className="w-4 h-4" />}
          label="Break Ideas"
          onClick={() => handleMenuClick('breakIdeas')}
        />
        <MenuItem
          icon={<FileText className="w-4 h-4" />}
          label="Next Guide"
          onClick={() => handleMenuClick('nextGuide')}
        />
        <MenuItem
          icon={<FileText className="w-4 h-4" />}
          label="Script"
          onClick={() => handleMenuClick('script')}
        />
        <MenuItem
          icon={<Megaphone className="w-4 h-4" />}
          label="Announcements"
          onClick={() => handleMenuClick('announcements')}
        />
        <MenuItem
          icon={<Link2 className="w-4 h-4" />}
          label="Next Sprint Links"
          onClick={() => handleMenuClick('sprintLinks')}
        />
        
        <Card className="mt-4 p-2">
          <div className="flex items-center gap-2 mb-2">
            <Pencil className="w-4 h-4" />
            <span className="text-sm font-medium">Notepad</span>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start typing..."
            className="min-h-[100px] text-sm resize-none"
          />
        </Card>
      </main>

      <footer className="mt-auto">
        <div className="bg-[#FFD700] px-3 py-2">
          <p className="font-bold text-sm">Next Guide:</p>
          <ShiftFetcher />
        </div>
        <SocialFooter />
      </footer>
    </div>
  );
}