// Firestore-backed order sync. Falls back gracefully to no-op when
// Firebase isn't configured (then the app relies on BroadcastChannel only).

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  Timestamp,
  limit as fsLimit,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase';
import type { Order, OrderStatus } from '../types';

/** Collection name for live demo orders (separate from MOCK_ORDERS). */
const COLLECTION = 'orders';

/** Push a new order to Firestore. Resolves silently if Firebase is off. */
export async function pushOrder(order: Order): Promise<string | null> {
  if (!firebaseEnabled || !db) return null;
  const ref = await addDoc(collection(db, COLLECTION), {
    ...order,
    // Replace ISO string with serverTimestamp so ordering is reliable
    createdAtServer: serverTimestamp(),
  });
  return ref.id;
}

/** Update an order's status remotely. */
export async function pushStatus(
  firestoreId: string,
  status: OrderStatus
): Promise<void> {
  if (!firebaseEnabled || !db) return;
  await updateDoc(doc(db, COLLECTION, firestoreId), { status });
}

interface FirestoreOrder extends Omit<Order, 'createdAt'> {
  /** Local id stored in the document body (for de-duplication with mocks). */
  id: string;
  createdAt: string | Timestamp;
  createdAtServer?: Timestamp;
  /** The Firestore document id, for status updates. */
  firestoreId?: string;
}

/**
 * Subscribe to live orders. Calls `onChange(orders)` every time the snapshot
 * updates, and `onNew(order)` for newly added orders only (use this to play
 * a ding / show a notification on the first appearance).
 */
export function subscribeToOrders(
  onChange: (orders: Order[]) => void,
  onNew?: (order: Order, isFresh: boolean) => void
): () => void {
  if (!firebaseEnabled || !db) return () => {};

  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAtServer', 'desc'),
    fsLimit(100)
  );

  // Track first-snapshot to avoid firing onNew for the entire backlog.
  let firstSnapshot = true;

  const unsubscribe = onSnapshot(q, (snap) => {
    const list: Order[] = [];
    snap.forEach((d) => {
      const data = d.data() as FirestoreOrder;
      const ts =
        data.createdAtServer instanceof Timestamp
          ? data.createdAtServer.toDate().toISOString()
          : typeof data.createdAt === 'string'
          ? data.createdAt
          : new Date().toISOString();
      list.push({
        ...(data as unknown as Order),
        createdAt: ts,
      });
    });
    onChange(list);

    if (onNew) {
      snap.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data() as FirestoreOrder;
          // Reconstruct with proper createdAt
          const order: Order = {
            ...(data as unknown as Order),
            createdAt:
              data.createdAtServer instanceof Timestamp
                ? data.createdAtServer.toDate().toISOString()
                : typeof data.createdAt === 'string'
                ? data.createdAt
                : new Date().toISOString(),
          };
          // Only treat as truly fresh if not part of initial backlog
          onNew(order, !firstSnapshot);
        }
      });
      firstSnapshot = false;
    }
  });

  return unsubscribe;
}
