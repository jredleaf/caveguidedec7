"use client";

import { Slack, MessageCircle, Home } from "lucide-react";

export function SocialFooter() {
  return (
    <div className="flex justify-center items-center gap-6 py-3">
      <div className="hover:text-primary transition-colors duration-200 cursor-pointer">
        <Slack className="w-5 h-5" />
      </div>
      <div className="hover:text-primary transition-colors duration-200 cursor-pointer">
        <MessageCircle className="w-5 h-5" />
      </div>
      <div className="hover:text-primary transition-colors duration-200 cursor-pointer">
        <Home className="w-5 h-5" />
      </div>
    </div>
  );
}