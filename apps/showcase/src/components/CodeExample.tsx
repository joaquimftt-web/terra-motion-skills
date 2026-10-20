import { useEffect, useRef, useState } from 'react';
import { ButtonFeedback } from '@motion-skills-lab/motion-recipes/button-feedback';

export function CodeExample({ code, name }: { code: string; name: string }) {
  const [status, setStatus] = useState('');
  const [copying, setCopying] = useState(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  async function copy() {
    setCopying(true);
    setStatus('');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code);
      if (alive.current) setStatus('Código copiado.');
    } catch {
      if (alive.current) setStatus('Selecione o código para copiar manualmente.');
    } finally {
      if (alive.current) setCopying(false);
    }
  }

  return (
    <div className="code-example">
      <div className="code-example__bar">
        <span>
          EXEMPLO DE USO <span className="code-language">TSX</span>
        </span>
        <ButtonFeedback
          type="button"
          className="copy-button"
          disabled={copying}
          onClick={() => void copy()}
          aria-label={`Copiar exemplo ${name}`}
        >
          {copying ? 'Copiando…' : 'Copiar'}
        </ButtonFeedback>
      </div>
      <pre tabIndex={0} aria-label={`Código ${name}`}>
        <code>{code}</code>
      </pre>
      <p className="copy-status" role="status">
        {status}
      </p>
    </div>
  );
}
