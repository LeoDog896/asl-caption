import * as tf from '@tensorflow/tfjs';
import data from '../model/metadata.yaml';
import zod from 'zod';
import randomColor from 'randomcolor';

export const names = Object.freeze(
  Object.fromEntries(
    Object.entries(zod.record(zod.string(), zod.string()).parse(data.names)).map(([k, v]) => [
      k,
      {
        name: v,
        color: randomColor({ luminosity: 'dark' })
      }
    ])
  )
);

// lots of code adapted from https://github.com/Hyuto/yolov8-tfjs/blob/master/src/utils/detect.js

const [DIMENSIONS_X, DIMENSIONS_Y] = [640, 640];

type InputData = Parameters<typeof tf.browser.fromPixels>[0] & CanvasImageSource;

/**
 * Preprocess image / frame before forwarded into the model
 */
export function preprocess(source: InputData, modelWidth: number, modelHeight: number) {
  let xRatio, yRatio; // ratios for boxes

  const input = tf.tidy(() => {
    const img = tf.browser.fromPixels(source);

    // padding image to square => [n, m] to [n, n], n > m
    const [h, w] = img.shape.slice(0, 2); // get source width and height
    const maxSize = Math.max(w, h); // get max size
    const imgPadded = img.pad([
      [0, maxSize - h], // padding y [bottom only]
      [0, maxSize - w], // padding x [right only]
      [0, 0]
    ]);

    xRatio = maxSize / modelWidth; // update xRatio
    yRatio = maxSize / modelHeight; // update yRatio

    return tf.image
      .resizeBilinear(imgPadded as any, [modelWidth, modelHeight]) // resize frame
      .div(255.0) // normalize
      .expandDims(0); // add batch
  });

  return [input, xRatio, yRatio];
}

export async function process(
  model: tf.GraphModel<string | tf.io.IOHandler>,
  img: InputData
): Promise<LabelledData> {
  tf.engine().startScope(); // start scoping
  const [input, xRatio, yRatio] = preprocess(img, DIMENSIONS_X, DIMENSIONS_Y);
  const output = model.execute(input) as tf.Tensor<tf.Rank>;
  const numClass = Object.keys(names).length; // get number of classes

  // to cover our previous output casting
  console.assert(!Array.isArray(output), 'Expected output to be a single tensor');

  const transRes = output.transpose([0, 2, 1]); // transpose result [b, det, n] => [b, n, det]
  const boxes = tf.tidy(() => {
    const w = transRes.slice([0, 0, 2], [-1, -1, 1]); // get width
    const h = transRes.slice([0, 0, 3], [-1, -1, 1]); // get height
    const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2)); // x1
    const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2)); // y1
    return tf
      .concat(
        [
          y1,
          x1,
          tf.add(y1, h), // y2
          tf.add(x1, w) // x2
        ],
        2
      )
      .squeeze();
  }); // process boxes [y1, x1, y2, x2]

  const [scores, classes] = tf.tidy(() => {
    const rawScores = transRes.slice([0, 0, 4], [-1, -1, numClass]).squeeze(); // class scores
    return [rawScores.max<tf.Tensor1D>(1), rawScores.argMax<tf.Tensor1D>(1)];
  }); // get max scores and classes index

  const nms = await tf.image.nonMaxSuppressionAsync(boxes as any, scores, 500, 0.45, 0.2); // NMS to filter boxes

  const boxesData = await boxes.gather(nms, 0).data(); // indexing boxes by nms index
  const scoresData = await scores.gather(nms, 0).data(); // indexing scores by nms index
  const classesData = await classes.gather(nms, 0).data(); // indexing classes by nms index

  tf.dispose([output, transRes, boxes, scores, classes, nms]); // clear memory

  tf.engine().endScope(); // end of scoping

  return {
    img,
    boxesData,
    scoresData,
    classesData,
    ratios: [xRatio, yRatio]
  };
}

export type LabelledData = {
  img: InputData;
  boxesData: Float32Array | Int32Array | Uint8Array;
  scoresData: Float32Array | Int32Array | Uint8Array;
  classesData: Float32Array | Int32Array | Uint8Array;
  ratios: [x: number, y: number];
};
