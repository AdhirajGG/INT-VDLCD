// componnents/mobile-sidebar.tsx
"use client"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false);
    
    
    useEffect(() => {
      setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <VisuallyHidden>Toggle navigation menu</VisuallyHidden>
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
            {/* Required SheetTitle for accessibility */}
            <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <Sidebar/>
        </SheetContent>
    </Sheet>
    );
}

export default MobileSidebar;