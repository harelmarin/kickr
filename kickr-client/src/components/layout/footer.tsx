import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export const Footer = () => {
  return (
    <footer className="bg-[#0a0b0d] border-t border-white/[0.03] py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">

          {/* Brand & Mission (Minimal) */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <img
                src={logo}
                alt="Logo"
                className="w-6 h-6 object-contain mix-blend-screen brightness-110 grayscale group-hover:grayscale-0 transition-all"
              />
              <span className="text-xl font-black italic tracking-tighter text-white display-font group-hover:text-kickr transition-colors">KICKR</span>
            </Link>
            <p className="text-[#445566] text-[9px] font-black uppercase tracking-[0.3em] leading-relaxed text-center md:text-left">
              The Sound of Modern Football Culture
            </p>
          </div>

          {/* Navigation Links (Minimalist Grid) */}
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            <FooterLink label="Matches" to="/matches" />
            <FooterLink label="Leagues" to="/competitions" />
            <FooterLink label="Tacticians" to="/community" />
            <FooterLink label="About" to="/about" />
            <FooterLink label="Terms" to="/terms" />
          </nav>

          {/* Dev / Admin Access (Ultra Discreet) */}
          <div className="flex items-center gap-6">
            <button
              onClick={async () => {
                if (window.confirm("FATAL ACTION: Reset all test data?")) {
                  try {
                    const { userMatchService } = await import('../../services/usermatchservice');
                    await userMatchService.resetTestData();
                    window.location.href = '/';
                  } catch (e) { console.error(e); }
                }
              }}
              className="w-1.5 h-1.5 rounded-full bg-white/5 hover:bg-red-500/50 transition-colors cursor-pointer"
              title="Reset Database"
            />
            <div className="text-[10px] font-black text-[#223344] uppercase tracking-widest cursor-default select-none">
              v0.1.0-KICK
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#445566] text-[9px] font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Kickr. Performance data by Football API.
          </p>

          <div className="flex items-center gap-8">
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
    className="text-[#667788] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] relative group"
  >
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-kickr group-hover:w-full transition-all duration-300"></span>
  </Link>
);

const SocialIcon = ({ icon, href }: { icon: string; href: string }) => (
  <a
    href={href}
    className="text-[#334455] hover:text-white transition-colors duration-300 text-xs grayscale hover:grayscale-0"
  >
    {icon}
  </a>
);