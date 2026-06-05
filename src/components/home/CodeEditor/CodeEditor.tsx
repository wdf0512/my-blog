'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Files,
  Search,
  GitBranch,
  Play,
  Blocks,
  ChevronDown,
  FileCode2,
  X,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { aboutFile, beliefsFile, type EditorFile } from './editorFiles';
import { TokenSpan } from './tokens';
import { useReveal } from './useReveal';
import styles from './CodeEditor.module.css';

const FILES: EditorFile[] = [aboutFile, beliefsFile];

type Mode = 'hidden' | 'instant' | 'animate';

function CodeReveal({
  file,
  mode,
  index,
  markSeen,
}: {
  file: EditorFile;
  mode: Mode;
  index: number;
  markSeen: (i: number) => void;
}) {
  const total = file.lines.length;
  const [revealed, setRevealed] = useState(mode === 'animate' ? 0 : mode === 'hidden' ? 0 : total);

  useEffect(() => {
    if (mode === 'instant') {
      setRevealed(total);
      markSeen(index);
      return;
    }
    if (mode === 'hidden') {
      setRevealed(0);
      return;
    }
    // animate
    if (revealed >= total) {
      markSeen(index);
      return;
    }
    const id = setTimeout(() => setRevealed((r) => r + 1), 70);
    return () => clearTimeout(id);
  }, [mode, revealed, total, index, markSeen]);

  return (
    <div className={styles.code}>
      {file.lines.map((line, i) => {
        const shown = i < revealed;
        const isCaretLine = i === revealed - 1;
        return (
          <div className={`${styles.line} ${shown ? styles.shown : ''}`} key={i}>
            <span className={styles.gutter} aria-hidden="true">
              {i + 1}
            </span>
            <span className={styles.lineContent}>
              {line.map((tk, j) => (
                <TokenSpan key={j} token={tk} />
              ))}
              {isCaretLine && <span className={styles.caret} aria-hidden="true" />}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CodeEditor() {
  const { ref, inView, reduced } = useReveal();
  const [active, setActive] = useState(0);
  const seen = useRef<Set<number>>(new Set());
  const markSeen = useCallback((i: number) => {
    seen.current.add(i);
  }, []);

  const mode: Mode = reduced
    ? 'instant'
    : !inView
      ? 'hidden'
      : seen.current.has(active)
        ? 'instant'
        : 'animate';

  const file = FILES[active];

  return (
    <div ref={ref} className={styles.shell}>
      <div className={styles.editor} aria-label="Code editor showing about and beliefs">
        {/* Title bar */}
        <div className={styles.titlebar}>
          <div className={styles.lights} aria-hidden="true">
            <span className={`${styles.light} ${styles.close}`} />
            <span className={`${styles.light} ${styles.min}`} />
            <span className={`${styles.light} ${styles.max}`} />
          </div>
          <span className={styles.title}>defang — portfolio</span>
          <span className={styles.titleRight} aria-hidden="true" />
        </div>

        {/* Activity bar */}
        <div className={styles.activity} aria-hidden="true">
          <Files className={`${styles.actIcon} ${styles.actActive}`} />
          <Search className={styles.actIcon} />
          <GitBranch className={styles.actIcon} />
          <Play className={styles.actIcon} />
          <Blocks className={styles.actIcon} />
        </div>

        {/* Explorer */}
        <div className={styles.explorer}>
          <div className={styles.explorerTitle}>Explorer</div>
          <div className={styles.folder}>
            <ChevronDown className={styles.folderChevron} aria-hidden="true" />
            <span>portfolio</span>
          </div>
          <ul className={styles.tree}>
            {FILES.map((f, i) => (
              <li key={f.name}>
                <button
                  type="button"
                  className={`${styles.treeItem} ${i === active ? styles.treeActive : ''}`}
                  onClick={() => setActive(i)}
                >
                  <FileCode2 className={styles.fileIcon} aria-hidden="true" />
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main: tabs + code */}
        <div className={styles.main}>
          <div className={styles.tabs} role="tablist" aria-label="Open files">
            {FILES.map((f, i) => (
              <button
                key={f.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
                onClick={() => setActive(i)}
              >
                <FileCode2 className={styles.tabIcon} aria-hidden="true" />
                <span>{f.name}</span>
                {i === active && <X className={styles.tabClose} aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className={styles.codeScroll}>
            <CodeReveal file={file} mode={mode} index={active} markSeen={markSeen} key={active} />
          </div>
        </div>

        {/* Status bar */}
        <div className={styles.statusbar} aria-hidden="true">
          <span className={styles.statusItem}>
            <GitBranch className={styles.statusIcon} /> main*
          </span>
          <span className={styles.statusItem}>
            <XCircle className={styles.statusIcon} /> 0
          </span>
          <span className={styles.statusItem}>
            <AlertTriangle className={styles.statusIcon} /> 0
          </span>
          <span className={styles.statusGap} />
          <span className={styles.statusItem}>TypeScript</span>
          <span className={styles.statusItem}>UTF-8</span>
          <span className={styles.statusItem}>LF</span>
          <span className={styles.statusItem}>Ln {file.lines.length}, Col 1</span>
        </div>
      </div>
    </div>
  );
}
