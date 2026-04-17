import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription, SheetClose } from "@/components/ui/sheet";
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
        <div className="container flex h-16 items-center justify-between gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-hero text-primary-foreground font-display text-lg leading-none">c</div>
            <span className="font-semibold text-foreground tracking-tight">Contta</span>
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
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-hero text-primary-foreground font-display text-lg leading-none">c</div>
              <span className="font-semibold tracking-tight">Contta</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">Clareza financeira para PMEs brasileiras. Margem, caixa e contexto tributário em uma leitura semanal confiável.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Produto</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/produto" className="text-foreground/80 hover:text-foreground">Visão geral</Link></li>
              <li><Link to="/como-funciona" className="text-foreground/80 hover:text-foreground">Como funciona</Link></li>
              <li><Link to="/contta-ai" className="text-foreground/80 hover:text-foreground">Contta AI</Link></li>
              <li><Link to="/precos" className="text-foreground/80 hover:text-foreground">Preços</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Empresa</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" className="text-foreground/80 hover:text-foreground">Sobre</Link></li>
              <li><Link to="/privacidade" className="text-foreground/80 hover:text-foreground">Privacidade</Link></li>
              <li><Link to="/termos" className="text-foreground/80 hover:text-foreground">Termos</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60">
          <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Contta. Plataforma de clareza financeira para PMEs brasileiras.</p>
            <p>Feito no Brasil 🇧🇷</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
