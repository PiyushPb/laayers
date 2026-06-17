"use client";

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          {/* Logo brand info column */}
          <div className="col-span-2 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded-sm" />
              <span className="font-display font-bold text-base tracking-tight text-white">
                Laayers
              </span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
              Enterprise-grade edge caching and API orchestration. Distributed globally, synchronized locally.
            </p>
          </div>

          {/* Links Column 1: Platform */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              Platform
            </span>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <a href="#platform" className="hover:text-white transition-colors focus:outline-none">Features</a>
              <a href="#infrastructure" className="hover:text-white transition-colors focus:outline-none">Infrastructure</a>
              <a href="#integrations" className="hover:text-white transition-colors focus:outline-none">Integrations</a>
              <a href="#pricing" className="hover:text-white transition-colors focus:outline-none">Pricing</a>
            </div>
          </div>

          {/* Links Column 2: Developers */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              Developers
            </span>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <a href="#docs" className="hover:text-white transition-colors focus:outline-none">Documentation</a>
              <a href="#sdk" className="hover:text-white transition-colors focus:outline-none">SDK Repos</a>
              <a href="#changelog" className="hover:text-white transition-colors focus:outline-none">Changelog</a>
              <a href="#status" className="hover:text-white transition-colors focus:outline-none">System Status</a>
            </div>
          </div>

          {/* Links Column 3: Trust */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              Trust & Legal
            </span>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
              <a href="#security" className="hover:text-white transition-colors focus:outline-none">Security Portal</a>
              <a href="#soc2" className="hover:text-white transition-colors focus:outline-none">SOC 2 Report</a>
              <a href="#privacy" className="hover:text-white transition-colors focus:outline-none">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors focus:outline-none">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Bottom Metadata bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">
              System status: Operational
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[9px] text-zinc-500">
            <span>laayers-mesh v2.4.12</span>
            <span>&copy; {new Date().getFullYear()} Laayers Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
