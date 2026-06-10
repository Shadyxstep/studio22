import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/* RTL auto-cleanup needs a global afterEach; vitest globals are off. */
afterEach(cleanup);

/* jsdom lacks IntersectionObserver; framer-motion's whileInView needs it. */
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  globalThis.IntersectionObserver ?? IntersectionObserverStub;
