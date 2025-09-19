export function Operator<T extends string, V>(
  o: { operator: Uncapitalize<T> } & V
): { operator: T } & V {
  return o as { operator: T } & V
}
