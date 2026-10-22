export function RecipeCatalog() {
  return (
    <nav aria-label="Receitas" className="recipe-nav">
      <span className="eyebrow">EXPLORAR O LAB</span>
      <a className="overview-link" href="#visao-geral">
        <span aria-hidden="true">⌘</span> Visão geral
      </a>
      <span className="nav-caption">RECEITAS / 08</span>
      <a href="#button-feedback">
        <span className="nav-index">01</span>
        <span>Button Feedback</span>
        <span className="nav-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      <a href="#accordion-transition">
        <span className="nav-index">02</span>
        <span>Accordion Transition</span>
        <span className="nav-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      <a href="#presence-transition">
        <span className="nav-index">03</span>
        <span>Presence Transition</span>
        <span className="nav-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      <a href="#async-state-feedback">
        <span className="nav-index">04</span>
        <span>Async State Feedback</span>
        <span className="nav-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      <a href="#navigation-indicator">
        <span className="nav-index">05</span>
        <span>Navigation Indicator</span>
        <span className="nav-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      {(['scroll-reveal', 'staggered-entrance', 'scroll-progress'] as const).map((id, index) => (
        <a key={id} href={'#' + id}>
          <span className="nav-index">0{index + 6}</span>
          <span>{['Scroll Reveal', 'Staggered Entrance', 'Scroll Progress'][index]}</span>
          <span className="nav-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      ))}
      <span className="nav-caption">CRITÉRIOS</span>
      <a href="#fundamentos">
        <span aria-hidden="true">◎</span> Fundamentos
      </a>
    </nav>
  );
}
