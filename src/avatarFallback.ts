/** From `public/avatar-placeholder.svg` — README: use a placeholder when author image is unavailable. */
export const AVATAR_FALLBACK = (process.env.PUBLIC_URL || "") + "/avatar-placeholder.svg";

/** Conduit APIs often return `static.productionready.io/.../smiley-cyrus.jpg` (403). */
export function resolveAvatarUrl(image: string | null | undefined): string {
  const raw = image == null ? "" : String(image).trim();
  if (!raw) return AVATAR_FALLBACK;
  const low = raw.toLowerCase();
  if (low.indexOf("static.productionready.io") >= 0 || low.indexOf("smiley-cyrus") >= 0) {
    return AVATAR_FALLBACK;
  }
  return raw;
}
