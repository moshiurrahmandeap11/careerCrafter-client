import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle, Briefcase } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'support@careercrafter.com',
      link: 'mailto:support@careercrafter.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      detail: '+880 1234-567890',
      link: 'tel:+8801234567890'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      detail: 'Dhaka, Bangladesh',
      link: '#'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'support', label: 'Technical Support', icon: HelpCircle },
    { value: 'business', label: 'Business Partnership', icon: Briefcase },
    { value: 'feedback', label: 'Feedback', icon: Send }
  ];

  const faqs = [
    {
      question: 'How do I get started with Career Crafter?',
      answer: 'Simply sign up for a free account, complete your profile, and start exploring jobs, building resumes, or chatting with our AI mentor.'
    },
    {
      question: 'Is Career Crafter really free?',
      answer: 'Yes! We offer free access to core features including job search, AI job matching, and basic resume building. Premium features are available with our credit system.'
    },
    {
      question: 'How does the AI job matching work?',
      answer: 'Our AI analyzes your profile, skills, experience, and preferences to recommend jobs that best match your career goals and qualifications.'
    },
    {
      question: 'Can I use Career Crafter on mobile?',
      answer: 'Absolutely! Career Crafter is fully responsive and works seamlessly on all devices including smartphones and tablets.'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', category: 'general', message: '' });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Career Crafter | Get Help & Support</title>
        <meta 
          name="description" 
          content="Get in touch with Career Crafter team. Contact us for support, partnerships, or inquiries about our AI-powered job portal and career tools. We're here to help!" 
        />
        <meta 
          name="keywords" 
          content="contact career crafter, customer support, help center, career guidance support, job portal contact, technical support" 
        />
        <link rel="canonical" href="https://careercrafter.moshiurrahman.online/contact" />
        
        <meta property="og:title" content="Contact Career Crafter - We're Here to Help" />
        <meta property="og:description" content="Have questions? Need support? Contact the Career Crafter team for assistance with our AI-powered career tools." />
        <meta property="og:url" content="https://careercrafter.moshiurrahman.online/contact" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Career Crafter",
            "description": "Get in touch with Career Crafter support team",
            "url": "https://careercrafter.moshiurrahman.online/contact",
            "mainEntity": {
              "@type": "Organization",
              "name": "Career Crafter",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+880-1234-567890",
                "contactType": "Customer Support",
                "email": "support@careercrafter.com",
                "availableLanguage": ["English", "Bengali"]
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/90">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 px-4 -mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <a
                    key={index}
                    href={info.link}
                    className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all border border-gray-100 group"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-600 transition-all">
                        <Icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-all" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-600">{info.detail}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  ✓ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Need Immediate Help?
                </h3>
                <p className="mb-6 text-white/90">
                  Check out our comprehensive help center for instant answers to common questions.
                </p>
                <a 
                  href="/help"
                  className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                  Visit Help Center
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Our Support Hours
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email Support
                </h3>
                <p className="text-gray-600">
                  24/7 - We typically respond within 24 hours
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Phone Support
                </h3>
                <p className="text-gray-600">
                  Mon-Fri: 9:00 AM - 6:00 PM (GMT+6)
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;