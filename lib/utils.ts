import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import ms from 'ms';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return 'never';
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
timeOnly ? '' : ' ago'
}`;
};

export const wrap = <T, R>(fn: (value: T) => R) => (
  result: Result<T>,
): Result<R> =>
  result.ok === true ? { ok: true, value: fn(result.value) } : result;

export const isGqlError = (value: unknown): value is { errors: { message: string }[] } => {
  return typeof value === "object" && value !== null && "errors" in value;
}

export const transformObject = (obj: Record<string, any> | Record<string, any>[]): Record<string, any> => {
  if (!obj || ["string", "boolean", "number"].includes(typeof obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return (obj as Record<string, any>[]).map(transformObject);
  } else if (obj.hasOwnProperty('edges')) {
    return obj.edges.map((edge: Record<string, any>) => transformObject(edge.node));
  }

  return Object.keys(obj).reduce((result: Record<string, any>, key) => {
    result[key] = transformObject(obj[key]);
    return result;
  }, {});
}

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

