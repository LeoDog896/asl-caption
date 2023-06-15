export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function backend(path: string): string {
  if (path.startsWith("/"))
    return BACKEND_URL + path;
  else
    return BACKEND_URL + "/" + path;
}
