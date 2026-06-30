declare module 'pdfkit' {
  import { Readable } from 'stream';

  interface PDFDocumentOptions {
    autoFirstPage?: boolean;
    size?: string | [number, number];
    margin?: number;
    margins?: { top?: number; bottom?: number; left?: number; right?: number };
    info?: {
      Title?: string;
      Author?: string;
      Subject?: string;
      Keywords?: string;
      CreationDate?: Date;
      ModDate?: Date;
    };
    bufferPages?: boolean;
    compress?: boolean;
  }

  interface FontOptions {
    family?: string;
    name?: string;
    size?: number;
    options?: {
      lineBreak?: boolean;
      features?: string[];
    };
  }

  class PDFDocument extends Readable {
    constructor(options?: PDFDocumentOptions);

    pipe<T extends NodeJS.WritableStream>(destination: T): T;
    end(): void;
    flushPages(): void;

    // Page
    addPage(options?: PDFDocumentOptions): PDFDocument;
    bufferedPageRange(): { start: number; count: number };
    switchToPage(pageNumber?: number): PDFDocument;

    // Font
    font(name: string | FontOptions): PDFDocument;
    fontSize(size: number): PDFDocument;

    // Text
    text(text: string, x?: number, y?: number, options?: {
      align?: string;
      width?: number;
      height?: number;
      ellipsis?: boolean | string;
      columns?: number;
      columnGap?: number;
      indent?: number;
      paragraphGap?: number;
      lineGap?: number;
      wordSpacing?: number;
      characterSpacing?: number;
      fill?: boolean;
      stroke?: boolean;
      link?: string;
      underline?: boolean;
      strike?: boolean;
      oblique?: boolean | number;
      baseline?: number | string;
      continued?: boolean;
      features?: string[];
    }): PDFDocument;
    moveDown(rows?: number): PDFDocument;
    moveUp(rows?: number): PDFDocument;

    // Graphics
    lineWidth(width: number): PDFDocument;
    lineCap(cap: string): PDFDocument; // 'butt', 'round', 'square'
    lineJoin(join: string): PDFDocument; // 'miter', 'round', 'bevel'
    miterLimit(limit: number): PDFDocument;
    lineDash(length: number, options?: { space?: number; phase?: number }): PDFDocument;
    dash(pattern: number[], options?: { space?: number; phase?: number }): PDFDocument;
    undash(): PDFDocument;

    // Shapes
    moveTo(x: number, y: number): PDFDocument;
    lineTo(x: number, y: number): PDFDocument;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): PDFDocument;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): PDFDocument;
    arc(x: number, y: number, radius: number, startAngle?: number, endAngle?: number, counterclockwise?: boolean): PDFDocument;
    circle(x: number, y: number, radius: number): PDFDocument;
    ellipse(x: number, y: number, r1: number, r2?: number): PDFDocument;
    rectangle(x: number, y: number, width: number, height: number, options?: {
      lineWidth?: number;
      lineCap?: string;
      lineJoin?: string;
      miterLimit?: number;
      dash?: number[];
      fill?: string | boolean;
      stroke?: string | boolean;
    }): PDFDocument;
    roundRect(x: number, y: number, width: number, height: number, radius: number, options?: {
      lineWidth?: number;
      fill?: string | boolean;
      stroke?: string | boolean;
    }): PDFDocument;
    polygon(...points: [number, number][]): PDFDocument;
    path(pathString: string): PDFDocument;

    // Path operations
    closePath(): PDFDocument;
    moveEnd(): PDFDocument;
    moveStart(): PDFDocument;
    closeComboPath(): PDFDocument;

    // Path drawing shortcuts
    stroke(): PDFDocument;
    fill(fillRule?: string): PDFDocument;
    fillAndStroke(fillRule?: string): PDFDocument;
    clip(fillRule?: string): PDFDocument;

    // Rectangles shortcuts
    strokeRect(x: number, y: number, width: number, height: number): PDFDocument;
    fillRect(x: number, y: number, width: number, height: number): PDFDocument;
    clearRect(x: number, y: number, width: number, height: number): PDFDocument;

    // Images
    image(src: string | Buffer, options?: {
      fit?: [number, number];
      align?: string;
      valign?: string;
      cover?: [number, number];
      coverGravity?: string;
      width?: number;
      height?: number;
      scale?: number;
      dpi?: number;
      compress?: boolean;
    }): PDFDocument;

    // Annotations
    link(x: number, y: number, width: number, height: number, url: string): PDFDocument;
    textLink(x: number, y: number, width: number, height: number, text: string, options?: object): PDFDocument;
    highlight(x: number, y: number, width: number, height: number, options?: object): PDFDocument;
    underline(x: number, y: number, width: number, height: number, options?: object): PDFDocument;
    strike(x: number, y: number, width: number, height: number, options?: object): PDFDocument;

    // Layout
    switchToPage(pageNumber: number): PDFDocument;
    addPage(options?: PDFDocumentOptions): PDFDocument;

    // Metadata
    readonly page: {
      width: number;
      height: number;
      margins: { top: number; left: number; bottom: number; right: number };
    };
  }

  export = PDFDocument;
}
