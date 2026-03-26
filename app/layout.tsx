import "./globals.css";
import { Metadata } from "next";
import { MSWProvider } from "./msw-provider";
import {Providers} from "./providers";
import { Sidebar } from "@/components/common/sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Shop Admin",
    template: "%s | Shop Admin",
  },
  description: "스마트한 쇼핑몰 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <MSWProvider>
            <div className="flex min-h-screen">
              {/* 사이드바 고정 */}
              <Sidebar />

              {/* 메인 콘텐츠 영역 */}
              <div className="flex-1 flex flex-col">
                <header className="h-16 border-b bg-white flex items-center px-8 justify-between">
                  <span className="font-medium text-slate-600">
                    Admin Dashboard
                  </span>
                  {/* 여기에 추후 유저 프로필 컴포넌트 추가 */}
                </header>

                <main className="flex-1 bg-slate-50/30 p-8">{children}</main>
              </div>
            </div>
            <Toaster position="top-center" richColors />
          </MSWProvider>
        </Providers>
      </body>
    </html>
  );
}
