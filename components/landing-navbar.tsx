// components/landing-navbar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Warehouse, ChevronDown, ChevronUp, Home, BookOpen, VideoIcon, BookAIcon, Contact } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, Grid3X3, Sparkles } from "lucide-react";
import Image from "next/image";
import { useMachines } from "./machine";
import { cn } from "@/lib/utils";

export default function LandingNavbar() {
    const pathname = usePathname();
    const { isSignedIn, user } = useUser();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { categories, refreshCategories } = useMachines();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Check if user is admin
    const isAdmin = user?.publicMetadata?.role === "admin";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const productSubRoutes = categories.map((c) => ({
        label: c.name,
        href: `/products/category/${c.name.toLowerCase().replace(/\s+/g, "-")}`,
        icon: Grid3X3, // You can customize icons per category
    }));

    const routes = [
        {
            label: "Home",
            icon: Home,
            href: "/",
            color: "text-yellow-400",
        },
        ...(isAdmin ? [{
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-blue-400",
        }] : []),
        // Conditionally show Blog Management for admins
        ...(isAdmin ? [{
            label: "Blog Management",
            icon: BookAIcon,
            href: "/blog-management",
            color: "text-blue-400",
        }] : []),
        {
            label: "Products",
            icon: Warehouse,
            href: "#",
            color: "text-purple-400",
            subRoutes: productSubRoutes,
        },
        {
            label: "Videos",
            icon: VideoIcon,
            href: "/videos",
            color: "text-red-400",
        },
        {
            label: "Blog",
            icon: BookOpen,
            href: "/blog",
            color: "text-green-400",
        },
        {
            label: "Contact-Us",
            icon: Contact,
            href: "/contact",
            color: "text-fuchsia-500",
        }
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-indigo-950/90 backdrop-blur-md border-b border-indigo-800/50"
                : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="flex items-center"
                        >
                            <div className="relative w-40 h-20 mr-2">
                                <Image
                                    src="/VD-logo.png"
                                    alt="VDLCD Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {routes.map((route) => (
                            <div key={route.label}>
                                {/* Products Dropdown with Fancy Design */}
                                {route.subRoutes && route.subRoutes.length > 0 ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className={cn(
                                                    "flex items-center gap-2 p-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 hover:scale-105 group",
                                                    pathname.includes('/products')
                                                        ? "bg-white/10 text-white"
                                                        : "text-zinc-300 hover:text-white"
                                                )}
                                            >
                                                <route.icon
                                                    className={cn("h-5 w-5 transition-colors", route.color, "group-hover:text-cyan-400")}
                                                />
                                                {route.label}
                                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                                            </motion.button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            align="start"
                                            className="w-64 bg-gradient-to-br from-indigo-950/95 to-slate-900/95 backdrop-blur-xl border border-indigo-800/50 shadow-2xl"
                                        >
                                            <DropdownMenuLabel className="flex items-center gap-2 text-indigo-200 font-semibold">
                                                <Sparkles className="h-4 w-4 text-cyan-400" />
                                                Product Categories
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-indigo-800/30" />

                                            {route.subRoutes.map((sub, index) => (
                                                <DropdownMenuItem key={sub.href} asChild>
                                                    <Link
                                                        href={sub.href}
                                                        className={cn(
                                                            "flex items-center gap-3 p-3 rounded-md transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-800/40 hover:to-purple-800/40 hover:scale-[1.02] group cursor-pointer",
                                                            pathname === sub.href
                                                                ? "bg-gradient-to-r from-indigo-800/60 to-purple-800/60 text-white"
                                                                : "text-zinc-300 hover:text-white"
                                                        )}
                                                    >
                                                        <div className="p-1.5 rounded-md bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                                                            <sub.icon className="h-4 w-4 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
                                                        </div>
                                                        <span className="font-medium">{sub.label}</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}

                                            {route.subRoutes.length === 0 && (
                                                <div className="p-4 text-center text-zinc-400 text-sm">
                                                    No categories available
                                                </div>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    /* Simple link */
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <Link
                                            href={route.href}
                                            className={cn(
                                                "flex items-center gap-2 p-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 hover:scale-105 group",
                                                pathname === route.href
                                                    ? "bg-white/10 text-white"
                                                    : "text-zinc-300 hover:text-white"
                                            )}
                                        >
                                            <route.icon
                                                className={cn("h-5 w-5 transition-colors", route.color, "group-hover:text-cyan-400")}
                                            />
                                            {route.label}
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden md:flex gap-3">
                        {isSignedIn ? (
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10",
                                        userButtonPopoverCard: "bg-indigo-950/95 backdrop-blur-xl border border-indigo-800/50",
                                        userButtonPopoverActions: "text-zinc-300",
                                        userButtonPopoverActionButton: "hover:bg-indigo-800/40 text-zinc-300 hover:text-white",
                                        userButtonPopoverActionButtonText: "text-zinc-300 hover:text-white",
                                        userButtonPopoverFooter: "hidden"
                                    }
                                }}
                            />
                        ) : (
                            <>
                                <Link href="/sign-in">
                                    <Button
                                        variant="outline"
                                        className="rounded-full px-6 gap-2 border-indigo-500 text-indigo-100 hover:bg-indigo-900/50 transition-all duration-200 hover:scale-105"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button className="rounded-full px-6 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg">
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-white/10 transition-colors">
                                    <Menu className="h-6 w-6 text-indigo-200" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="bg-gradient-to-b from-indigo-950 to-slate-900 border-l border-indigo-800/50"
                            >
                                <VisuallyHidden>
                                    <SheetTitle>Navigation Menu</SheetTitle>
                                </VisuallyHidden>

                                <div className="flex flex-col h-full py-8">
                                    {/* Mobile Navigation */}
                                    <div className="flex flex-col space-y-4">
                                        {routes.map((route) => (
                                            <div key={route.label}>
                                                {/* Mobile Products with Collapsible Menu */}
                                                {route.subRoutes && route.subRoutes.length > 0 ? (
                                                    <div className="space-y-2">
                                                        <motion.button
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            onClick={() =>
                                                                setOpenDropdown(
                                                                    openDropdown === route.label ? null : route.label
                                                                )
                                                            }
                                                            className="w-full flex items-center justify-between p-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10 group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-1.5 rounded-md bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                                                                    <route.icon
                                                                        className={cn("h-5 w-5", route.color)}
                                                                    />
                                                                </div>
                                                                <span className="text-indigo-200">{route.label}</span>
                                                            </div>
                                                            {openDropdown === route.label ? (
                                                                <ChevronUp className="h-4 w-4 text-indigo-300" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 text-indigo-300" />
                                                            )}
                                                        </motion.button>

                                                        <AnimatePresence>
                                                            {openDropdown === route.label && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="ml-4 space-y-1"
                                                                >
                                                                    {route.subRoutes.map((sub) => (
                                                                        <Link
                                                                            key={sub.href}
                                                                            href={sub.href}
                                                                            className={cn(
                                                                                "flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-800/40 hover:to-purple-800/40",
                                                                                pathname === sub.href
                                                                                    ? "bg-gradient-to-r from-indigo-800/60 to-purple-800/60 text-white"
                                                                                    : "text-zinc-400 hover:text-white"
                                                                            )}
                                                                            onClick={() => setMenuOpen(false)}
                                                                        >
                                                                            <div className="p-1 rounded bg-indigo-600/20">
                                                                                <sub.icon className="h-3 w-3 text-indigo-400" />
                                                                            </div>
                                                                            {sub.label}
                                                                        </Link>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ) : (
                                                    /* Simple mobile link */
                                                    <Link
                                                        href={route.href}
                                                        className={cn(
                                                            "flex items-center gap-3 p-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/10",
                                                            pathname === route.href
                                                                ? "bg-white/10 text-white"
                                                                : "text-zinc-400 hover:text-white"
                                                        )}
                                                        onClick={() => setMenuOpen(false)}
                                                    >
                                                        <div className="p-1.5 rounded-md bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                                                            <route.icon
                                                                className={cn("h-5 w-5", route.color)}
                                                            />
                                                        </div>
                                                        {route.label}
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobile Auth Buttons */}
                                    <div className="mt-auto pt-8 flex flex-col gap-4">
                                        {isSignedIn ? (
                                            <div className="flex justify-center">
                                                <UserButton
                                                    appearance={{
                                                        elements: {
                                                            avatarBox: "w-10 h-10",
                                                            userButtonPopoverCard: "bg-indigo-950/95 backdrop-blur-xl border border-indigo-800/50",
                                                            userButtonPopoverActions: "text-zinc-300",
                                                            userButtonPopoverActionButton: "hover:bg-indigo-800/40 text-zinc-300 hover:text-white",
                                                            userButtonPopoverActionButtonText: "text-zinc-300 hover:text-white",
                                                            userButtonPopoverFooter: "hidden"
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <Link href="/sign-in">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-indigo-500 text-indigo-100 hover:bg-indigo-900/50 transition-all duration-200"
                                                        onClick={() => setMenuOpen(false)}
                                                    >
                                                        Login
                                                    </Button>
                                                </Link>
                                                <Link href="/sign-up">
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                                                        onClick={() => setMenuOpen(false)}
                                                    >
                                                        Register
                                                    </Button>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}