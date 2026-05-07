// Streaming chat for Contta AI via Lovable AI Gateway.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

interface RequestBody {
  messages: ChatMessage[];
  context?: {
    company?: string;
    margin?: { revenue: number; grossMarginPct: number; deltaPct: number };
    cash?: { currentBalance: number; projected30d: number; riskLevel: string };
    review?: { criticalCount: number; pendingCount: number };
  };
}

const SYSTEM_PROMPT = `Você é o Contta AI, assistente financeiro de PMEs brasileiras.
Responda em português, de forma direta, prática e em linguagem acessível ao dono do negócio.
Use markdown leve (negritos, listas curtas). Evite jargão contábil sem explicação.
Quando der uma resposta, estruture em: 1) leitura curta, 2) o que mudou, 3) próximas ações.
Sempre cite premissas e seja honesto sobre incertezas. Use os números do CONTEXTO quando disponíveis.
Quando faltar dado, diga claramente o que falta para a resposta ficar mais confiável.`;

const buildContextMessage = (ctx?: RequestBody["context"]): string | null => {
  if (!ctx) return null;
  const lines: string[] = ["CONTEXTO DA EMPRESA NESTE MOMENTO:"];
  if (ctx.company) lines.push(`- Empresa: ${ctx.company}`);
  if (ctx.margin) {
    lines.push(
      `- Receita do mês: R$ ${ctx.margin.revenue.toLocaleString("pt-BR")}; margem bruta ${ctx.margin.grossMarginPct.toFixed(1)}% (${ctx.margin.deltaPct >= 0 ? "+" : ""}${ctx.margin.deltaPct.toFixed(1)}% vs mês anterior).`,
    );
  }
  if (ctx.cash) {
    lines.push(
      `- Caixa atual: R$ ${ctx.cash.currentBalance.toLocaleString("pt-BR")}; projeção 30d: R$ ${ctx.cash.projected30d.toLocaleString("pt-BR")}; risco: ${ctx.cash.riskLevel}.`,
    );
  }
  if (ctx.review) {
    lines.push(`- Revisão: ${ctx.review.criticalCount} críticos, ${ctx.review.pendingCount} pendentes.`);
  }
  return lines.join("\n");
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as RequestBody;
    if (!body?.messages?.length) {
      return new Response(JSON.stringify({ error: "messages obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY não configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ctxMsg = buildContextMessage(body.context);
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(ctxMsg ? [{ role: "system" as const, content: ctxMsg }] : []),
      ...body.messages,
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream: true,
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Muitas perguntas em pouco tempo. Tente novamente em alguns segundos." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "Sem créditos no workspace. Adicione créditos em Lovable AI para continuar." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!response.ok || !response.body) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "Falha ao contatar o assistente" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (err) {
    console.error("chat-ai error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
