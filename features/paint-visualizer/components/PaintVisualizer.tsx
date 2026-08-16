"use client";

import { useEffect } from "react";
import { usePaintVisualizer } from "../hooks/usePaintVisualizer";
import { useShortlist } from "../hooks/useShortlist";
import { findColorByHex } from "../data/palette";
import ColorDetailsPanel from "./ColorDetailsPanel";
import ColorPalette from "./ColorPalette";
import EditorToolbar from "./EditorToolbar";
import RoomCanvas from "./RoomCanvas";
import RoomPicker from "./RoomPicker";
import ShortlistBar from "./ShortlistBar";
import SurfacePanel from "./SurfacePanel";
import WallSelector from "./WallSelector";
import styles from "./PaintVisualizer.module.css";

/**
 * Feature root. Wires the editor hook to the presentational panels and owns
 * nothing itself — all state lives in `usePaintVisualizer` and `useShortlist`.
 */
export default function PaintVisualizer() {
  const editor = usePaintVisualizer();
  const shortlist = useShortlist();

  // The colour shown in the details panel follows the selected surface when
  // there is one, and the palette selection otherwise.
  const displayHex = editor.activeLayer?.hex ?? editor.activeColor.hex;
  const displayName =
    editor.activeLayer?.colorName ??
    editor.activeColor.name ??
    findColorByHex(displayHex)?.name ??
    "Custom";

  // Keyboard shortcuts matching every other editor people have used.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.key.toLowerCase() !== "z") return;
      event.preventDefault();
      if (event.shiftKey) editor.redo();
      else editor.undo();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editor]);

  return (
    <div className={styles.layout}>
      <div className={styles.stageColumn}>
        <RoomCanvas
          paintedCanvasRef={editor.paintedCanvasRef}
          originalCanvasRef={editor.originalCanvasRef}
          width={editor.dimensions.width}
          height={editor.dimensions.height}
          status={editor.status}
          tool={editor.tool}
          onSelect={editor.selectAt}
        />

        <EditorToolbar
          canvasRef={editor.paintedCanvasRef}
          layers={editor.layers}
          roomName={editor.room.name}
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          onUndo={editor.undo}
          onRedo={editor.redo}
          onClear={editor.clearAll}
        />

        {editor.error && (
          <p className={styles.errorMessage} role="status" aria-live="polite">
            {editor.error}
          </p>
        )}

        <ShortlistBar
          entries={shortlist.entries}
          onApply={editor.applyCustomHex}
          onRemove={shortlist.remove}
          onClear={shortlist.clear}
        />
      </div>

      <aside className={styles.sidebar} aria-label="Paint controls">
        {editor.isBlankRoom && (
          <WallSelector
            surfaces={editor.blankSurfaces}
            layers={editor.layers}
            activeLayerId={editor.activeLayerId}
            onPick={editor.paintSurface}
          />
        )}

        <ColorPalette
          activeHex={displayHex}
          onSelect={editor.applyColor}
          onCustomHex={editor.applyCustomHex}
        />

        <ColorDetailsPanel
          hex={displayHex}
          name={displayName}
          shortlisted={shortlist.has(displayHex)}
          onToggleShortlist={() => shortlist.toggle(displayHex, displayName)}
          onSelectHex={editor.applyCustomHex}
        />

        <SurfacePanel
          layers={editor.layers}
          activeLayerId={editor.activeLayerId}
          onSelectLayer={editor.setActiveLayerId}
          onRemoveLayer={editor.removeLayer}
          onOpacityChange={(id, opacity, committed) =>
            editor.updateLayer(id, { opacity }, { transient: !committed })
          }
          finish={editor.finish}
          onFinishChange={editor.applyFinish}
          tolerance={editor.tolerance}
          onToleranceChange={editor.setTolerance}
          tool={editor.tool}
          onToolChange={editor.setTool}
          blankMode={editor.isBlankRoom}
        />

        <RoomPicker
          activeRoomId={editor.room.id}
          onSelect={editor.setRoom}
          onError={editor.setError}
        />
      </aside>
    </div>
  );
}
