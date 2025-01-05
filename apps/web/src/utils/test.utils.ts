export function replacer(key: any, value: any) {
  return value === undefined ? null : value;
}