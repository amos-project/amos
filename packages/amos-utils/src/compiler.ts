/*
 * @since 2024-10-24 15:37:40
 * @author junbao <junbao@moego.pet>
 */

export type TypeFormat =
  | 'original'
  | 'lowerCamelCase'
  | 'UpperCamelCase'
  | 'lower_underscore'
  | 'UPPER_UNDERSCORE';

export interface TransformerOptions {
  prefix?: string;
  format?: TypeFormat;
}

export function formatType(type: string, format: TypeFormat) {
  switch (format) {
    case 'lower_underscore':
      return type
        .replace(/([A-Z]+)/g, ($0, $1) => '_' + $1.toLowerCase())
        .replace(/^_+/, '')
        .replace(/_+/, '_');
    case 'UPPER_UNDERSCORE':
      return type
        .replace(/([A-Z]+)/g, ($0, $1) => '_' + $1)
        .replace(/^_+/, '')
        .replace(/_+/, '_')
        .toUpperCase();
    case 'lowerCamelCase':
      return type
        .replace(/_(.)/g, ($0, $1) => $1.toUpperCase())
        .replace(/^./, ($0) => $0.toLowerCase());
    case 'UpperCamelCase':
      return type
        .replace(/_(.)/g, ($0, $1) => $1.toUpperCase())
        .replace(/^./, ($0) => $0.toUpperCase());
    default:
      return type;
  }
}
