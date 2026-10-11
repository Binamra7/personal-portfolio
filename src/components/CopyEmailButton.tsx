"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context, permissions). The mailto
      // link next to this button still works, so fail quietly.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-muted text-sm transition-colors hover:border-line-strong hover:text-fg"
    >
      {copied ? <CheckIcon className="size-4 text-accent" /> : <CopyIcon className="size-4" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
