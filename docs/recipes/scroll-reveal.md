# Scroll Reveal — M06 / L2 no candidato da PR #1

**Código disponível na branch pública integration/landing-v4-horizontal da PR #1; ainda fora da main/Pages/npm.** Este subpath não pertence à Release/tag histórica v0.1.0. O candidato inclui oito recipes, três skills e 13 subpaths, com demos L2 no laboratório e consumo na landing. A branch R1 original permanece separada.

## Consumo

```tsx
import { useRef, useState } from 'react';
import { ScrollReveal } from '@motion-skills-lab/motion-recipes/scroll-reveal';

export function DeliverySummary() {
  const root = useRef<HTMLDivElement>(null);
  const [replay, setReplay] = useState(0);
  return (
    <section aria-labelledby="delivery-title">
      <button type="button" onClick={() => setReplay((value) => value + 1)}>
        Repetir apresentação
      </button>
      <ScrollReveal ref={root} replayKey={replay}>
        <h2 id="delivery-title">Prazos de entrega</h2>
        <p>Consulte as condições antes de confirmar seu pedido.</p>
        <a href="/delivery">Ver condições</a>
      </ScrollReveal>
    </section>
  );
}
```

O consumidor resolve suas rotas e estilos. Não é necessário importar CSS de recipe, tokens CSS ou showcase. Usar React/React DOM/Motion compatíveis com os peers do workspace. A fixture de consumo testa os arquivos compilados e declarações públicas, sem aliases de fontes.

## API implementada

`ScrollRevealProps` preserva `HTMLAttributes<HTMLDivElement>`, exceto children/dangerouslySetInnerHTML, e recebe children obrigatório e ref nativa opcional de div. Props e handlers nativos pertencem à raiz externa; o div interno é privado e controla somente transform. A tipagem de refs segue a compatibilidade estrutural nativa de React/TypeScript, não nominalidade por tag HTML.

| Prop         | Default   | Contrato                                                 |
| ------------ | --------- | -------------------------------------------------------- |
| duration     | 260       | ms finitos, ≥ 0                                          |
| offset       | 8         | px finitos, 0–24                                         |
| once         | true      | Limita entradas automáticas por geração                  |
| replayKey    | undefined | String/número finito; mudança por Object.is cria geração |
| reduceMotion | false     | Força redução quando true; false nunca ignora o sistema  |

Números inválidos lançam RangeError. Duration ou offset zero concluem imediatamente. Easing fixo `[0.2, 0, 0, 1]`, do token já existente. Sem as/asChild, fade, delay, cor, variantes ou API de controlador. Os subpaths Button/Accordion e seus contratos permanecem iguais.

## Entrada e replay

- HTML inicial/SSR completo e legível, sem transform de entrada. Conteúdo inicialmente visível fica estático.
- Preparação somente com conteúdo de fluxo normal comprovadamente abaixo da viewport, margem interna de 24 px e dimensões positivas. Offset é aplicado fora da tela; na entrada, apenas retorna a zero. Não se introduz offset tardiamente.
- Geometria incerta, clipping de contêiner, transformações externas, pseudo-elementos gerados ou superfícies com sombras/filtros podem resultar em fallback estático conservador. O clipping interno de controles nativos é tratado como superfície limitada. Não usar para overlays/fixed, tabelas ou animações de carregamento.
- Um alvo de IntersectionObserver por raiz. Durante preparação, ResizeObserver da raiz e MutationObserver da subárvore invalidam alterações locais; os estilos/geometria são revalidados na entrada. Não existe leitura de layout ou estado React por frame.
- `once=false` só reapresenta quando uma nova preparação abaixo da viewport é segura. Scroll inverso pelo topo pode ficar estático.
- Depois de uma saída real, um listener de `scrollend` permite revalidar `once=false` quando um salto de rolagem passa de fora acima para fora abaixo sem nova mudança de interseção. É uma medição ao fim da rolagem, não por frame; listener removido ao mudar para once/unmount. Em navegadores sem esse evento, esse caso pode permanecer estático, sem fallback de polling.
- Replay visível: posição corrente → offset → zero, em 25% + 75% de duration. Não remonta filhos nem zera antes de reiniciar. A nova geração cancela a anterior; callbacks de animação e observação antigos não podem retomar.
- No replay fora da viewport, aplica-se a mesma exigência de preparação segura.

## Foco, interação, redução e falha

Foco/pointerdown concluem antes do handler nativo do consumidor; todos os controles permanecem visíveis e utilizáveis. A guarda de gesto acompanha somente os pointerIds iniciados na raiz. Release de outro ponteiro não libera o gesto; blur/cancelamento/desmontagem limpam o registro.

Redução efetiva é prop OU sistema. Preferência indisponível/desconhecida permanece estática; ativá-la encerra o movimento imediatamente. Desativá-la não reproduz a entrada retroativamente. Foco dentro ou gesto ativo bloqueiam replay animado.

SSR não lê window/document no render. Hidratação preserva markup; sem JS, o HTML fornecido pelo consumidor SSR permanece legível. Isso não adiciona SSR à SPA Vite nem promete compatibilidade RSC automática: use uma fronteira cliente no framework consumidor quando necessário.

Ausência/erro de observer, matchMedia ou animação mantém estado final seguro. A animação usa `motion/mini`, da dependência Motion já existente, para transformar somente o wrapper privado. Não há dependência extra. Cleanup cancela execução, invalida gerações, limpa transform/listeners/observers e preserva refs/StrictMode.

Ao interromper por foco/redução, restaurar o final imediatamente pode corrigir a posição restante de até offset px. Essa prioridade acessível é deliberada; não se promete outra animação suave depois de uma solicitação para parar. Não animar opacity para esconder essa correção.

## Testes e limites

Com as dependências do workspace já disponíveis:

```sh
pnpm test
pnpm check:boundaries
pnpm check:consumer
pnpm test:e2e:recipes
```

O último comando compila pacotes, verifica os tipos do harness e inicia/encerra seu servidor isolado para Playwright. Para inspecionar a fixture manualmente depois de `pnpm build:packages`, executar `pnpm exec vite --config packages/motion-recipes/e2e/fixture/vite.config.ts` e abrir `http://127.0.0.1:4175/`. Ela é exclusivamente de teste e não é publicada pelo build do showcase. A verificação especial de zoom nativo foi uma execução separada, registrada nas evidências; a suíte comum não simula esse resultado.

Testes unitários separam a política com doubles da prova real em Chromium. A fixture E2E é independente do showcase, com entrada, replay, teclado/ponteiro/toque emulado, redução ao vivo, falha de animação, responsividade, SSR/hidratação e axe. Resultados/evidências do lote constam de [VALIDATION.md](../VALIDATION.md).

Geometria/pintura arbitrárias não são inferidas universalmente: em dúvida, estado estático. Capturas finais não provam ausência de saltos; o teste registra amostras de transform por requestAnimationFrame e vídeo real. Isso não é benchmark de FPS nem certificação de acessibilidade. Zoom real 200%, outros navegadores, leitores de tela e dispositivos físicos só devem ser apresentados como validados se houver evidência específica.

## Histórico — adaptação seletiva ao L2 em 22/10/2026

Contrato público preservado, default260ms/8px. Branch R1 original permanece intacta em3b1a494. Esta cópia parte do checkpoint L1 a6a1292; não é merge da infraestrutura antiga. O lifecycle privado foi compartilhado com M07 após necessidade real de cancelamento/preparação comum;33testes R1 e15E2E anteriores permanecem. Nenhuma API de fade/root/amount adicionada. Duas skills anteriores preservadas; nova [scroll-motion](../../skills/scroll-motion/SKILL.md) ensina composição e limites. Naquela etapa a adaptação era exclusivamente local; agora integra o candidato público da PR #1, ainda fora da main/Pages/npm. Resultados atuais/limitações em [VALIDATION](../VALIDATION.md).

## Estado de validação do candidato

CI Ubuntu do SHA original 38b6fbbb aprovada na [execução 39874614276](https://github.com/joaquimftt-web/terra-motion-skills/actions/runs/39874614276), deploy skipped. Resultados pertencem àquele SHA; alterações documentais posteriores ainda requerem revalidação Ubuntu. Outros navegadores, leitores de tela e dispositivos físicos continuam sem validação específica.
