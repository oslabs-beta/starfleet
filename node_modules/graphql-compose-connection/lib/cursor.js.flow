/* @flow */

export type CursorDataType =
  | {
      [fieldName: string]: any,
    }
  | any;

export function base64(i: string): string {
  return Buffer.from(i, 'ascii').toString('base64');
}

export function unbase64(i: string): string {
  return Buffer.from(i, 'base64').toString('ascii');
}

export function cursorToData(cursor?: string | mixed): CursorDataType | number | null {
  if (typeof cursor === 'string') {
    try {
      return JSON.parse(unbase64(cursor)) || null;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export function dataToCursor(data: CursorDataType | number): string {
  return base64(JSON.stringify(data));
}
