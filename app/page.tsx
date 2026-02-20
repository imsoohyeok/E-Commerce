import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 최근 주문 더미 데이터
const recentOrders = [
  {
    id: "ORD001",
    customer: "김철수",
    product: "맥북 프로 14인치",
    amount: "₩2,900,000",
    status: "결제완료",
  },
  {
    id: "ORD002",
    customer: "이영희",
    product: "아이폰 15 프로",
    amount: "₩1,550,000",
    status: "배송중",
  },
  {
    id: "ORD003",
    customer: "박지성",
    product: "에어팟 프로 2세대",
    amount: "₩320,000",
    status: "취소됨",
  },
];

const stats = [
  {
    title: "총 매출액",
    value: "₩12,450,000",
    description: "+15% (저번 달 대비)",
    icon: DollarSign,
  },
  {
    title: "총 주문 건수",
    value: "+340",
    description: "+20% (저번 주 대비)",
    icon: ShoppingCart,
  },
  {
    title: "등록 상품",
    value: "1,204개",
    description: "현재 판매 중인 상품 수",
    icon: Package,
  },
  {
    title: "신규 고객",
    value: "+48명",
    description: "최근 24시간 이내",
    icon: Users,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          오늘의 비즈니스 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 카드 그리드 레이아웃 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 여기에 나중에 차트나 최근 주문 목록이 들어갈 예정입니다. */}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>최근 주문 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주문 번호</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead>상품명</TableHead>
                <TableHead>결제 금액</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "결제완료"
                          ? "default"
                          : order.status === "배송중"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
