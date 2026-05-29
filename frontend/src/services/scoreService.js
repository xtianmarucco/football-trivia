// scoreService.js — All API calls related to player scores (rule 10)
// Returns { data, error } — never throws to the caller

const BASE_URL = import.meta.env.VITE_API_URL

/**
 * @param {string} name
 * @param {number} score
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function postScore(name, score) {
  try {
    const res = await fetch(`${BASE_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    })
    const json = await res.json()
    if (!json.success) return { data: null, error: json.error ?? 'Error al guardar' }
    return { data: json.data, error: null }
  } catch {
    return { data: null, error: 'No se pudo conectar con el servidor' }
  }
}

/**
 * @returns {Promise<{ data: object[], error: string|null }>}
 */
export async function getLeaderboard() {
  try {
    const res = await fetch(`${BASE_URL}/scores/leaderboard`)
    const json = await res.json()
    if (!json.success) return { data: [], error: json.error ?? 'Error al cargar' }
    return { data: json.data, error: null }
  } catch {
    return { data: [], error: 'No se pudo conectar con el servidor' }
  }
}
