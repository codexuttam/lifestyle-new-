"use client";

import { useRef, useState } from "react";
import { BLANK_ROOM } from "../data/rooms";
import { validateUpload } from "../lib/imageLoader";
import type { RoomSource } from "../types";
import styles from "./PaintVisualizer.module.css";

interface RoomPickerProps {
  activeRoomId: string;
  onSelect: (room: RoomSource) => void;
  onError: (message: string) => void;
}

/** The generated blank room plus "use my own photo". */
export default function RoomPicker({
  activeRoomId,
  onSelect,
  onError,
}: RoomPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    const validation = validateUpload(file);
    if (!validation.ok) {
      onError(validation.error ?? "That file could not be used.");
      return;
    }

    // Release the previous upload so repeated uploads do not leak memory.
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setUploadName(file.name);

    onSelect({
      id: "upload",
      name: "Your photo",
      src: url,
      description: file.name,
      origin: "upload",
    });
  };

  return (
    <section className={styles.panel} aria-labelledby="room-heading">
      <h3 id="room-heading" className={styles.panelTitle}>
        Start from
      </h3>

      <ul className={styles.roomGrid}>
        <li>
          <button
            type="button"
            className={styles.roomCard}
            data-active={activeRoomId === BLANK_ROOM.id}
            aria-pressed={activeRoomId === BLANK_ROOM.id}
            onClick={() => onSelect(BLANK_ROOM)}
          >
            {/* Miniature of the generated room, matching lib/blankRoom.ts. */}
            <svg
              className={styles.roomThumb}
              viewBox="0 0 150 100"
              aria-hidden="true"
              focusable="false"
            >
              <polygon points="0,100 40,77 110,77 150,100" fill="#cfc9bd" />
              <polygon points="0,0 150,0 110,23 40,23" fill="#f0ede7" />
              <polygon points="0,0 40,23 40,77 0,100" fill="#e3dfd6" />
              <polygon points="150,0 110,23 110,77 150,100" fill="#e9e5dc" />
              <rect x="40" y="23" width="70" height="54" fill="#f5f3ee" />
            </svg>
            <span className={styles.roomName}>{BLANK_ROOM.name}</span>
          </button>
        </li>
      </ul>

      <div className={styles.uploadRow}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => inputRef.current?.click()}
          data-active={activeRoomId === "upload"}
        >
          Upload your own photo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.visuallyHidden}
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <p className={styles.panelHint}>
          {uploadName
            ? `Using ${uploadName}. Your photo stays on your device — nothing is uploaded to a server.`
            : "JPG, PNG or WebP up to 12 MB. Processed entirely in your browser."}
        </p>
      </div>
    </section>
  );
}
