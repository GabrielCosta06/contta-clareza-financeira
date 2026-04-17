import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { authService } from "@/services";
import { Building2, Upload, Settings2, Check, Sparkles } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const steps = ["Boas-vindas", "Empresa", "Dados", "Pronto"];
  const pct = ((step + 1) / steps.length) * 100;

  const finish = () => { authService.setOnboarded(true); navigate("/app/dashboard"); };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container max-w-2xl py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-primary font-semibold">Configuração inicial — etapa {step + 1} de {steps.length}</p>
          <Progress value={pct} className="mt-3 h-1.5" />
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-card">
          {step === 0 && (
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary"><Sparkles className="h-6 w-6" /></div>
              <h1 className="mt-5 text-2xl font-semibold">Bem-vinda ao Contta.</h1>
              <p className="mt-3 text-muted-foreground">Em poucos passos, você terá sua primeira leitura financeira semanal. Vamos juntos.</p>
              <Button onClick={() => setStep(1)} size="lg" className="mt-7">Começar</Button>
            </div>
          )}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary"><Building2 className="h-5 w-5" /></div>
                <div><h2 className="text-xl font-semibold">Sua empresa</h2><p className="text-sm text-muted-foreground">Confirme os dados básicos.</p></div>
              </div>
              <div className="space-y-4">
                <div><Label>Nome fantasia</Label><Input defaultValue="Padaria & Café Estrela" /></div>
                <div><Label>CNPJ</Label><Input defaultValue="12.345.678/0001-90" /></div>
                <div><Label>Regime tributário</Label><Input defaultValue="Simples Nacional" /></div>
              </div>
              <div className="mt-6 flex justify-end gap-2"><Button variant="ghost" onClick={() => setStep(0)}>Voltar</Button><Button onClick={() => setStep(2)}>Continuar</Button></div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary"><Upload className="h-5 w-5" /></div>
                <div><h2 className="text-xl font-semibold">Conectar dados</h2><p className="text-sm text-muted-foreground">Você pode começar de qualquer ponto. Refinamos depois.</p></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {["Conectar banco","Importar CSV","Conectar maquininha","Começar manualmente"].map(opt => (
                  <button key={opt} className="rounded-lg border border-border p-4 text-left hover:border-primary hover:bg-primary-soft/30 transition-colors">
                    <p className="font-medium text-sm">{opt}</p><p className="text-xs text-muted-foreground mt-1">Disponível na demonstração</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-2"><Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button><Button onClick={() => setStep(3)}>Pular por agora</Button></div>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success"><Check className="h-6 w-6" /></div>
              <h2 className="mt-5 text-2xl font-semibold">Tudo pronto.</h2>
              <p className="mt-3 text-muted-foreground">Já carregamos uma leitura demo para você navegar. Quando conectar dados reais, esta tela vira a sua.</p>
              <Button onClick={finish} size="lg" className="mt-7">Abrir minha visão geral</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
