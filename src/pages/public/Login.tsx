import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { toast } = useToast();
  const [email, setEmail] = useState("nati@estrelacafe.com.br");
  const [password, setPassword] = useState("contta2024");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Informe e-mail e senha."); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Bem-vinda de volta!", description: "Sessão iniciada com sucesso." });
      navigate(location.state?.from?.pathname ?? "/app");
    } catch {
      setError("Credenciais inválidas. Verifique e tente novamente.");
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-16 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Entrar no Contta</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sua leitura financeira semanal te espera.</p>
      </div>
      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-card">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@empresa.com.br" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <Label htmlFor="password">Senha</Label>
            <button type="button" className="text-xs text-primary hover:underline">Esqueci minha senha</button>
          </div>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <p className="rounded-md bg-destructive-soft text-destructive text-sm px-3 py-2">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Entrando..." : "Entrar"}</Button>
        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem conta? <Link to="/cadastro" className="text-primary font-medium hover:underline">Criar conta</Link>
        </p>
      </form>
      <p className="mt-4 text-center text-xs text-muted-foreground">Demonstração: qualquer e-mail e senha válidos entram na conta de exemplo.</p>
    </div>
  );
}
