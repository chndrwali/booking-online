import "server-only";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

/**
 * Extract UploadThing file key from a URL.
 * Supports both formats:
 * - https://utfs.io/f/FILE_KEY
 * - https://FILE_KEY.ufs.sh/f/FILE_KEY
 */
function extractFileKey(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    // The file key is always the last segment after /f/
    const fIndex = parts.indexOf("f");
    if (fIndex !== -1 && parts[fIndex + 1]) {
      return parts[fIndex + 1];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Delete files from UploadThing by their URLs.
 * Silently handles errors to avoid breaking the main flow.
 */
export async function deleteUploadthingFiles(urls: string[]) {
  const keys = urls.map(extractFileKey).filter(Boolean) as string[];
  if (keys.length === 0) return;

  try {
    await utapi.deleteFiles(keys);
  } catch (error) {
    console.error("[UploadThing] Failed to delete files:", error);
  }
}
