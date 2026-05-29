/** PlayerNameInput — Accessible name input with glass style, label, focus ring */
import { useState } from 'react'

/** @param {{ onSubmit: (name: string) => void }} props */
export default function PlayerNameInput({ onSubmit }) {
  const [name, setName] = useState('')
  const trimmed = name.trim()

  function handleSubmit(e) {
    e.preventDefault()
    if (trimmed.length > 0) onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <label htmlFor="player-name" className="sr-only">Tu nombre</label>
      <input
        id="player-name"
        type="text"
        placeholder="Tu nombre..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={30}
        autoFocus
        autoComplete="off"
        className="
          w-full px-5 py-4 rounded-2xl text-center text-xl text-white
          bg-white/10 backdrop-blur-md
          border border-white/20
          placeholder-white/30
          min-h-[56px]
          focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50
          transition-all duration-200
        "
      />
      <button
        type="submit"
        disabled={trimmed.length === 0}
        className="
          w-full py-4 rounded-2xl min-h-[60px]
          text-white text-xl font-black tracking-wide
          bg-gradient-to-r from-emerald-500 to-emerald-400
          hover:from-emerald-400 hover:to-emerald-300
          shadow-[0_4px_20px_rgba(16,185,129,0.35)]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
          active:scale-[0.98]
          transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-emerald-400/60
        "
      >
        ¡Jugar!
      </button>
    </form>
  )
}
