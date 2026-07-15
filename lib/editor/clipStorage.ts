let clipIdCounter = 0;

function nextClipId(): string {
  clipIdCounter += 1;
  return `clip_${Date.now().toString(36)}_${clipIdCounter}`;
}

export interface UserClip {
  id: string;
  label: string;
  description?: string;
  html: string;
  createdAt: number;
}

const STORAGE_KEY = 'epub_studio_user_clips';
const MAX_CLIPS = 20;

export function loadClips(): UserClip[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UserClip[];
  } catch {
    return [];
  }
}

export function saveClip(clip: UserClip): void {
  const clips = loadClips();
  clips.unshift(clip);
  if (clips.length > MAX_CLIPS) clips.length = MAX_CLIPS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clips));
}

export function deleteClip(id: string): void {
  const clips = loadClips().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clips));
}

export function renameClip(id: string, label: string): void {
  const clips = loadClips().map((c) => (c.id === id ? { ...c, label } : c));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clips));
}
