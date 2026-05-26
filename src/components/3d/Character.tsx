'use client';

import { useEffect, useRef } from 'react';

// 原始 ASCII 香蕉 — 保留不动
const ORIGINAL_ASCII = `
                                                                                                                    .:-=+-.
                                                                                                                  .+%%%###%%-
                                                                                                                .*%##%%%%##=
                                                                                                                .##+###+-+*.
                                                                                                                .+#=:=+--#=
                                                                                                                .+#*:-+=-#-
                                                                                                                :#+*--+=-*=
                                                                                                                .*++*-:+=-=#.
                                                                                                              =#=-*+::+=--+*.
                                                        .--.                                                 :*+-:+*-::+=---=#:
                                                      -*%%%+**+-.                                          :*+-::+#-:::+=----=#-
                                                    -*%%%=:::-=+*+-.                                   .-**-:::+#=::::+=-----=#:
                                                    :**=-*+::::::-=**+:                              :+*+-:::-*#=::::-+=------++
                                                      -*---=+=::::::::-+**+-.                     .-+*+=-::::=#%=:::::=+-------=*:
                                                      +*----=+=-:::::::::-=+**+=-:..     ..:-=+**+=-::::::=+*#-::::::++--------*-
                                                      .*+-----=++-::::::::::::--=++*******++==-:::::::::-++**-::::::=+---------*=
                                                        .*+-------++=-::::::::::::::::::::::::::::::::-=+=+#+-::::::-+=---------*-
                                                        .**---------+++=-:::::::::::::::::::::::::-=++==**-:::::::-++---------=*.
                                                          =#=----------=+++=--:::::::::::::::-==+++--=**=::::::::-++----------*+
                                                            :+*--------------=+++++++++++++++++=----+*+-:::::::::-+=----------=*.
                                                            .:**=------------------------------=+**=-::::::::::=*=-----------#-
                                                      .=#%**++=+##+=----------------------==+**+-::::::::::::-*+------------#=
                                                      .*%#%+::::-==++**#***+++++==++++*****+=-::::::::::::::-++-------------#=
                                                      =#%%#+--:::::::::::::::--------::::::::::::::::::::-=*+-------------=#=
                                                      -##*--=*+=-:::::::::::::::::::::::::::::::::::::-=++=--------------=#:
                                                      -*=------+*+=--::::::::::::::::::::::::::::--=**=----------------*+.
                                                        :#=---------=+*+=----::::::::::::::----+**+-------------------=*-.
                                                        .*+---------------=+*****+++++****+=-----------------------=*+.
                                                          =#=----------------------------------------------------=*+:
                                                            .**=------------------------------------------------+#+.
                                                              .+*=-------------------------------------------=##:
                                                                .-**=-------------------------------------+#*:
                                                                    :*%*=----------------------------=*##=.
                                                                        .-*###+=--------------=+#%%*=.
                                                                            ...:-==++++++==-:...

`;

/**
 * 性能优化后的 ASCII 香蕉。
 *
 * 关键改动:
 * 1. 字符 DOM 节点只在 mount 时构建一次,之后只切换 `className`(GPU 友好,无 reflow)。
 * 2. 用三层 CSS class(dim / glow / core)管理颜色 + text-shadow,而不是每帧内联 style。
 * 3. 节流到 ~30fps(光带扫描视觉上够),把 rAF 主线程占用对半减。
 * 4. IntersectionObserver: 元素移出视口立即停止动画,滚走后 0 CPU。
 * 5. document.hidden(切 tab)也停止。
 * 6. respect prefers-reduced-motion: 直接渲染静态发光态,不跑动画。
 */
export function Character() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    // 把 ~500 个节点的初次构建挪到 idle 时段,避免首屏 hydration 抢占主线程。
    type IdleHandle = number;
    const schedule: (cb: () => void) => IdleHandle =
      typeof (window as unknown as { requestIdleCallback?: (cb: IdleRequestCallback) => number })
        .requestIdleCallback === 'function'
        ? (cb) =>
            (window as unknown as { requestIdleCallback: (cb: IdleRequestCallback) => number })
              .requestIdleCallback(() => cb())
        : (cb) => window.setTimeout(cb, 50);
    const cancel: (h: IdleHandle) => void =
      typeof (window as unknown as { cancelIdleCallback?: (h: number) => void })
        .cancelIdleCallback === 'function'
        ? (h) =>
            (window as unknown as { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(h)
        : (h) => window.clearTimeout(h);

    let idleHandle: IdleHandle | null = null;
    let io: IntersectionObserver | null = null;
    let onVis: (() => void) | null = null;
    let rafId = 0;
    let running = false;

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };

    idleHandle = schedule(() => {
      idleHandle = null;
      const lines = ORIGINAL_ASCII.split('\n');

      // —— 一次性构建 DOM:每个非空字符一个 <span>,空格保持纯文本节省节点 ——
      type Cell = { el: HTMLSpanElement; x: number; y: number; current: 0 | 1 | 2 };
      const cells: Cell[] = [];
      const frag = document.createDocumentFragment();

      lines.forEach((line, y) => {
        for (let x = 0; x < line.length; x++) {
          const ch = line[x];
          if (ch === ' ') {
            frag.appendChild(document.createTextNode(' '));
            continue;
          }
          const span = document.createElement('span');
          span.textContent = ch;
          span.className = 'banana-dim';
          frag.appendChild(span);
          cells.push({ el: span, x, y, current: 0 });
        }
        if (y < lines.length - 1) frag.appendChild(document.createTextNode('\n'));
      });

      pre.replaceChildren(frag);

      // —— prefers-reduced-motion:静态呈现,不跑动画 ——
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        cells.forEach((c) => (c.el.className = 'banana-glow'));
        return;
      }

      // —— 节流到 ~30fps ——
      const FRAME_INTERVAL = 33; // ms
      let last = 0;
      let time = 0;

      const tick = (now: number) => {
        if (!running) return;
        if (now - last >= FRAME_INTERVAL) {
          last = now;
          time += 1;

          // 单束对角线扫描波(逻辑沿用)
          const cycle = ((time * 0.6) * 18) % 300 - 50;

          for (let i = 0; i < cells.length; i++) {
            const c = cells[i];
            const dist = Math.abs(c.x + c.y * 1.5 - cycle);
            const next: 0 | 1 | 2 = dist < 4 ? 2 : dist < 12 ? 1 : 0;
            if (next !== c.current) {
              c.el.className =
                next === 2 ? 'banana-core' : next === 1 ? 'banana-glow' : 'banana-dim';
              c.current = next;
            }
          }
        }
        rafId = requestAnimationFrame(tick);
      };

      const start = () => {
        if (running) return;
        running = true;
        last = performance.now();
        rafId = requestAnimationFrame(tick);
      };

      // —— 可见性双重保险:IntersectionObserver + document visibility ——
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !document.hidden) start();
          else stop();
        },
        { threshold: 0.05 }
      );
      io.observe(pre);

      onVis = () => {
        if (document.hidden) stop();
        else {
          // 重新可见且元素在视口内,恢复
          const rect = pre.getBoundingClientRect();
          const inView =
            rect.bottom > 0 &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight);
          if (inView) start();
        }
      };
      document.addEventListener('visibilitychange', onVis);
    });

    return () => {
      if (idleHandle !== null) cancel(idleHandle);
      stop();
      if (io) io.disconnect();
      if (onVis) document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <pre
        ref={preRef}
        className="font-mono text-[0.4rem] md:text-[0.48rem] lg:text-[0.52rem] leading-[0.5] md:leading-[0.55] lg:leading-[0.58] select-none tracking-[-0.05em] banana-pre"
      />
    </div>
  );
}
