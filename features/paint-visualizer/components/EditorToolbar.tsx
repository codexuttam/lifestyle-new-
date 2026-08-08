"use client";

import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { buildSchemeSummary, downloadCanvas } from "../lib/export";
import type { PaintLayer } from "../types";
import styles from "./PaintVisualizer.module.css";

interface EditorToolbarProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  layers: PaintLayer[];
  roomName: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

export default function EditorToolbar({
  canvasRef,
  layers,
  roomName,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
}: EditorToolbarProps) {
  const { copy, copiedKey } = useCopyToClipboard();
  const hasWork = layers.length > 0;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const slug = roomName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    downloadCanvas(canvas, `paint-scheme-${slug}.png`);
  };

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Editor actions">
      <button
        type="button"
        className={styles.toolbarButton}
        onClick={onUndo}
        disabled={!canUndo}
      >
        Undo
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        onClick={onRedo}
        disabled={!canRedo}
      >
        Redo
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        onClick={onClear}
        disabled={!hasWork}
      >
        Clear all
      </button>

      <span className={styles.toolbarSpacer} />

      <button
        type="button"
        className={styles.toolbarButton}
        onClick={() => void copy(buildSchemeSummary(layers, roomName), "scheme")}
        disabled={!hasWork}
      >
        {copiedKey === "scheme" ? "Scheme copied" : "Copy scheme"}
      </button>
      <button
        type="button"
        className={styles.toolbarButtonPrimary}
        onClick={handleDownload}
        disabled={!hasWork}
      >
        Download image
      </button>
    </div>
  );
}
