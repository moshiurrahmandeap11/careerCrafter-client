import React from "react";
import { LineChart, Shield, Hourglass, DollarSign, Rocket, BadgeCheck } from "lucide-react";

const Launch = () => {
  const features = [
    {
      icon: <LineChart className="w-8 h-8 text-orange-500" />,
      title: "Drive Consistent Revenue Growth",
      desc: "Boost sales by converting visitors into paying customers with a site designed for maximum impact."
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      title: "Establish Credibility and Trust",
      desc: "Gain investor and partner confidence with a professional, strategic web presence that speaks volumes."
    },
    {
      icon: <Hourglass className="w-8 h-8 text-orange-500" />,
      title: "Save Time and Resources",
      desc: "Avoid costly trial-and-error by launching a proven, optimized website quickly and effortlessly."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-orange-500" />,
      title: "Scale Effortlessly with Funnels",
      desc: "Use established strategies that keep your sales pipeline full and accelerate startup growth."
    },
    {
      icon: <Rocket className="w-8 h-8 text-orange-500" />,
      title: "Outperform Competitors",
      desc: "Stand out with fast-loading, SEO-optimized pages that engage visitors and keep them coming back."
    },
    {
      icon: <BadgeCheck className="w-8 h-8 text-orange-500" />,
      title: "Risk-Free Guarantee",
      desc: "See measurable improvement in your conversion rates within the first 90 days—or get your money back."
    },
  ];

  return (
    <section className="bg-black text-white py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          <span className="text-white">LAUNCH A WEBSITE THAT POWERS</span><br />
          <span className="text-orange-500">YOUR STARTUP’S GROWTH AND REVENUE</span><br />
          <span className="text-white">IN JUST <span className="text-orange-500">14 DAYS</span></span>
        </h1>
        <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
          Unlock a high-converting, revenue-generating website that becomes your startup’s most valuable asset.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#0d0d0d] border border-gray-800 p-6 rounded-xl hover:-translate-y-2 hover:shadow-lg hover:shadow-orange-600/10 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-4">{item.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Launch;
