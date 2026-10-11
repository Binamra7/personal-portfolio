"use client";

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { onceInView } from "@/lib/in-view";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
};

/** Fades up once scrolled into view. Styles: `[data-reveal]` in globals.css. */
export function Reveal({ children, as: Tag = "div", delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return onceInView(ref.current, () => setVisible(true), { rootMargin: "0px 0px -10% 0px" });
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-visible={visible}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
