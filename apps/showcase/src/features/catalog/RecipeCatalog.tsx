export function RecipeCatalog() {
  return (
    <nav aria-label="Receitas" className="recipe-nav">
      <span className="eyebrow">EXPLORAR O LAB</span>
      <a className="overview-link" href="#visao-geral">
        <span aria-hidden="true">⌘</span> Visão geral
      </a>
      <span className="nav-caption">RECEITAS / 02</span>
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
      <span className="nav-caption">CRITÉRIOS</span>
      <a href="#fundamentos">
        <span aria-hidden="true">◎</span> Fundamentos
      </a>
    </nav>
  );
}
