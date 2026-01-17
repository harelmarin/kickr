import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#14181c] border-t border-white/5 py-8 md:py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">

          {/* Brand & Mission (Minimal) */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center group mb-2 md:mb-4">
              <span className="text-lg md:text-xl font-black italic tracking-tighter text-white/90 display-font group-hover:text-kickr transition-colors">KICKR</span>
            </Link>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed text-center md:text-left">
              The Sound of Modern Football Culture
            </p>
          </div>

          {/* Navigation Links (Minimalist Grid) */}
          <nav className="flex flex-wrap justify-center gap-x-6 md:gap-x-10 gap-y-3">
            <FooterLink label="Matches" to="/matches" />
            <FooterLink label="Leagues" to="/competitions" />
            <FooterLink label="Tacticians" to="/community" />
            <FooterLink label="About" to="/about" />
            <FooterLink label="Terms" to="/terms" />
          </nav>

          {/* Dev / Admin Access (Ultra Discreet) */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={async () => {
                if (window.confirm("FATAL ACTION: Reset all test data?")) {
                  try {
                    const { userMatchService } = await import('../../services/userMatchService');
                    await userMatchService.resetTestData();
                    window.location.href = '/';
                  } catch (e) { console.error(e); }
                }
              }}
              className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white/5 hover:bg-red-500/50 transition-colors cursor-pointer"
              title="Reset Database"
            />
            <div className="text-[8px] md:text-[10px] font-black text-white/10 md:text-white/20 uppercase tracking-widest cursor-default select-none">
              v0.1.0-KICK
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] text-center md:text-left">
            © {new Date().getFullYear()} Kickr. Intelligence by Football API.
          </p>

          <div className="flex items-center gap-6 md:gap-8">
            <SocialIcon icon="𝕏" href="#" />
            <SocialIcon icon="" href="#" />
            <SocialIcon icon="" href="#" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ label, to }: { label: string; to: string }) => (
  <Link
    to={to}
    className="text-white/40 hover:text-white/80 transition-all duration-300 text-[11px] font-black uppercase tracking-[0.2em] relative group"
  >
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-kickr group-hover:w-full transition-all duration-300"></span>
  </Link>
);

const SocialIcon = ({ icon, href }: { icon: string; href: string }) => (
  <a
    href={href}
    className="text-white/40 hover:text-white transition-colors duration-300 text-[10px] md:text-xs grayscale hover:grayscale-0"
  >
    {icon}
  </a>
);