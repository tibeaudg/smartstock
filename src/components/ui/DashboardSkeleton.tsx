// components/ui/DashboardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => (
  <div className="flex h-screen overflow-hidden bg-gray-50">
    {/* Sidebar Skeleton */}
    <div className="w-64 bg-white border-r p-4 space-y-4 hidden md:block">
      <Skeleton className="h-10 w-32 mb-8" />
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
    
    <div className="flex-1 flex flex-col">
      {/* Header Skeleton */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-24" />
        </div>
      </header>
      
      {/* Content Skeleton */}
      <main className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </main>
    </div>
  </div>
);