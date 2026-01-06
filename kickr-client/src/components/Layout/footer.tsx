export const Footer = () => {
  return (
    <footer className="bg-[#1b2228] border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">⚽</span>
              <span className="text-2xl font-black font-display tracking-tighter text-white">KICKR</span>
            </div>
            <p className="text-[#99aabb] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Social network for football fans.
            </p>
            <p className="text-[#667788] text-sm leading-relaxed">
              Track matches you've watched. Save those you want to see. Tell your friends what's good.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <FooterCol title="Platform" links={[
              { label: 'Matches', to: '/matches' },
              { label: 'Leagues', to: '/competitions' },
              { label: 'Clubs', to: '/teams' },
            ]} />
            <FooterCol title="Support" links={[
              { label: 'Help', to: '/help' },
              { label: 'Terms', to: '/terms' },
              { label: 'Privacy', to: '/privacy' },
            ]} />
            <FooterCol title="Socials" links={[
              { label: 'Twitter', to: '#' },
              { label: 'Instagram', to: '#' },
              { label: 'Github', to: '#' },
            ]} />
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#445566] text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Kickr. Performance data provided by Football API.
          </p>
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#445566]">
            Made with <span className="text-[var(--color-primary)] px-1">⚽</span> in the digital stadium
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, links }: { title: string; links: { label: string; to: string }[] }) => (
  <div>
    <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] mb-6">{title}</h4>
    <ul className="space-y-3">
      {links.map(link => (
        <li key={link.label}>
          <a href={link.to} className="text-[#99aabb] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);