/**
 * Calls `callback` the first time `node` enters the viewport, then stops
 * observing. Returns a cleanup function. Does nothing where
 * IntersectionObserver is missing (e.g. jsdom), so callers keep their
 * server-rendered final state.
 */
export function onceInView(
  node: Element,
  callback: () => void,
  options?: IntersectionObserverInit,
): () => void {
  if (typeof IntersectionObserver === "undefined") return () => {};
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    observer.disconnect();
    callback();
  }, options);
  observer.observe(node);
  return () => observer.disconnect();
}
