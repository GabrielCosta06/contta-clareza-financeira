import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { alertsRepo, companyRepo } from "@/services";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DemoScenarioBar } from "@/components/DemoScenarioBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppCommandPalette } from "@/components/AppCommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav = [
  { to: "/app/dashboard", label: "Visão geral", icon: LayoutDashboard, end: false, shortcut: "Pressione G e D" },
  { to: "/app/transacoes", label: "Transações", icon: Receipt, end: false, shortcut: "Pressione G e T" },
  { to: "/app/revisao", label: "Revisão", icon: ShieldCheck, end: false, shortcut: "Pressione G e R" },
  { to: "/app/margem", label: "Margem", icon: TrendingUp, end: false, shortcut: "Pressione G e M" },
  { to: "/app/caixa", label: "Caixa", icon: Wallet, end: false, shortcut: "Pressione G e C" },
  { to: "/app/ai", label: "Contta AI", icon: Sparkles, end: false, shortcut: "Pressione G e A" },
  { to: "/app/configuracoes", label: "Configurações", icon: Settings, end: false, shortcut: "Pressione G e S" },
];

const shortcutRoutes: Record<string, string> = {
  d: "/app/dashboard",
  t: "/app/transacoes",
  r: "/app/revisao",
  m: "/app/margem",
  c: "/app/caixa",
  a: "/app/ai",
  s: "/app/configuracoes",
};

const isTypingContext = (eventTarget: EventTarget | null) => {
  if (!(eventTarget instanceof HTMLElement)) return false;
  const tag = eventTarget.tagName.toLowerCase();
  return eventTarget.isContentEditable || tag === "input" || tag === "textarea" || tag === "select";
};

const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
  <>
    {nav.map((item) => {
      const Icon = item.icon;
      return (
        <Tooltip key={item.to}>
          <TooltipTrigger asChild>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">{item.shortcut}</TooltipContent>
        </Tooltip>
      );
    })}
  </>
);

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: company } = useQuery({ queryKey: ["company"], queryFn: () => companyRepo.current() });
  const { data: alerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: () => alertsRepo.list() });
  const critical = alerts.filter((alert) => alert.severity === "critical").length;
  const [mobileOpen, setMobileOpen] = useState(false);
  const shortcutMode = useRef(false);
  const shortcutTimeout = useRef<number | null>(null);

  useEffect(() => {
    const resetShortcutMode = () => {
      shortcutMode.current = false;
      if (shortcutTimeout.current) {
        window.clearTimeout(shortcutTimeout.current);
        shortcutTimeout.current = null;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingContext(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();

      if (shortcutMode.current) {
        const route = shortcutRoutes[key];
        resetShortcutMode();
        if (route) {
          event.preventDefault();
          navigate(route);
        }
        return;
      }

      if (key === "g") {
        shortcutMode.current = true;
        shortcutTimeout.current = window.setTimeout(resetShortcutMode, 1200);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      resetShortcutMode();
    };
  }, [navigate]);

  useEffect(() => {
    if (shortcutTimeout.current) {
      window.clearTimeout(shortcutTimeout.current);
      shortcutTimeout.current = null;
    }
    shortcutMode.current = false;
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full bg-background flex">
      <aside className="hidden w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Link to="/app" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-display text-lg leading-none">
              c
            </div>
            <span className="font-semibold tracking-tight">Contta</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-5">
          <NavItems />
        </nav>
        <div className="border-t border-sidebar-border px-4 py-4 text-xs text-sidebar-foreground/60">
          Plataforma de clareza financeira
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-border bg-card/80 px-3 backdrop-blur md:gap-4 md:px-6">
          <div className="flex min-w-0 items-center gap-1">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu de navegação">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
                <SheetHeader className="h-16 flex-row items-center space-y-0 border-b border-sidebar-border px-5">
                  <Link to="/app" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-display text-lg leading-none">
                      c
                    </div>
                    <SheetTitle className="font-semibold tracking-tight text-sidebar-foreground">Contta</SheetTitle>
                  </Link>
                  <SheetDescription className="sr-only">Navegação principal</SheetDescription>
                </SheetHeader>
                <nav className="space-y-0.5 px-3 py-5">
                  <NavItems onNavigate={() => setMobileOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="min-w-0 gap-2 px-2">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-primary-soft text-primary">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="hidden min-w-0 text-left sm:block">
                    <p className="text-xs leading-none text-muted-foreground">Empresa atual</p>
                    <p className="mt-0.5 max-w-[160px] truncate text-sm font-medium leading-tight">{company?.tradeName ?? "—"}</p>
                  </div>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Empresas</DropdownMenuLabel>
                <DropdownMenuItem className="flex flex-col items-start gap-0.5">
                  <span className="font-medium">{company?.tradeName}</span>
                  <span className="text-xs text-muted-foreground">{company?.cnpj} · {company?.taxRegime}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/configuracoes")}>Gerenciar empresa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1">
            <AppCommandPalette />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" aria-label="Compartilhar leitura semanal">
                  <Link to="/app/compartilhar?print=1">
                    <Share2 className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Compartilhar leitura em PDF</TooltipContent>
            </Tooltip>

            <ThemeToggle />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label={`Alertas${critical ? ` (${critical} críticos)` : ""}`}>
                  <Bell className="h-4 w-4" />
                  {critical > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {critical}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[min(96vw,24rem)] p-0">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold">Alertas e sinais</p>
                  <p className="text-xs text-muted-foreground">Itens que merecem atenção financeira agora.</p>
                </div>
                <div className="max-h-96 overflow-auto">
                  {alerts.length === 0 && (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhum alerta no momento.</p>
                  )}
                  {alerts.map((alert) => (
                    <Link key={alert.id} to={alert.actionHref ?? "#"} className="block border-b px-4 py-3 last:border-b-0 hover:bg-muted/40">
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.severity === "critical" ? "destructive" : alert.severity === "warning" ? "secondary" : "outline"} className="text-[10px]">
                          {alert.severity === "critical" ? "Crítico" : alert.severity === "warning" ? "Atenção" : "Info"}
                        </Badge>
                        <p className="text-sm font-medium">{alert.title}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{alert.message}</p>
                    </Link>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2" aria-label="Menu da conta">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {user?.name?.split(" ").map((name) => name[0]).slice(0, 2).join("")}
                  </div>
                  <div className="hidden text-left lg:block">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="mt-0.5 text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate("/app/configuracoes")}>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-8 md:py-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <DemoScenarioBar />
      </div>
    </div>
  );
};
