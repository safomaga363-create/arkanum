"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-[#e4e4e7]">
        <div className="text-center max-w-md">
          <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Application Error</h2>
          <p className="text-gray-400 mb-6">
            A critical error occurred. Please refresh the page.
          </p>
          <Button onClick={reset}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      </body>
    </html>
  );
}
