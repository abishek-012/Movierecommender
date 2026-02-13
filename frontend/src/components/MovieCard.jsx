export default function MovieCard({ movie }) {
  return (
    <div className="group relative">
      <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-800 to-neutral-900 h-72 flex items-center justify-center">
        <div className="w-3/4 h-5/6 rounded-lg border border-white/5 bg-neutral-800 flex items-center justify-center text-white/20">
          Poster
        </div>
        <div className="absolute -top-3 right-3 bg-white/5 text-white px-3 py-1 rounded-full text-xs">{movie.rating}</div>
      </div>

      <div className="mt-4">
        <h3 className="text-white font-semibold text-lg">{movie.title}</h3>
        <p className="text-sm text-white/60 mt-1">{movie.year} • {movie.genres}</p>
      </div>
    </div>
  );
}
