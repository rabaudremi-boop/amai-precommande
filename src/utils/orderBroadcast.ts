// Cross-tab order broadcast using BroadcastChannel.
// Use case: client passes an order in one tab → admin tab gets the order live.

import { useEffect } from 'react';
import type { Order } from '../types';

const CHANNEL = 'amai-orders';

export type OrderEvent =
  | { type: 'new-order'; order: Order }
  | { type: 'status-change'; orderId: string; status: Order['status'] };

export function broadcastNewOrder(order: Order) {
  if (typeof BroadcastChannel === 'undefined') return;
  const ch = new BroadcastChannel(CHANNEL);
  ch.postMessage({ type: 'new-order', order } satisfies OrderEvent);
  setTimeout(() => ch.close(), 100);
}

export function broadcastStatusChange(orderId: string, status: Order['status']) {
  if (typeof BroadcastChannel === 'undefined') return;
  const ch = new BroadcastChannel(CHANNEL);
  ch.postMessage({ type: 'status-change', orderId, status } satisfies OrderEvent);
  setTimeout(() => ch.close(), 100);
}

export function useOrderEvents(handler: (ev: OrderEvent) => void) {
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL);
    const onMsg = (e: MessageEvent<OrderEvent>) => handler(e.data);
    ch.addEventListener('message', onMsg);
    return () => {
      ch.removeEventListener('message', onMsg);
      ch.close();
    };
  }, [handler]);
}
