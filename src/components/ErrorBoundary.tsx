import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] grid place-items-center px-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-destructive-soft text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-semibold">Algo deu errado nesta tela.</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {this.state.error?.message ?? "Ocorreu um erro inesperado ao carregar este conteúdo."}
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Recarregar página</Button>
              <Button size="sm" onClick={this.reset}>Tentar novamente</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
