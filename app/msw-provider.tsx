"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (process.env.NODE_ENV === "development") {
        const { initMocks } = await import("../mocks");
        await initMocks();
        setMswReady(true);
      } else {
        setMswReady(true);
      }
    };

    if (!mswReady) {
      init();
    }
  }, [mswReady]);

  // MSW가 준비될 때까지 아무것도 렌더링하지 않거나, 로딩 스피너를 보여줍니다.
  if (!mswReady) return null; 

  return <>{children}</>;
}