/**
 * Custom hook for managing a persistent WebSocket connection to the NIDS backend.
 *
 * Features:
 * - Auto-reconnect with exponential backoff (1s → 2s → 4s → 8s → 32s max)
 * - JWT token injection as query parameter
 * - Dispatches received alerts to Zustand alertStore automatically
 * - Cleanup on component unmount
 *
 * @returns Connection status and manual send capability
 */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAlertStore } from "@/stores/alertStore";
import { getStoredToken } from "@/lib/api";
import type { WsMessage } from "@/types/api";
import type { AlertResponse } from "@/types/alert";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/events";
const MAX_RECONNECT_DELAY_MS = 32_000;

export interface WebSocketHookReturn {
  isConnected: boolean;
  sendMessage: (message: object) => void;
}

export function useWebSocket(): WebSocketHookReturn {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelayRef = useRef(1000);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  
  const alertBuffer = useRef<AlertResponse[]>([]);
  const addAlerts = useAlertStore((state) => state.addAlerts);

  // Flush buffer every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (alertBuffer.current.length > 0) {
        addAlerts([...alertBuffer.current]);
        alertBuffer.current = [];
      }
    }, 500);
    return () => clearInterval(interval);
  }, [addAlerts]);

  const connect = useCallback(() => {
    const token = getStoredToken();
    if (!token || !isMountedRef.current) return;

    const url = `${WS_BASE_URL}?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMountedRef.current) return;
      setIsConnected(true);
      reconnectDelayRef.current = 1000; // Reset backoff on successful connect
    };

    ws.onmessage = (event: MessageEvent) => {
      if (!isMountedRef.current) return;
      try {
        const message: WsMessage = JSON.parse(event.data as string);
        if (message.type === "new_alert" && message.data) {
          alertBuffer.current.push(message.data as unknown as AlertResponse);
        }
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onclose = () => {
      if (!isMountedRef.current) return;
      setIsConnected(false);
      wsRef.current = null;

      // Schedule reconnection with exponential backoff
      reconnectTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          reconnectDelayRef.current = Math.min(
            reconnectDelayRef.current * 2,
            MAX_RECONNECT_DELAY_MS
          );
          connect();
        }
      }, reconnectDelayRef.current);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [addAlerts]);

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { isConnected, sendMessage };
}
