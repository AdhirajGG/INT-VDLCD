// components/layout.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  useEffect(() => {
    const updateActivity = async () => {
      if (user) {
        await axios.patch(`/api/users/${user.id}/activity`);
      }
    };
    
    // Update on mount and every 1 minutes
    updateActivity();
    const interval = setInterval(updateActivity, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  return <>{children}</>;
}