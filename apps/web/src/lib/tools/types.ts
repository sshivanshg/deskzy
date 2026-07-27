export type ProcessResult = {
  blob: Blob;
  filename: string;
  meta?: Record<string, string | number>;
};

export type TextResult = {
  text: string;
  meta?: Record<string, string | number>;
  download?: { blob: Blob; filename: string };
};
