import React from "react";
import styles from "./SolHausShell.module.css";

interface SolHausShellProps {
  children: React.ReactNode;
}

export default function SolHausShell({ children }: SolHausShellProps) {
  return (
    <div className={styles.outerCanvas}>
      <main className={styles.framedContainer}>{children}</main>
    </div>
  );
}
