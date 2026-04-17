import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { DemoScenarioProvider } from "@/hooks/useDemoScenario";
import { RequireAuth } from "@/components/RequireAuth";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppLayout } from "@/layouts/AppLayout";

import Home from "@/pages/public/Home";
import Produto from "@/pages/public/Produto";
import ComoFunciona from "@/pages/public/ComoFunciona";
import ContaAIPublic from "@/pages/public/ContaAI";
import Login from "@/pages/public/Login";
import Cadastro from "@/pages/public/Cadastro";
import Privacidade from "@/pages/public/Privacidade";
import Termos from "@/pages/public/Termos";
import Precos from "@/pages/public/Precos";
import Sobre from "@/pages/public/Sobre";

import Onboarding from "@/pages/app/Onboarding";
import Dashboard from "@/pages/app/Dashboard";
import Transacoes from "@/pages/app/Transacoes";
import TransacaoDetalhe from "@/pages/app/TransacaoDetalhe";
import Revisao from "@/pages/app/Revisao";
import Margem, { MargemLayout } from "@/pages/app/Margem";
import { DRE, Custos, Orcamento, Precificacao } from "@/pages/app/MargemSubpages";
import Caixa, { CaixaLayout, Projecao, Recebiveis, Obrigacoes } from "@/pages/app/Caixa";
import ContaAIApp from "@/pages/app/ContaAI";
import Configuracoes from "@/pages/app/Configuracoes";
import WeeklyReadingExport from "@/pages/app/WeeklyReadingExport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } } });

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <DemoScenarioProvider>
            <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/produto" element={<Produto />} />
              <Route path="/como-funciona" element={<ComoFunciona />} />
              <Route path="/contta-ai" element={<ContaAIPublic />} />
              <Route path="/precos" element={<Precos />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/termos" element={<Termos />} />
            </Route>

            {/* App (auth) */}
            <Route element={<RequireAuth />}>
              <Route path="/app/onboarding" element={<Onboarding />} />
              <Route path="/app/compartilhar" element={<WeeklyReadingExport />} />
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="transacoes" element={<Transacoes />} />
                <Route path="transacoes/:id" element={<TransacaoDetalhe />} />
                <Route path="revisao" element={<Revisao />} />
                <Route path="margem" element={<MargemLayout />}>
                  <Route index element={<Margem />} />
                  <Route path="dre" element={<DRE />} />
                  <Route path="custos" element={<Custos />} />
                  <Route path="orcamento" element={<Orcamento />} />
                  <Route path="precificacao" element={<Precificacao />} />
                </Route>
                <Route path="caixa" element={<CaixaLayout />}>
                  <Route index element={<Caixa />} />
                  <Route path="projecao" element={<Projecao />} />
                  <Route path="recebiveis" element={<Recebiveis />} />
                  <Route path="obrigacoes" element={<Obrigacoes />} />
                </Route>
                <Route path="ai" element={<ContaAIApp />} />
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
            </Routes>
            </DemoScenarioProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
