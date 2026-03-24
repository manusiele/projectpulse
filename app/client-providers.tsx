"use client";

import { RegisterServiceWorker } from "./register-sw";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RegisterServiceWorker />
      {children}
    </>
  );
}
