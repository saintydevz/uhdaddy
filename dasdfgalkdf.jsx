import React, { useEffect, useState, useRef } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { motion } from 'framer-motion';

// SafeHaven — now fetches executor data from GitHub JSON
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/username/safehaven-executors/main/executors.json';

export default function SafeHaven() {
  const [executors, setExecutors] = useState([]);
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [selected, setSelected] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const particlesRef = useRef(null);

  const TAGS = ['all','android','ios','mac','windows'];

  useEffect(() => {
    fetch(GITHUB_JSON_URL)
      .then(res => res.json())
      .then(data => {
        setExecutors(data);
        setFiltered(data);
      })
      .catch(err => console.error('Failed to fetch executors:', err));
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    const list = executors.filter(e => {
      if (tag !== 'all' && !e.platforms.includes(tag)) return false;
      if (!q) return true;
      return [e.name, e.description, ...(e.tags||[])].join(' ').toLowerCase().includes(q);
    });
    setFiltered(list);
  }, [query, tag, executors]);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  function StatusPill({ detected }){
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${detected ? 'bg-red-600/90 text-white ring-1 ring-red-400/20' : 'bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/10'}`}>
        <span className={`w-2 h-2 rounded-full ${detected ? 'bg-red-400' : 'bg-emerald-300'}`} />
        {detected ? 'Detected' : 'Undetected'}
      </span>
    );
  }

  function Platform({ name, info }){
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-b from-white/3 to-white/2/ backdrop-blur-md border border-white/5">
        <div className={`w-2 h-2 rounded-full ${info.online ? 'bg-emerald-300' : 'bg-slate-600'}`} />
        <div className="text-xs">
          <div className="font-medium">{name.toUpperCase()}</div>
          <div className="text-xxs text-slate-400">{info.online ? 'Online' : 'Offline'}{info.note?` • ${info.note}`:''}</div>
        </div>
      </div>
    );
  }

  const Blob = ({ className='' }) => (
    <svg className={className} viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.85" />
        </linearGradient>
        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="60" />
        </filter>
      </defs>
      <g filter="url(#blur)">
        <path d="M421.6,329.6Q397.2,409.2,329.8,436.8Q262.3,464.5,183.1,434.3Q103.9,404,80.8,330.5Q57.7,257,120.6,202.8Q183.4,148.7,251.9,116.2Q320.5,83.7,378.2,118.3Q435.9,152.9,421.6,229.6Z" fill="url(#g1)" />
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#050007] text-slate-100 font-[Poppins] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -left-28 -top-24 opacity-90 w-[600px] h-[600px] transform-gpu animate-blob-slow"><Blob /></div>
        <div className="absolute -right-40 -bottom-28 opacity-85 w-[520px] h-[520px] transform-gpu animate-blob-slower"><Blob /></div>
      </div>

      <Particles id="sh-particles" init={particlesInit} options={{/* same options */}} className="absolute inset-0 -z-10" ref={particlesRef} />

      {/* ...rest of your header, search, grid, modal stays the same, but uses `filtered` state from GitHub JSON */}

    </div>
  );
}
