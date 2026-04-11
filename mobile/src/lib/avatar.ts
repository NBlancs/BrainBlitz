const DICEBEAR_PIXEL_ART_BASE_URL = "https://api.dicebear.com/9.x/pixel-art/png";

export function buildPixelAvatarUri(seed: string, size = 128) {
  return `${DICEBEAR_PIXEL_ART_BASE_URL}?seed=${encodeURIComponent(seed)}&size=${size}`;
}

export function createRandomAvatarSeed(base = "player") {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export function createAvatarChoices(base = "player", count = 8) {
  return Array.from({ length: count }, () => createRandomAvatarSeed(base));
}

export function createUserAvatarSeed(userId: string, username: string) {
  return `${username}-${userId}`;
}