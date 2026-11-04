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
import { LogOut, User, Settings, Shield, Utensils, Award } from "lucide-react";
import { initialMockHeroProfile } from "@/lib/gamification";

export function UserNav() {
  const hero = initialMockHeroProfile;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/40 hover:ring-primary transition-all p-0">
          <Avatar className="h-10 w-10 border border-background">
            <AvatarImage src={hero.avatarUrl} alt={hero.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">{hero.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold leading-none">{hero.name}</p>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Nivel {hero.level}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{hero.email}</p>
            <div className="text-xs text-primary font-semibold flex items-center gap-1 mt-1">
              <Shield className="h-3.5 w-3.5" /> {hero.heroRank}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2.5 h-4 w-4 text-primary" />
              <span>Atributos & Superhéroe</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/experts" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <Utensils className="mr-2.5 h-4 w-4 text-emerald-400" />
              <span>Mi Nutricionista Valkiria</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/challenges" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <Award className="mr-2.5 h-4 w-4 text-amber-400" />
              <span>Desafíos & Trofeos</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile#settings" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
              <span>Configuración</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="cursor-not-allowed opacity-60">
          <LogOut className="mr-2.5 h-4 w-4 text-destructive" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
