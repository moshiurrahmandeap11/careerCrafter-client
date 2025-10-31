import { Helmet } from 'react-helmet-async';
import { Briefcase, Users, Rocket, Award, Target, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Active Users', value: '50,000+', icon: Users },
    { label: 'Jobs Posted', value: '10,000+', icon: Briefcase },
    { label: 'Success Stories', value: '5,000+', icon: Award },
    { label: 'AI Interactions', value: '100,000+', icon: Rocket }
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To democratize career growth by making professional networking and AI-powered career tools accessible to everyone, everywhere.'
    },
    {
      icon: Heart,
      title: 'Our Vision',
      description: 'A world where every professional has equal access to opportunities, guidance, and tools to build their dream career.'
    },
    {
      icon: Rocket,
      title: 'Our Values',
      description: 'Innovation, accessibility, transparency, and user-first approach drive everything we do at Career Crafter.'
    }
  ];

  const team = [
    {
      name: 'AI Job Matching',
      role: 'Intelligent algorithms match you with perfect opportunities',
      description: 'Our AI analyzes your skills, experience, and preferences to recommend jobs that truly fit your career goals.'
    },
    {
      name: 'Resume Builder',
      role: 'Create ATS-friendly resumes in minutes',
      description: 'Professional templates powered by AI help you build resumes that get past automated screening systems.'
    },
    {
      name: 'Career Mentor',
      role: 'Get personalized guidance 24/7',
      description: 'Our AI mentor provides career advice, interview tips, and skill recommendations tailored to your journey.'
    },
    {
      name: 'Professional Network',
      role: 'Connect with industry professionals',
      description: 'Build meaningful connections, share insights, and grow your professional network like LinkedIn.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Career Crafter | AI-Powered Professional Network</title>
        <meta 
          name="description" 
          content="Learn about Career Crafter, the AI-powered job portal and professional networking platform helping thousands find their dream careers. Free AI tools for job search, resume building, and career guidance." 
        />
        <meta 
          name="keywords" 
          content="about career crafter, AI job platform, professional networking, career development platform, job search tools, AI career guidance" 
        />
        <link rel="canonical" href="https://careercrafter.moshiurrahman.online/about" />
        
        <meta property="og:title" content="About Career Crafter - AI-Powered Professional Network" />
        <meta property="og:description" content="Discover how Career Crafter is revolutionizing job search with AI-powered tools and professional networking." />
        <meta property="og:url" content="https://careercrafter.moshiurrahman.online/about" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Career Crafter",
            "description": "Career Crafter is an AI-powered professional networking and job search platform",
            "url": "https://careercrafter.moshiurrahman.online/about",
            "mainEntity": {
              "@type": "Organization",
              "name": "Career Crafter",
              "description": "AI-powered job portal and professional networking platform",
              "foundingDate": "2024",
              "slogan": "Accelerate Your Career with AI"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p>
                Career Crafter was born from a simple observation: job searching and career 
                development shouldn't be overwhelming. In today's fast-paced world, professionals 
                need smart tools that understand their unique goals and help them navigate their 
                career journey efficiently.
              </p>
              <p>
                We combined the power of artificial intelligence with professional networking 
                to create a platform that doesn't just connect people with jobs—it accelerates 
                entire careers. From AI-powered job matching to intelligent resume building and 
                personalized career mentoring, we're making professional growth accessible to everyone.
              </p>
              <p>
                Today, thousands of professionals trust Career Crafter to find opportunities, 
                build their professional brand, and make meaningful connections. We're just 
                getting started, and we're excited to have you on this journey with us.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-blue-600">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              What Drives Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white hover:bg-white/20 transition-all"
                  >
                    <div className="mb-6">
                      <Icon className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                    <p className="text-white/90 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 mb-12 text-center">
              Powerful AI tools designed to accelerate your career growth
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {team.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border border-gray-100"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-4">
                    {feature.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who are already using Career Crafter 
              to find better opportunities and grow their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all inline-block"
              >
                Get Started Free
              </a>
              <a 
                href="/contact" 
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all inline-block border border-white/20"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;