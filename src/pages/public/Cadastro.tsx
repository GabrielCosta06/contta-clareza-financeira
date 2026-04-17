import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services";
import { Check } from "lucide-react";

export default function Cadastro() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", companyName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.password || !form.companyName) {
      setError("Preencha todos os campos para criar a conta."); return;
    }
    setLoading(true);
    try {
      await signup(form);
      authService.setOnboarded(false);
      navigate("/app/onboarding");
    } catch {
      setError("Não foi possível criar sua conta. Tente novamente.");
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-16 grid lg:grid-cols-2 gap-12 max-w-5xl">
      <div className="hidden lg:block">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">Comece sua leitura financeira em minutos.</h1>
        <ul className="mt-8 space-y-3 text-foreground">
          {["Importe extratos ou conecte bancos","Revise os números com confiança","Leia margem e caixa em uma tela","Receba a próxima ação do Contta AI"].map(t => (
            <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {t}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-center lg:text-left mb-6">
          <h2 className="text-2xl font-semibold">Criar conta</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sem cartão. Use por tempo determinado para conhecer.</p>
        </div>
        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-card">
          <div className="space-y-1.5"><Label>Nome completo</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Empresa</Label><Input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="Razão social ou nome fantasia" /></div>
          <div className="space-y-1.5"><Label>E-mail</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Senha</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
          {error && <p className="rounded-md bg-destructive-soft text-destructive text-sm px-3 py-2">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Criando..." : "Criar conta"}</Button>
          <p className="text-center text-sm text-muted-foreground">Já tem conta? <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link></p>
        </form>
      </div>
    </div>
  );
}
