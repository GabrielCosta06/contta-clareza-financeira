import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { BrandLogo } from "@/components/BrandLogo";
import { Menu } from "lucide-react";
import { useState } from "react";


const nav = [
  { to: "/produto", label: "Produto" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/contta-ai", label: "Contta AI" },
  { to: "/precos", label: "Preços" },
];

export const PublicLayout = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4 md:h-[4.5rem] md:gap-8">
          <Link to="/" className="flex min-w-0 items-center group">
            <BrandLogo className="w-[96px] sm:w-[116px] md:w-[136px]" />
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {nav.map(item => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild size="sm"><Link to="/app">Abrir Contta</Link></Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link to="/login">Entrar</Link></Button>
                <Button asChild size="sm" className="hidden sm:inline-flex"><Link to="/cadastro">Criar conta</Link></Button>
              </>
            )}
            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription className="sr-only">Navegação do site</SheetDescription>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  {nav.map(item => (
                    <SheetClose asChild key={item.to}>
                      <NavLink to={item.to} className={({ isActive }) => `rounded-md px-3 py-2.5 text-sm font-medium ${isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}>
                        {item.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t flex flex-col gap-2">
                  {user ? (
                    <SheetClose asChild>
                      <Button asChild><Link to="/app">Abrir Contta</Link></Button>
                    </SheetClose>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button asChild variant="outline"><Link to="/login">Entrar</Link></Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild><Link to="/cadastro">Criar conta</Link></Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-border/60 bg-card/40">
        <div className="container py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center">
              <BrandLogo className="w-[108px] sm:w-[124px]" />
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">Clareza financeira para empresas brasileiras. Margem, caixa e a próxima ação que faz diferença no resultado — em uma leitura semanal confiável.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Produto</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/produto" className="text-foreground/80 hover:text-foreground transition-colors">Visão geral</Link></li>
              <li><Link to="/como-funciona" className="text-foreground/80 hover:text-foreground transition-colors">Como funciona</Link></li>
              <li><Link to="/contta-ai" className="text-foreground/80 hover:text-foreground transition-colors">Contta AI</Link></li>
              <li><Link to="/precos" className="text-foreground/80 hover:text-foreground transition-colors">Preços</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Empresa</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" className="text-foreground/80 hover:text-foreground transition-colors">Sobre</Link></li>
              <li><Link to="/privacidade" className="text-foreground/80 hover:text-foreground transition-colors">Privacidade</Link></li>
              <li><Link to="/termos" className="text-foreground/80 hover:text-foreground transition-colors">Termos</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60">
          <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Contta. Clareza financeira para empresas brasileiras.</p>
            <span aria-label="Brasil" title="Brasil" className="inline-flex items-center text-base leading-none">🇧🇷</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
