type HAlign = 'left' | 'right';
type VAlign = 'top' | 'bottom';

type ResizeDimensions =
  | {width: number; height?: number}
  | {width?: number; height: number};

type Resize = ResizeDimensions & {
  type: 'resize';
  fit?: 'clip' | 'crop' | 'scale' | 'max';
  align?: HAlign | VAlign | [VAlign, HPosition] | 'center' | 'faces';
};

interface Crop {
  type: 'crop';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Rotate {
  type: 'rotate';
  deg?: number;
  exif?: boolean;
  background?: string;
}

interface Flip {
  type: 'flip';
}

interface Flop {
  type: 'flop';
}

type HPosition = 'left' | 'center' | 'right';
type VPosition = 'top' | 'middle' | 'bottom';

interface Watermark {
  type: 'watermark';
  file: string;
  size: number;
  position?: HPosition | VPosition | [VPosition, HPosition];
}

interface Output {
  type: 'output';
  format?: 'jpg' | 'odp' | 'ods' | 'odt' | 'pdf' | 'png' | 'svg' | 'webp';
  background?: string;
  compress?: boolean;
  quality?: number;
  strip?: boolean;
  colorspace?: 'RGB' | 'CMYK' | 'Input';
}

interface Compress {
  type: 'compress';
  metadata?: boolean;
  quality?: number;
}

export type Transform =
  | Resize
  | Crop
  | Rotate
  | Flip
  | Flop
  | Watermark
  | Output
  | Compress;

export function formatAssetURL(handle: string, transform: Transform[] = []) {
  return [
    'https://media.graphcms.com',
    ...transform.map((t): string => {
      switch (t.type) {
        case 'resize': {
          const resize = [];

          t.width !== undefined && resize.push(`w:${t.width}`);
          t.height !== undefined && resize.push(`h:${t.height}`);
          t.fit !== undefined && resize.push(`f:${t.fit}`);
          t.align !== undefined &&
            resize.push(
              `a:${
                Array.isArray(t.align) ? `[${t.align.join(',')}]` : t.align
              }`,
            );

          return `resize=${resize.join(',')}`;
        }
        case 'crop':
          return `crop=d[${t.x},${t.y},${t.width},${t.height}]`;
        case 'rotate': {
          const rotate = [];

          t.deg !== undefined && rotate.push(`d:${t.deg}`);
          t.exif !== undefined && rotate.push(`e:${t.exif}`);
          t.background !== undefined && rotate.push(`b:${t.background}`);

          return `rotate=${rotate.join(',')}`;
        }
        case 'flip':
          return 'flip';
        case 'flop':
          return 'flop';
        case 'watermark': {
          const watermark = [`f:${t.file}`, `s:${t.size}`];

          t.position !== undefined &&
            watermark.push(
              `a:${
                Array.isArray(t.position)
                  ? `[${t.position.join(',')}]`
                  : t.position
              }`,
            );

          return `watermark=${watermark.join(',')}`;
        }
        case 'output': {
          const output = [`f:${t.format}`];

          t.background !== undefined && output.push(`b:${t.background}`);
          t.compress !== undefined && output.push(`c:${t.compress}`);
          t.quality !== undefined && output.push(`q:${t.quality}`);
          t.strip !== undefined && output.push(`t:${t.strip}`);
          t.colorspace !== undefined && output.push(`o:${t.colorspace}`);

          return `output=${output.join(',')}`;
        }
        case 'compress': {
          let compress = 'compress';
          if (t.metadata !== undefined) {
            compress += `=m:${t.metadata}`;
          }
          if (t.quality !== undefined) {
            compress += `/quality=v:${t.quality}`;
          }
          return compress;
        }
      }
    }),
    handle,
  ].join('/');
}

export function parseAssetURL(url: string) {
  const match = /\/([a-zA-Z0-9]{20})$/.exec(url);
  if (match) {
    return match[1];
  }
}
