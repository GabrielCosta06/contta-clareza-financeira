import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  prompt: string;
  label?: string;
}

export const InlineAIEntryPoint = ({
  prompt,
  label = "Pergunte ao Contta AI sobre esta tela",
}: Props) => (
  <div className="fixed bottom-6 right-4 z-20 md:bottom-8 md:right-8">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild size="lg" className="rounded-full px-4 shadow-elegant">
          <Link to={`/app/ai?prompt=${encodeURIComponent(prompt)}`}>
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">Perguntar ao AI</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  </div>
);
