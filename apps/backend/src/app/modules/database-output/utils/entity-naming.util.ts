export function pascalCaseFromSnake(name: string): string {
  return name
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('');
}

export function camelCaseFromSnake(name: string): string {
  const p = pascalCaseFromSnake(name);
  return p.charAt(0).toLowerCase() + p.slice(1);
}
