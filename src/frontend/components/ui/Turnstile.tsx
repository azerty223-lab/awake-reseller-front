"use client";

import { Turnstile as ReactTurnstile } from "@marsidev/react-turnstile";

interface Props {
  onToken: (token: string) => void;
  onExpire?: () => void;
}

export function Turnstile({ onToken, onExpire }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <ReactTurnstile
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={onExpire}
      options={{ theme: "dark", size: "normal" }}
    />
  );
}
