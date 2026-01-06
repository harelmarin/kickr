import { NextMatchesHomePage } from '../components/matchs/nextMatchsClient';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/img/hero.jpg"
            alt="Football stadium"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-overlay"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-primary opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-primary opacity-10 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center animate-fade-in-up">
          <div className="inline-block mb-6">
            <span className="badge badge-green text-sm">⚽ The Ultimate Football Rating Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display text-primary mb-6 leading-tight">
            Rate Every Match.
            <br />
            <span className="text-gradient-green">Build Your Legacy.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto mb-10 font-medium">
            Join thousands of football fans tracking matches, sharing ratings, and building their personal football diary.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn btn-primary text-lg px-8 py-4">
              <span>Get Started Free</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="btn btn-secondary text-lg px-8 py-4">
              Explore Matches
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            <div>
              <div className="text-4xl font-display text-green-bright mb-1">10K+</div>
              <div className="text-sm text-tertiary uppercase tracking-wide">Matches Rated</div>
            </div>
            <div>
              <div className="text-4xl font-display text-green-bright mb-1">500+</div>
              <div className="text-sm text-tertiary uppercase tracking-wide">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-display text-green-bright mb-1">50+</div>
              <div className="text-sm text-tertiary uppercase tracking-wide">Competitions</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="py-20 bg-secondary relative">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-green-bright text-sm font-semibold uppercase tracking-wider mb-3 block">
                Don't Miss Out
              </span>
              <h2 className="text-5xl md:text-6xl font-display text-primary mb-3">
                Upcoming Matches
              </h2>
              <p className="text-lg text-secondary">
                Rate the biggest games and share your opinions
              </p>
            </div>
            <button className="btn btn-secondary">
              View All Matches →
            </button>
          </div>
          
          <NextMatchesHomePage />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-bright text-sm font-semibold uppercase tracking-wider mb-3 block">
              Why Choose Kickr
            </span>
            <h2 className="text-5xl md:text-6xl font-display text-primary mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              The most complete platform for football match ratings and reviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-glass p-8 hover-lift group">
              <div className="w-14 h-14 bg-gradient-green rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display text-primary mb-3">Rate & Review</h3>
              <p className="text-secondary leading-relaxed">
                Share detailed ratings and reviews for every match. Build your credibility as a football analyst.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-glass p-8 hover-lift group">
              <div className="w-14 h-14 bg-gradient-red rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display text-primary mb-3">Follow Friends</h3>
              <p className="text-secondary leading-relaxed">
                See what your friends are watching and compare ratings. Discover new perspectives on matches.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-glass p-8 hover-lift group">
              <div className="w-14 h-14 bg-blue-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display text-primary mb-3">Track Stats</h3>
              <p className="text-secondary leading-relaxed">
                Keep a complete diary of every match you watch. Analyze your viewing patterns and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-green-primary opacity-5 blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-display text-primary mb-6">
            Ready to Start Rating?
          </h2>
          <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">
            Join our community of passionate football fans and never miss a match again.
          </p>
          <button className="btn btn-primary text-xl px-12 py-5 hover-glow-green">
            Create Free Account
          </button>
          <p className="text-sm text-muted mt-6">
            No credit card required • Free forever
          </p>
        </div>
      </section>
    </main>
  );
}
