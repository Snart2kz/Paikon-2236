import { useEffect, useRef, useState, type RefObject } from 'react';

export const FRAME_COUNT = 181;
const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** Scroll is the only clock. There is deliberately no playback or temporal lerp. */
export function useSequence(section: RefObject<HTMLElement | null>, canvas: RefObject<HTMLCanvasElement | null>) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const latest = useRef(0);

  useEffect(() => {
    const el = canvas.current;
    const stage = section.current;
    if (!el || !stage) return;
    const ctx = el.getContext('2d', { alpha: false });
    if (!ctx) return;
    let disposed = false;
    let tick = 0;
    let wanted = 0;
    const mobile = window.matchMedia('(max-width: 700px)').matches;
    el.width = mobile ? 720 : 1120;
    el.height = mobile ? 405 : 630;
    const cache = new Map<number, ImageBitmap>();
    const loading = new Set<number>();
    const bytes = new Map<number, Blob>();
    const retries = new Map<number, number>();
    const abort = new AbortController();
    let active = 0;
    let prefetchActive = 0;
    const pending: number[] = [];
    let warmIndex = 0;
    const url = (i: number) => `/sequence/${mobile ? 'mobile/' : ''}${String(i).padStart(3, '0')}.webp`;

    function draw() {
      if (disposed || !ctx) return;
      let frame = cache.get(wanted);
      // While the exact frame decodes, keep the closest already decoded frame visible.
      // Completion redraws the *current* wanted frame, never the stale requested position.
      if (!frame && cache.size) {
        let distance = Infinity;
        for (const [index, bitmap] of cache) {
          if (Math.abs(index - wanted) < distance) {
            distance = Math.abs(index - wanted);
            frame = bitmap;
          }
        }
      }
      if (frame) {
        ctx.drawImage(frame, 0, 0, el!.width, el!.height);
        setReady(true);
      }
      el!.dataset.targetFrame = String(wanted);
      el!.dataset.exact = String(cache.has(wanted));
      setBuffering(!cache.has(wanted));
    }

    function trim() {
      // Bounded decoded memory: 28 frames, not 181 full RGBA images.
      if (cache.size <= 28) return;
      const far = [...cache.keys()].sort((a, b) => Math.abs(b - wanted) - Math.abs(a - wanted));
      while (cache.size > 28) {
        const i = far.shift()!;
        cache.get(i)?.close();
        cache.delete(i);
      }
    }

    async function load(i: number) {
      loading.add(i);
      active++;
      try {
        let blob = bytes.get(i);
        if (!blob) {
          const response = await fetch(url(i), { signal: abort.signal, priority: i === wanted ? 'high' : 'low' });
          if (!response.ok) throw new Error('Frame unavailable');
          blob = await response.blob();
          bytes.set(i, blob);
        }
        const bitmap = await createImageBitmap(blob);
        if (disposed) { bitmap.close(); return; }
        cache.set(i, bitmap);
        trim();
        draw();
      } catch {
        if (!disposed) {
          retries.set(i, (retries.get(i) ?? 0) + 1);
          if (i === wanted && !cache.size) setFailed(true);
        }
      } finally {
        loading.delete(i);
        active--;
        if (!disposed) pump();
      }
    }

    function pump() {
      while (!disposed && active < 5 && pending.length) {
        const i = pending.shift()!;
        if (!loading.has(i) && !cache.has(i) && (retries.get(i) ?? 0) < 2) void load(i);
      }
    }

    function queueNeighborhood() {
      pending.length = 0;
      pending.push(wanted);
      for (let d = 1; d <= 9; d++) {
        if (wanted + d < FRAME_COUNT) pending.push(wanted + d);
        if (wanted - d >= 0) pending.push(wanted - d);
      }
      pump();
    }

    // Progressive compressed-byte prefetch uses two low-priority connections.
    // Decoding remains local to the current scroll neighborhood.
    async function warm() {
      if (disposed || prefetchActive >= 2 || warmIndex >= FRAME_COUNT) return;
      const i = warmIndex++;
      if (bytes.has(i) || loading.has(i)) { void warm(); return; }
      prefetchActive++;
      try {
        const response = await fetch(url(i), { signal: abort.signal, priority: 'low' });
        if (response.ok) bytes.set(i, await response.blob());
      } catch { /* User navigated away or offline; foreground queue can retry. */ }
      finally {
        prefetchActive--;
        if (!disposed) void warm();
      }
    }

    function sync() {
      tick = 0;
      const rect = stage!.getBoundingClientRect();
      const range = Math.max(1, stage!.offsetHeight - window.innerHeight);
      const p = clamp(-rect.top / range);
      latest.current = p;
      setProgress(p);
      const next = Math.round(p * (FRAME_COUNT - 1));
      if (next !== wanted || !cache.size) {
        wanted = next;
        queueNeighborhood();
      }
      draw();
    }
    function onScroll() { if (!tick) tick = requestAnimationFrame(sync); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    sync();
    void warm(); void warm();
    return () => {
      disposed = true;
      abort.abort();
      cancelAnimationFrame(tick);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      for (const bitmap of cache.values()) bitmap.close();
    };
  }, [section, canvas]);

  function goTo(p: number) {
    if (!section.current) return;
    const start = section.current.getBoundingClientRect().top + window.scrollY;
    const range = section.current.offsetHeight - window.innerHeight;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: start + clamp(p) * range, behavior: reduced ? 'instant' : 'smooth' });
  }

  return { progress, ready, buffering, failed, goTo };
}