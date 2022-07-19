export const endsWith = (str: string, suffix: string): boolean => {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}