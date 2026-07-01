import React from "react";
import { Inbox } from "lucide-react";
import Button from "./Button";

export default function EmptyState({ icon: Icon = Inbox, title, body, actionLabel, onAction, compact = false }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-10" : "py-16"} px-6`}>
      <div className="relative w-16 h-16 mb-4">
        <svg viewBox="0 0 64 64" className="absolute inset-0 text-line" fill="none">
          <path
            d="M32 4 L52 16 L52 48 L32 60 L12 48 L12 16 Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M32 4 L52 16 L32 28 L12 16 Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={22} className="text-ink-faint" strokeWidth={1.7} />
        </div>
      </div>
      <h3 className="text-[15px] font-bold text-ink mb-1">{title}</h3>
      {body && <p className="text-sm text-ink-faint max-w-xs leading-relaxed mb-5">{body}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
