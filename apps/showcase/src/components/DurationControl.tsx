import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';

/** Showcase-only experiment control; never part of a recipe's public API. */
export function DurationControl({
  id,
  label,
  value,
  defaultValue,
  onChange,
  reduceMotion,
}: {
  id: string;
  label: string;
  value: number;
  defaultValue: number;
  onChange: (duration: number) => void;
  reduceMotion: boolean;
}) {
  return (
    <div className="duration-control">
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id} aria-live="off">
        {value} ms
      </output>
      <input
        id={id}
        type="range"
        min="0"
        max="800"
        step="10"
        value={value}
        aria-valuetext={`${value} milissegundos`}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
      />
      <ButtonFeedback
        type="button"
        className="duration-reset"
        reduceMotion={reduceMotion}
        onClick={() => onChange(defaultValue)}
      >
        Restaurar padrão ({defaultValue} ms)
      </ButtonFeedback>
      {reduceMotion && (
        <p className="duration-reduced">Movimento reduzido: duração efetiva de 0 ms.</p>
      )}
    </div>
  );
}
