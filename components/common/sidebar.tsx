import { SidebarLink } from "./sidebar-link";
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
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-slate-50/50 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          SHOP ADMIN
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarLink key={item.href} href={item.href}>
            <item.icon
              className="h-4 w-4 text-slate-500 group-data-[active=true]:text-white"
            />
            {item.name}
          </SidebarLink>
        ))}
      </nav>
    </aside>
  );
}