/**
 * Programmatically builds a GraphCMS image asset transformation url.
 * https://docs.graphcms.com/developers/assets/transformations
 */
export class AssetURLBuilder {
  private _parts: Readonly<string[]>;

  /**
   * Initialize an AssetURLBuilder instance with an array of url parts.
   * @param parts
   */
  constructor(parts = ['https://media.graphcms.com']) {
    this._parts = parts;
  }

  /**
   * The resizing feature comprises two main functions, manipulating the width
   * and height of an image and changing the fit and alignment of the image.
   * https://docs.graphcms.com/developers/assets/transformations/resize-fit-and-align
   *
   * @param options.width
   * The width in pixels to resize the image to. The value must be an integer
   * from 1 to 10000.
   * @param options.height
   * The height in pixels to resize the image to. The value must be an integer
   * from 1 to 10000.
   * @param options.fit
   * - **`clip`** *default* Resizes the image to fit within the specified
   * parameters without distorting, cropping, or changing the aspect ratio.
   * - **`crop`** Resizes the image to fit the specified parameters exactly by
   * removing any parts of the image that don't fit within the boundaries.
   * - **`scale`** Resizes the image to fit the specified parameters exactly by
   * scaling the image to the desired size. The aspect ratio of the image is not
   * respected and the image can be distorted using this method.
   * - **`max`** Resizes the image to fit within the parameters, but as opposed
   * to `fit: "clip"` will not scale the image if the image is smaller than the
   * output size.
   * @param options.align
   * Using align, you can choose the area of the image to focus on.
   */
  resize(options: {
    width?: number;
    height?: number;
    fit?: 'clip' | 'crop' | 'scale' | 'max';
    align?:
      | 'left'
      | 'right'
      | 'top'
      | 'bottom'
      | ['top' | 'bottom', 'left' | 'right']
      | 'center'
      | 'faces';
  }): AssetURLBuilder {
    const {width, height, fit = 'clip', align} = options;
    const resize = [];

    width !== undefined && resize.push(`w:${width}`);
    height !== undefined && resize.push(`h:${height}`);
    fit !== 'clip' && resize.push(`f:${fit}`);
    align !== undefined &&
      resize.push(`a:${Array.isArray(align) ? `[${align.join(',')}]` : align}`);

    return new AssetURLBuilder([...this._parts, `resize=${resize.join(',')}`]);
  }

  /**
   * The X and Y coordinates start from [0,0] and correspond to the top left
   * hand corner of the image to be cropped. The Width and Height parameters
   * dictate the size in pixels of the cropping rectangle once the point to
   * start the crop at is selected by the X and Y coordinates. If you set
   * coordinates that create a crop area that extends outside the frame of the
   * image, then you will only receive back the part of the image that is within
   * the crop area.
   * https://docs.graphcms.com/developers/assets/transformations/crop
   *
   * @param options.x Crop rect left coordinate
   * @param options.y Crop rect top coordinate
   * @param options.width Crop rect width
   * @param options.height Crop rect height
   */
  crop(options: {
    x?: number;
    y?: number;
    width: number;
    height: number;
  }): AssetURLBuilder {
    const {x = 0, y = 0, width, height} = options;
    return new AssetURLBuilder([
      ...this._parts,
      `crop=d[${x},${y},${width},${height}]`,
    ]);
  }

  /**
   * You can rotate your image in a range clockwise from 0 to 359 degrees.
   * https://docs.graphcms.com/developers/assets/transformations/rotate
   *
   * @param options.deg
   * The degree by which to rotate the image clockwise. This can be an integer
   * in a range from 0 to 359. Alternatively, you can set the degree to `exif`
   * and the image will be rotated based upon any exif metadata it may contain.
   * @param options.exif
   * Sets the EXIF orientation of the image to EXIF orientation 1. The
   * `exif: false` parameter takes an image and sets the exif orientation to the
   * first of the eight EXIF orientations. The image will behave as though it is
   * contained in an html img tag if displayed in an application that supports
   * EXIF orientations.
   * @param options.background
   * Sets the background color to display if the image is rotated less than a
   * full 90 degrees. This can be the word for a color, or the hex color code.
   * List of accepted color names:
   * https://www.filestack.com/docs/image-transformations/colors.
   */
  rotate(options: {
    deg?: number | 'exif';
    exif?: boolean;
    background?: string;
  }): AssetURLBuilder {
    const {deg, exif, background} = options;
    const rotate = [];

    deg !== undefined && rotate.push(`d:${deg}`);
    exif !== undefined && rotate.push(`e:${exif}`);
    background !== undefined && rotate.push(`b:${background}`);

    return new AssetURLBuilder([...this._parts, `rotate=${rotate.join(',')}`]);
  }

  /** Reflect the image in the vertical direction. */
  flip(): AssetURLBuilder {
    return new AssetURLBuilder([...this._parts, 'flip']);
  }

  /** Reflect the image in the horizontal direction. */
  flop(): AssetURLBuilder {
    return new AssetURLBuilder([...this._parts, 'flop']);
  }

  /**
   * You can add watermarks to images by overlaying another image on top of your
   * main image.
   * https://docs.graphcms.com/developers/assets/transformations/watermark
   *
   * @param options.file
   * The file handle of the image that you want to layer on top of another
   * image as a watermark.
   * @param options.size
   * The size of the overlaid image as a percentage of its original size. The
   * value must be an integer between 1 and 500.
   * @param options.position The position of the overlaid image.
   */
  watermark(options: {
    file: string;
    size: number;
    position?:
      | 'left'
      | 'center'
      | 'right'
      | 'top'
      | 'middle'
      | 'bottom'
      | ['top' | 'middle' | 'bottom', 'left' | 'center' | 'right'];
  }): AssetURLBuilder {
    const {file, position, size} = options;
    const watermark = [`f:${file}`, `s:${size}`];

    if (position !== undefined) {
      watermark.push(
        `a:${Array.isArray(position) ? `[${position.join(',')}]` : position}`,
      );
    }

    return new AssetURLBuilder([
      ...this._parts,
      `watermark=${watermark.join(',')}`,
    ]);
  }

  /**
   * Convert the image to a specific file type.
   * https://docs.graphcms.com/developers/assets/transformations/filetype-conversions
   *
   * @param options.format
   * The format to which you would like to convert the file.
   * @param options.background
   * Set a background color when converting transparent .png files into other
   * file types. The default background when converting a transparent png file
   * is white. The background parameter allows you to control the background
   * color of the returned file. The background value can be the name of a
   * color or a hex color code. List of accepted color names:
   * https://www.filestack.com/docs/image-transformations/colors.
   * @param options.compress
   * You can take advantage of Filestack's image compression which utilizes
   * JPEGtran and OptiPNG. Compression is off/false by default.
   * @param options.quality
   * You can change the quality (and reduce the file size) of JPEG images by
   * using the quality parameter. The value for this parameter must be an
   * integer between 1 and 100. The quality is set to 100 by default. A
   * quality setting of 80 provides a nice balance between file size reduction
   * and image quality. If the quality is instead set to "input" the image
   * will not be recompressed and the input compression level of the jpg will
   * be used.
   * @param options.strip
   * This parameter will remove any metadata embedded in an image.
   * @param options.colorspace
   * By default all images are converted to RGB. The original colorspace can
   */
  output(options: {
    format?: 'jpg' | 'odp' | 'ods' | 'odt' | 'pdf' | 'png' | 'svg' | 'webp';
    background?: string;
    compress?: boolean;
    quality?: number | 'input';
    strip?: boolean;
    colorspace?: 'RGB' | 'CMYK' | 'Input';
  }): AssetURLBuilder {
    const {format, background, compress, quality, strip, colorspace} = options;

    const output = [`f:${format}`];

    background !== undefined && output.push(`b:${background}`);
    compress !== undefined && output.push(`c:${compress}`);
    quality !== undefined && output.push(`q:${quality}`);
    strip !== undefined && output.push(`t:${strip}`);
    colorspace !== undefined && output.push(`o:${colorspace}`);

    return new AssetURLBuilder([...this._parts, `output=${output.join(',')}`]);
  }

  /**
   * Compress the asset using mozjpeg. For the best results, compress should be
   * the last task in your transformation chain.
   * https://docs.graphcms.com/developers/assets/transformations/compress
   *
   * @param options.metadata
   * By default the compress task will strip photo metadata out of the image
   * to reduce the file size. If you need to maintain the file metadata, you
   * can pass metadata:true in order to prevent the metadata from being
   * removed.
   * @param options.quality
   * options.quality Set the quality of your JPG or WEBP images without the
   * danger of possibly generating a larger file. Quality is a separate from
   * the quality parameter available in the output task, and operates
   * differently in that it will never increase the size of a file.
   * https://docs.graphcms.com/developers/assets/transformations/change-quality
   */
  compress(
    options: {metadata?: boolean; quality?: number} = {},
  ): AssetURLBuilder {
    const {metadata, quality} = options;
    let compress = '';

    if (quality !== undefined) {
      compress += `quality=v:${quality}/`;
    }

    compress += 'compress';

    if (metadata !== undefined) {
      compress += `=m:${metadata}`;
    }

    return new AssetURLBuilder([...this._parts, compress]);
  }

  /**
   * Get the configured url as a string.
   * @param handle The handle of a GraphCMS image asset.
   */
  build(handle: string) {
    return [...this._parts, handle].join('/');
  }
}

/**
 * Extract the raw asset handle from a GraphCMS image asset url.
 */
export function parseAssetURL(url: string): string | void {
  const match = /\/([a-zA-Z0-9]{20})$/.exec(url);
  if (match) {
    return match[1];
  }
}
