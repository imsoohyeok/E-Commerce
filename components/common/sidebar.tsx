"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
  Users,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "상품 관리", href: "/products", icon: ShoppingBag },
  { name: "주문 내역", href: "/orders", icon: ReceiptText },
  { name: "고객 관리", href: "/customers", icon: Users },
  { name: "설정", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-slate-50/50 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          SHOP ADMIN
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-white" : "text-slate-500"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
