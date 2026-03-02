import Link from 'next/link';
import { Compass, Home, Map } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>
      <div className="max-w-2xl w-full flex flex-col items-center text-center relative z-10">
        <div className="relative mb-8 group cursor-pointer">
          <div className="absolute -inset-4 bg-indigo-100/50 rounded-full animate-pulse transition-all group-hover:scale-110" />
          <div className="bg-white p-5 rounded-full shadow-2xl shadow-indigo-500/20 border border-indigo-50 relative z-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105">
            <Compass className="w-16 h-16 text-indigo-600 drop-shadow-sm" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 text-white rounded-full shadow-lg z-20 transition-transform duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1">
            <div className="bg-violet-100 p-1.5 rounded-full">
              <Map className="w-4 h-4 text-violet-600" />
            </div>
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-br from-indigo-600 via-violet-600 to-indigo-800 mb-4 drop-shadow-sm tracking-tighter">
          404
        </h1>        
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
          Looks like you&apos;re off the map!
        </h2>
        <p className="text-base md:text-lg text-slate-500 max-w-xl mb-8 leading-relaxed">
          The territory you&apos;re looking for remains uncharted. Let&apos;s get you back to familiar lands before you get completely lost.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto px-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/20 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-base hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
          >
            <Map className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
