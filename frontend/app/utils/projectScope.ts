export interface ProjectScoped {
  projectId: string
}

export function filterByProject<T extends ProjectScoped>(
  items: T[],
  projectId: string,
): T[] {
  return items.filter(item => item.projectId === projectId)
}
