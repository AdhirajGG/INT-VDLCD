"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Title Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>

      {/* Product Details Skeleton */}
      <Card className="p-4">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Skeleton */}
          <Skeleton className="h-64 w-full rounded-lg" />

          {/* Product Info Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Specifications Table Skeleton */}
      <Card className="p-4">
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}