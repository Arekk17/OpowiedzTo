type AuthEvent =
  | "auth:login"
  | "auth:register"
  | "token:refreshed"
  | "auth:logout";
type Handler = () => void;

const listeners = new Map<AuthEvent, Set<Handler>>();

export function on(event: AuthEvent, handler: Handler) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)!.add(handler);
  return () => off(event, handler);
}

export function off(event: AuthEvent, handler: Handler) {
  listeners.get(event)?.delete(handler);
}

export function emit(event: AuthEvent) {
  listeners.get(event)?.forEach((h) => {
    try {
      h();
    } catch {}
  });
}
