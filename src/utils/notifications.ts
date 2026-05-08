// Tiny audio + Notification helpers — no external assets, no deps.

let audioCtx: AudioContext | null = null;
let unlocked = false;

/** Must be called from a user gesture to unlock audio on iOS / Safari. */
export function unlockAudio() {
  if (unlocked) return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    // Play a silent buffer to fully unlock the context
    const buf = audioCtx.createBuffer(1, 1, 22050);
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.connect(audioCtx.destination);
    src.start(0);
    unlocked = true;
  } catch {
    /* no audio support */
  }
}

export function isAudioUnlocked() {
  return unlocked;
}

/** Two-tone "ding-dong" — bright and pleasant. */
export function playDing() {
  if (!audioCtx || !unlocked) return;
  const now = audioCtx.currentTime;
  const tones: Array<{ freq: number; start: number; dur: number }> = [
    { freq: 1318.5, start: 0, dur: 0.18 }, // E6
    { freq: 1046.5, start: 0.18, dur: 0.4 }, // C6
  ];
  for (const t of tones) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = t.freq;
    gain.gain.setValueAtTime(0, now + t.start);
    gain.gain.linearRampToValueAtTime(0.22, now + t.start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + t.start + t.dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + t.start);
    osc.stop(now + t.start + t.dur + 0.05);
  }
}

/** Request browser notification permission. Resolves to true if granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function notificationStatus(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

/** Fire a system notification (works as native push when PWA installed). */
export function sendNotification(title: string, body: string, tag?: string) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      tag,
      icon: `${import.meta.env.BASE_URL}icon-192.png`,
      badge: `${import.meta.env.BASE_URL}icon-192.png`,
    });
  } catch {
    /* ignore */
  }
}

/** Best-effort haptic feedback on mobile. */
export function vibrate(pattern: number | number[] = [40, 30, 40]) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}
