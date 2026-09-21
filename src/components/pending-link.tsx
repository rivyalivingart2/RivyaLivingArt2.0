"use client";

import Link, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";
import styles from "./pending-link.module.css";

function NavigationPending() {
  const { pending } = useLinkStatus();
  return <>
    <span className={styles.line} data-pending={pending || undefined} aria-hidden="true" />
    <span className={styles.announcement} role="status">{pending ? "Opening page…" : ""}</span>
  </>;
}

/** Follows Next's actual transition state, including cancellation and completion. */
export function PendingLink({ children, className, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={`${styles.link}${className ? ` ${className}` : ""}`}>{children}<NavigationPending /></Link>;
}
