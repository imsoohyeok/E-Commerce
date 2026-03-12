"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, "상품명은 2글자 이상이어야 합니다."),
  price: z.coerce.number().min(100, "가격은 최소 100원 이상이어야 합니다."),
  category: z.string().min(1, "카테고리를 입력해주세요."),
});

// 부모에게 데이터를 넘겨줄 props 정의
interface ProductFormProps {
  onSuccess: (values: z.infer<typeof formSchema>) => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", price: 0, category: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSuccess)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상품명</FormLabel>
              <FormControl><Input placeholder="상품명을 입력하세요" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>가격</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0"
                          {...field}
                          value={field.value as number} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리</FormLabel>
                      <FormControl><Input placeholder="카테고리 선택" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
        <DialogFooter>
          <Button type="submit" className="w-full">등록하기</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}