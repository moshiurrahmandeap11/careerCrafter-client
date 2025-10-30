import React from "react";
import { LineChart, Shield, Hourglass, DollarSign, Rocket, BadgeCheck } from "lucide-react";

const Launch = () => {
  const features = [
    {
      icon: <LineChart className="w-8 h-8 text-blue-600" />,
      title: "Accelerate Career Growth",
      desc: "Boost your professional trajectory with AI-powered insights and personalized career path recommendations."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Build Professional Credibility",
      desc: "Establish a strong professional profile that attracts recruiters and builds trust with employers."
    },
    {
      icon: <Hourglass className="w-8 h-8 text-blue-600" />,
      title: "Save Job Search Time",
      desc: "Reduce months of job hunting to weeks with smart matching and optimized application strategies."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-600" />,
      title: "Increase Earning Potential",
      desc: "Unlock higher salary opportunities through data-driven negotiation strategies and market insights."
    },
    {
      icon: <Rocket className="w-8 h-8 text-blue-600" />,
      title: "Outperform Competitors",
      desc: "Stand out in the job market with AI-optimized resumes and personalized interview preparation."
    },
    {
      icon: <BadgeCheck className="w-8 h-8 text-blue-600" />,
      title: "Risk-Free Career Upgrade",
      desc: "See measurable improvement in your job search results within 30 days—or get your money back."
    },
  ];

  return (
    <section className="bg-white text-gray-900 py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          <span className="text-gray-900">LAUNCH A CAREER THAT POWERS</span><br />
          <span className="text-blue-600">YOUR PROFESSIONAL GROWTH AND EARNING</span><br />
          <span className="text-gray-900">IN JUST <span className="text-blue-600">29 DAYS</span></span>
        </h1>
        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
          Unlock AI-powered career guidance that becomes your most valuable professional asset.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-50 border border-gray-200 p-6 rounded-xl hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-4">{item.icon}</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Launch;