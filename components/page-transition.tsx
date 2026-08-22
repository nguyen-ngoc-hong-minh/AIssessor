"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setDisplayChildren(children);
  }, [pathname, children]);

  return (
    <div key={pathname} className="dash-page-transition w-full min-h-full">
      {displayChildren}
    </div>
  );
}
