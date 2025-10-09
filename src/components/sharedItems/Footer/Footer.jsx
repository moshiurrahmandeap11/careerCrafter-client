import React from 'react';
import { Link } from 'react-router';
import { Briefcase, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Career Crafter</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Building careers, shaping futures. Your journey to professional success starts here with personalized job matching and career guidance.
            </p>
            <div className="flex items-center text-slate-400 text-sm">
              <Heart className="w-4 h-4 text-red-400 mr-1" />
              <span>Made with passion for job seekers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Find Jobs', path: '/jobs' },
                { name: 'Browse Companies', path: '/companies' },
                { name: 'Career Advice', path: '/cc/learn' },
                { name: 'Success Stories', path: '/success-stories' },
                { name: 'Pricing', path: '/premium' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', path: '/help' },
                { name: 'Community', path: '/community' },
                { name: 'Blog', path: '/blog' },
                { name: 'Resume Builder', path: '/ai-resume' },
                { name: 'Career Coach', path: '/ai-coach' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">support@careercrafter.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-red-400 mt-0.5" />
                <span className="text-slate-300 text-sm">
                  123 Career Street<br />
                  San Francisco, CA 94102
                <div className='flex items-center gap-2'>
                  <Link className='text-red-600 hover:underline' to={"/about"}>About</Link>
                  <Link className='text-red-600 hover:underline' to={"/contact"}>Contact</Link>
                </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-slate-400 text-sm">
              © {currentYear} Career Crafter. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Cookie Policy', path: '/cookies' }
              ].map((link) => (
                <Link 
                  key={link.name}
                  to={link.path}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;