import type {LabelledData} from "./model";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function url(path: string): string {
  if (path.startsWith('/')) return BACKEND_URL + path;
  else return BACKEND_URL + '/' + path;
}

function transpose<T>(src: T[]): T[] {
  return [
    src[1],
    src[0],
    src[3],
    src[2]
  ];
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

  const boxesData = new Float32Array(transpose(data[0].box));
  const scoresData = new Float32Array([data[0].conf]);
  const classesData = new Uint8Array([data[0].cls]);

  return {
    img,
    boxesData,
    scoresData,
    classesData,
    ratios: [1, 1]
  }
}
