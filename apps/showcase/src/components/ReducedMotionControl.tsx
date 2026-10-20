export function ReducedMotionControl({
  reduced,
  systemReduced,
  onChange,
}: {
  reduced: boolean;
  systemReduced: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="motion-preference">
      <label className="switch-label">
        <input
          type="checkbox"
          checked={reduced}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
        <span className="switch-track" aria-hidden="true" />
        <span>Reduzir movimento nas demonstrações</span>
      </label>
      <p role="status">
        {systemReduced
          ? 'Sistema: movimento reduzido. Sua preferência tem prioridade.'
          : reduced
            ? 'Demonstrações com movimento reduzido.'
            : 'Sistema: sem preferência por redução.'}
      </p>
    </div>
  );
}
