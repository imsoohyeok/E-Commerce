"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SidebarLink({ href, children }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      data-active={isActive} 
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
      )}
    >
      {children}
    </Link>
  );
}