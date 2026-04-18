import { useDemoScenario, SCENARIO_LABELS, SCENARIO_DESCRIPTIONS, type DemoScenario } from "@/hooks/useDemoScenario";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlaskConical } from "lucide-react";

const order: DemoScenario[] = ["reliable", "partial", "empty", "critical"];

export const DemoScenarioBar = () => {
  const { scenario, setScenario } = useDemoScenario();
  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 md:px-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Cenário de demonstração</span>
          <span className="sm:hidden">Demo</span>
        </div>
        <Select value={scenario} onValueChange={(v) => setScenario(v as DemoScenario)}>
          <SelectTrigger className="h-8 w-full max-w-[14rem] text-xs sm:w-48" aria-label="Selecionar cenário de demonstração">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {order.map(s => (
              <SelectItem key={s} value={s} className="text-xs">
                <div className="flex flex-col">
                  <span className="font-medium">{SCENARIO_LABELS[s]}</span>
                  <span className="text-[10px] text-muted-foreground">{SCENARIO_DESCRIPTIONS[s]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="hidden flex-1 min-w-0 truncate text-xs text-muted-foreground lg:block">
          {SCENARIO_DESCRIPTIONS[scenario]}
        </p>
      </div>
    </div>
  );
};
