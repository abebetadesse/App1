import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    {/* Hero */}
    <section className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
        <span className="gradient-text">Tham Platform</span>
        <br />
        <span className="text-gray-900 dark:text-white">Where Talent Meets AI</span>
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
        Connect with top professionals using AI‑powered matching, secure payments, and integrated learning.
      </p>
      <div className="flex gap-4 justify-center">
        <Button to="/register" className="text-lg px-8 py-4">Get Started <ArrowRight className="ml-2" size={20} /></Button>
        <Button variant="secondary" to="/browse" className="text-lg px-8 py-4">Browse Talent</Button>
      </div>
    </section>

    {/* Features */}
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: 'AI Matching', desc: 'Neural search finds perfect matches instantly.' },
          { icon: Shield, title: 'Secure Escrow', desc: 'Funds held safely until you approve.' },
          { icon: Users, title: 'Global Talent', desc: 'Access professionals worldwide.' },
        ].map((f, i) => (
          <Card key={i} className="text-center">
            <CardBody>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <f.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="container mx-auto px-4 py-20">
      <div className="glass-card rounded-3xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to transform your work?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Join thousands who have already elevated their freelance journey.</p>
        <Button to="/register" className="px-8 py-4">Sign Up Free →</Button>
      </div>
    </section>
  </div>
);
export default Home;
