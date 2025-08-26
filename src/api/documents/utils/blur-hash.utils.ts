import { encode } from "blurhash";
import sharp from "sharp";

export const encodeImageToBlurHash = async (
  path: string | Uint8Array,
): Promise<string> => {
  try {
    const { data, info } = await sharp(path)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer({ resolveWithObject: true });

    return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
  } catch (error) {
    console.error(`${(error as Error).message}`);

    throw error;
  }
};
