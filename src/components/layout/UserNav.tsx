"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LogOut, User, Settings, CreditCard, LifeBuoy } from "lucide-react";

// Placeholder for authentication state
const isAuthenticated = true; 
const userName = "Usuario Piloto"; // Translated
const userEmail = "usuario@health369.com"; // Translated (example)

export function UserNav() {
  if (!isAuthenticated) {
    return (
      <Link href="/login" legacyBehavior passHref>
        <Button variant="outline">Iniciar Sesión</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt={userName} data-ai-hint="user avatar" />
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile" passHref>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile#billing" passHref>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Facturación</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile#settings" passHref>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Ajustes</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
         <Link href="/support" passHref>
            <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Soporte</span>
            </DropdownMenuItem>
        </Link>
        <DropdownMenuItem disabled>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
