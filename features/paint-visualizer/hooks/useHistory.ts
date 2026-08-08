"use client";

import { useCallback, useMemo, useReducer } from "react";

/**
 * Generic undo/redo stack.
 *
 * Deliberately feature-agnostic — the visualizer stores layer arrays in it,
 * but a future floor-plan or facade tool can reuse it unchanged.
 */

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

type HistoryAction<T> =
  | { type: "commit"; value: T }
  | { type: "replace"; value: T }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "reset"; value: T };

const HISTORY_LIMIT = 30;

function reducer<T>(state: HistoryState<T>, action: HistoryAction<T>): HistoryState<T> {
  switch (action.type) {
    case "commit": {
      const past = [...state.past, state.present].slice(-HISTORY_LIMIT);
      return { past, present: action.value, future: [] };
    }
    // Used for continuous interactions (dragging a slider) where we do not
    // want a history entry per frame.
    case "replace":
      return { ...state, present: action.value };
    case "undo": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "redo": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return { past: [...state.past, state.present], present: next, future: rest };
    }
    case "reset":
      return { past: [], present: action.value, future: [] };
    default:
      return state;
  }
}

export function useHistory<T>(initial: T) {
  // Bind the generic reducer to T. Re-creating the reference each render is
  // harmless — React only reads it when a dispatch is processed.
  const typedReducer: (
    state: HistoryState<T>,
    action: HistoryAction<T>
  ) => HistoryState<T> = reducer;

  const [state, dispatch] = useReducer(typedReducer, {
    past: [] as T[],
    present: initial,
    future: [] as T[],
  });

  const commit = useCallback((value: T) => dispatch({ type: "commit", value }), []);
  const replace = useCallback((value: T) => dispatch({ type: "replace", value }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const reset = useCallback((value: T) => dispatch({ type: "reset", value }), []);

  return useMemo(
    () => ({
      value: state.present,
      commit,
      replace,
      undo,
      redo,
      reset,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
    }),
    [state, commit, replace, undo, redo, reset]
  );
}
