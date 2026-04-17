import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, ShieldCheck, TrendingUp, Wallet,
  Sparkles, Settings, Receipt, Bell, Building2, ChevronDown, LogOut, Menu
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { alertsRepo, companyRepo } from "@/services";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DemoScenarioBar } from "@/components/DemoScenarioBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const nav = [
  { to: "/app/dashboard", label: "Visão geral", icon: LayoutDashboard, end: false },
  { to: "/app/transacoes", label: "Transações", icon: Receipt, end: false },
  { to: "/app/revisao",    label: "Revisão",     icon: ShieldCheck, end: false },
  { to: "/app/margem",     label: "Margem",      icon: TrendingUp, end: false },
  { to: "/app/caixa",      label: "Caixa",       icon: Wallet, end: false },
  { to: "/app/ai",         label: "Contta AI",   icon: Sparkles, end: false },
  { to: "/app/configuracoes", label: "Configurações", icon: Settings, end: false },
];

const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
  <>
    {nav.map(item => {
      const Icon = item.icon;
      return (
        <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate}
          className={({ isActive }) => cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}>
          <Icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      );
    })}
  </>
);

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const nav_ = useNavigate();
  const { data: company } = useQuery({ queryKey: ["company"], queryFn: () => companyRepo.current() });
  const { data: alerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: () => alertsRepo.list() });
  const critical = alerts.filter(a => a.severity === "critical").length;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center px-5 border-b border-sidebar-border">
          <Link to="/app" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-display text-lg leading-none">c</div>
            <span className="font-semibold tracking-tight">Contta</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          <NavItems />
        </nav>
        <div className="px-4 py-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
          Plataforma de clareza financeira
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/80 backdrop-blur flex items-center justify-between px-3 md:px-6 gap-2 md:gap-4">
          <div className="flex items-center gap-1 min-w-0">
            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu de navegação">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border">
                <SheetHeader className="h-16 px-5 border-b border-sidebar-border flex-row items-center space-y-0">
                  <Link to="/app" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-display text-lg leading-none">c</div>
                    <SheetTitle className="font-semibold tracking-tight text-sidebar-foreground">Contta</SheetTitle>
                  </Link>
                  <SheetDescription className="sr-only">Navegação principal</SheetDescription>
                </SheetHeader>
                <nav className="px-3 py-5 space-y-0.5">
                  <NavItems onNavigate={() => setMobileOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 min-w-0">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-primary-soft text-primary"><Building2 className="h-3.5 w-3.5" /></div>
                  <div className="text-left hidden sm:block min-w-0">
                    <p className="text-xs text-muted-foreground leading-none">Empresa atual</p>
                    <p className="text-sm font-medium leading-tight mt-0.5 truncate max-w-[160px]">{company?.tradeName ?? "—"}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Empresas</DropdownMenuLabel>
                <DropdownMenuItem className="flex flex-col items-start gap-0.5">
                  <span className="font-medium">{company?.tradeName}</span>
                  <span className="text-xs text-muted-foreground">{company?.cnpj} · {company?.taxRegime}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav_("/app/configuracoes")}>Gerenciar empresa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label={`Alertas${critical ? ` (${critical} críticos)` : ""}`}>
                  <Bell className="h-4 w-4" />
                  {critical > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground grid place-items-center">{critical}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[min(96vw,24rem)] p-0">
                <div className="border-b px-4 py-3">
                  <p className="font-semibold text-sm">Alertas e sinais</p>
                  <p className="text-xs text-muted-foreground">Itens que merecem atenção financeira agora.</p>
                </div>
                <div className="max-h-96 overflow-auto">
                  {alerts.length === 0 && (
                    <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nenhum alerta no momento.</p>
                  )}
                  {alerts.map(a => (
                    <Link key={a.id} to={a.actionHref ?? "#"} className="block px-4 py-3 border-b last:border-b-0 hover:bg-muted/40">
                      <div className="flex items-center gap-2">
                        <Badge variant={a.severity === "critical" ? "destructive" : a.severity === "warning" ? "secondary" : "outline"} className="text-[10px]">
                          {a.severity === "critical" ? "Crítico" : a.severity === "warning" ? "Atenção" : "Info"}
                        </Badge>
                        <p className="text-sm font-medium">{a.title}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{a.message}</p>
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2" aria-label="Menu da conta">
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-semibold">
                    {user?.name?.split(" ").map(n => n[0]).slice(0,2).join("")}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs text-muted-foreground leading-none mt-0.5">{user?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => nav_("/app/configuracoes")}>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await logout(); nav_("/"); }} className="text-destructive">
                  <LogOut className="h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-[1400px] w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <DemoScenarioBar />
      </div>
    </div>
  );
};
