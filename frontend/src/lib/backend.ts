import type {LabelledData} from "./model";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function url(path: string): string {
  if (path.startsWith('/')) return BACKEND_URL + path;
  else return BACKEND_URL + '/' + path;
}

export async function process(img: HTMLImageElement): Promise<LabelledData> {
  const body = {
    url: img.src
  };
  const response = await fetch(url("/upload"), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log(data);

  const boxesData = new Float32Array(data);
  const blank = new Uint8Array();

  return {
    img,
    boxesData,
    scoresData: blank,
    classesData: blank,
    ratios: [1, 1]
  }
}
