import React from "react";
import styles from "./SolHausShell.module.css";

interface SolHausShellProps {
  children: React.ReactNode;
}

export default function SolHausShell({ children }: SolHausShellProps) {
  return (
    <div className={styles.outerCanvas}>
      {/* Giant Architectural AURA Watermark on Outer Beige Canvas */}
      <div className={styles.topWatermark} aria-hidden="true">
        AURA
      </div>

      {/* Centered Framed Website Container */}
      <div className={styles.framedContainer}>{children}</div>

      {/* Bottom Subtle Watermark */}
      <div className={styles.bottomWatermark} aria-hidden="true">
        THE ART OF BETTER LIVING
      </div>
    </div>
  );
}
