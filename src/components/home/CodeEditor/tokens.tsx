import type { Token } from './editorFiles';
import styles from './CodeEditor.module.css';

export function TokenSpan({ token }: { token: Token }) {
  const className = [
    styles.tok,
    token.type ? styles[token.type] : null,
    token.bold ? styles.bold : null,
    token.tip ? styles.interactive : null,
  ]
    .filter(Boolean)
    .join(' ');

  if (token.tip) {
    return (
      <span
        className={className}
        data-tip={token.tip}
        aria-label={`${token.text}, ${token.tip}`}
        tabIndex={0}
      >
        {token.text}
      </span>
    );
  }
  return <span className={className}>{token.text}</span>;
}
