// components/layout.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  useEffect(() => {
    const updateActivity = async () => {
      if (user?.id) {
        try {
          // Use clerkId instead of Prisma ID
          await axios.patch(`/api/users/${user.id}/activity`);
        } catch (error) {
          console.error("Failed to update activity", error);
        }
      }
    };
    
    updateActivity();
    const interval = setInterval(updateActivity, 1 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  return <>{children}</>;
}