"use client"

import { useEffect, useState } from "react"
import { Music2 } from "lucide-react"

// Simulated now-playing — replace with real Spotify API integration
// by adding SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN env vars
// and a /api/spotify route that calls the Spotify Web API
const MOCK_TRACKS = [
  { name: "Blinding Lights", artist: "The Weeknd", playing: true },
  { name: "As It Was", artist: "Harry Styles", playing: false },
  { name: "Levitating", artist: "Dua Lipa", playing: false },
]

export function SpotifyNowPlaying() {
  const [track] = useState(MOCK_TRACKS[0])
  const [bars, setBars] = useState([3, 5, 2, 6, 4])

  useEffect(() => {
    if (!track.playing) return
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 6) + 1))
    }, 400)
    return () => clearInterval(interval)
  }, [track.playing])

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl w-fit">
      <div className="w-8 h-8 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center shrink-0">
        <Music2 className="w-4 h-4 text-[#1DB954]" />
      </div>
      {track.playing ? (
        <>
          <div className="flex items-end gap-0.5 h-5">
            {bars.map((h, i) => (
              <div key={i} className="w-1 bg-[#1DB954] rounded-full transition-all duration-300"
                style={{ height: `${h * 3}px` }} />
            ))}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{track.name}</p>
            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
          </div>
        </>
      ) : (
        <div>
          <p className="text-xs font-medium text-foreground">Not playing</p>
          <p className="text-xs text-muted-foreground">Spotify</p>
        </div>
      )}
    </div>
  )
}
