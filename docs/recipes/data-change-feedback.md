# M11 — Data Change Feedback

`DataChangeFeedback` exibe o valor atual imediatamente e destaca uma alteração real com um indicador neutro. A recipe não interpreta números, interpola valores nem aplica regras financeiras.

```tsx
import { DataChangeFeedback } from '@motion-skills-lab/motion-recipes/data-change-feedback';

<DataChangeFeedback
  value={quantity}
  formatValue={(value) => `${value} unidades`}
  changeLabel="Quantidade atualizada"
  announcement="off"
/>;
```

## API

| Propriedade    | Tipo                                          | Padrão             |
| -------------- | --------------------------------------------- | ------------------ |
| `value`        | `string \| number`                            | obrigatório        |
| `formatValue`  | `(value: string \| number) => string`         | `String(value)`    |
| `duration`     | `number`, milissegundos finitos não negativos | `220`              |
| `reduceMotion` | `boolean`                                     | `false`            |
| `changeLabel`  | `string`                                      | `Valor atualizado` |
| `announcement` | `'off' \| 'polite'`                           | `'off'`            |
| `ref`          | `Ref<HTMLSpanElement>`                        | —                  |

Os atributos nativos pertencem ao `span` externo, incluindo handlers, classe, estilo e foco. `children`, `dangerouslySetInnerHTML`, `role` e `aria-live` não fazem parte da API. O consumidor controla `value` e fornece um formatter determinístico para SSR. A duração inválida gera `RangeError`; zero encerra imediatamente, sem animação.

## Comportamento

A primeira montagem é estática, sem rótulo de alteração. `Object.is` distingue alterações reais de renders incidentais: `NaN` continua igual a `NaN`, enquanto `0` e `-0` são valores diferentes. Alterar apenas `formatValue` atualiza o texto e não dispara o indicador nem cria o rótulo. Após a primeira alteração, o rótulo permanece visível, inclusive com reduced motion.

Somente o indicador vazio com borda `currentColor` anima sua opacidade. O texto não recebe transform, tween, atraso ou transição de opacidade. Atualizações sucessivas cancelam a decoração anterior; mudanças de duração ou reduced motion encerram a decoração sem replay. A preferência do sistema prevalece sobre `reduceMotion=false`; `reduceMotion=true` sempre desativa a animação. Sem suporte de animação, valor e rótulo continuam disponíveis.

`announcement="off"` não cria role nem live region. `polite` aplica `aria-live="polite"` e `aria-atomic` ao único span que contém o valor visível; o rótulo fica fora da região. Não há cópias antigas ou valores escondidos. Renders com o mesmo valor e mudanças de duração não reescrevem o texto da região. Como o texto visível é a própria região, uma alteração textual causada pelo formatter também pode ser anunciada pelo leitor de tela; ela continua sem disparar a decoração ou contar como alteração de dados. A política padrão `off` permite que o consumidor centralize anúncios em outra região.

A recipe não cria conteúdo focável. Se o consumidor fornecer `tabIndex`, o mesmo nó externo é preservado entre atualizações. SSR e hidratação inicial produzem o mesmo conteúdo estático. Não é necessário importar CSS.

## Limites de validação

Os testes de unidade executam React e Motion reais; jsdom substitui somente a fronteira nativa WAAPI e `matchMedia`. Eles não demonstram percepção visual, precisão temporal do navegador ou comportamento real de leitores de tela. As verificações de navegador e do pacote público pertencem à integração L3.
