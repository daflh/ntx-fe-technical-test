// DEMO ONLY: in-memory, per-process storage - resets whenever the server
// restarts, and doesn't survive multiple server instances. A real backend
// would persist this in a database keyed by user id.
const favoritesByUser = new Map<number, Set<number>>()

function getSet(userId: number): Set<number> {
  let set = favoritesByUser.get(userId)
  if (!set) {
    set = new Set()
    favoritesByUser.set(userId, set)
  }
  return set
}

export function listFavorites(userId: number): number[] {
  return [...getSet(userId)]
}

export function addFavorite(userId: number, animeId: number): void {
  getSet(userId).add(animeId)
}

export function removeFavorite(userId: number, animeId: number): void {
  getSet(userId).delete(animeId)
}

export function countAllFavorites(): number {
  let total = 0
  for (const set of favoritesByUser.values()) total += set.size
  return total
}
