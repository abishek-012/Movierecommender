import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchHero({ onSearch }) {
  const [q, setQ] = useState("");

  const submit = (e) => {
    e && e.preventDefault();
    if (!q.trim()) return;
    onSearch(q.trim());
  };

  return (
    <section className="w-full py-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white/95 mb-6">
          AI-POWERED DISCOVERY
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-white leading-tight">
          Find your next <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">obsession.</span>
        </h1>

        <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
          Discover movies tailored to your unique taste. From hidden indie gems to blockbusters, we curate the cinematic universe just for you.
        </p>

        <form onSubmit={submit} className="mt-10">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center text-white/60">
              <Search size={18} />
            </div>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies, directors, or genres..."
              className="w-full pl-12 pr-28 py-5 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 text-white placeholder-white/50 shadow-[0_10px_40px_rgba(203,16,159,0.18)] focus:outline-none"
            />

            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-400 text-white px-6 py-2 rounded-full font-medium shadow-lg"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-3 text-white/70 text-sm">
          <span className="mr-2">Trending:</span>
          <div className="px-3 py-1 bg-white/5 rounded-full">Sci-Fi</div>
          <div className="px-3 py-1 bg-white/5 rounded-full">Christopher Nolan</div>
          <div className="px-3 py-1 bg-white/5 rounded-full">Noir</div>
          <div className="px-3 py-1 bg-white/5 rounded-full">Anime</div>
        </div>
      </div>
    </section>
  );
}
