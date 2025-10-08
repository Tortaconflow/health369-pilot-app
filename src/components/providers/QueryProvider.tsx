"use client";

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Lazy load devtools in development only
const ReactQueryDevtools = process.env.NODE_ENV === "development"
  ? React.lazy(() =>
      import("@tanstack/react-query-devtools").then((res) => ({
        default: res.ReactQueryDevtools,
      }))
    )
  : () => null;


export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));
  const [showDevtools, setShowDevtools] = React.useState(false);

  // Show devtools on key press (e.g., Ctrl+Shift+D)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        setShowDevtools((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </React.Suspense>
      )}
    </TanstackQueryClientProvider>
  );
}
