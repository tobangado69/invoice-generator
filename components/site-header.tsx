"use client";

/**
 * Site Header
 * Main navigation with authentication features
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/invoices", label: "Invoice" },
    { href: "/profile", label: "Profil" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Berhasil keluar",
        description: "Anda telah keluar dari sistem",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan jaringan",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b bg-card/70 supports-[backdrop-filter]:backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          <span className="text-primary">Invoice</span>
          <span className="text-foreground">Flow</span>
        </Link>

        {isAuthenticated && (
          <>
            <nav className="hidden md:flex items-center gap-6">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm text-muted-foreground hover:text-foreground transition-colors",
                    pathname === item.href && "text-foreground font-medium"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/invoices/new" className="hidden sm:block">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Buat Baru
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {user?.email || "Pengguna"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Profil</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        {!isAuthenticated &&
          pathname !== "/login" &&
          pathname !== "/register" && (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </div>
          )}
      </div>
    </header>
  );
}
