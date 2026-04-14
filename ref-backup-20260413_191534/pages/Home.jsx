import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import heroImage from '../assets/hero.png';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-32">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Tham Platform
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Where Talent Meets Opportunity
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Connect with top freelancers across any domain. AI-powered matching, secure payments, and integrated learning to accelerate your career or project.
              </p>
              <div className="flex flex-wrap gap-4">
                {!user ? (
                  <>
                    <Link to="/register" className="btn-primary text-lg px-8 py-3">
                      Get Started → 
                    </Link>
                    <Link to="/browse" className="btn-secondary text-lg px-8 py-3">
                      Browse Talent
                    </Link>
                  </>
                ) : (
                  <Link to={user.role === 'client' ? '/client/dashboard' : '/profile-owner/dashboard'} 
                        className="btn-primary text-lg px-8 py-3">
                    Go to Dashboard →
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-indigo-700">
                      {String.fromCharCode(64+i)}
                    </div>
                  ))}
                </div>
                <span>Join 10,000+ professionals</span>
              </div>
            </div>
            <div className="relative">
              <img src={heroImage} alt="Platform illustration" className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Tham?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with robust tools to deliver an unmatched freelance experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', title: 'AI-Powered Matching', desc: 'Our neural search finds the perfect talent or project for you.' },
              { icon: '🔒', title: 'Secure Escrow', desc: 'Funds are held safely until you approve the work.' },
              { icon: '📚', title: 'Integrated Learning', desc: 'Boost your ranking with certified courses from Moodle.' },
            ].map((f, i) => (
              <div key={i} className="card p-8 text-center">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Work?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands who have already elevated their freelance journey.</p>
          {!user && (
            <Link to="/register" className="inline-block bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg text-lg transition-colors">
              Sign Up Free →
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
