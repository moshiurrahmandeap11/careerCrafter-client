import React from "react";
import { useNavigate } from "react-router";
import { Briefcase, GraduationCap, FilePlus2 } from "lucide-react";

const Business = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Hire on Career Crafter",
      desc: "Find top talent ready to work with your business instantly.",
      icon: <Briefcase size={36} />,
      route: "/cc/hire",
    },
    {
      title: "Learn with Career Crafter",
      desc: "Upskill your team with curated learning programs.",
      icon: <GraduationCap size={36} />,
      route: "/cc/learn",
    },
    {
      title: "Post a Job",
      desc: "Share job opportunities and grow your team efficiently.",
      icon: <FilePlus2 size={36} />,
      route: "/cc/post",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center px-6 py-10">
      <div className="max-w-4xl text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          Career Crafter for Business
        </h1>
        <p className="text-slate-500 text-base md:text-lg">
          Empower your business with the best talent, training, and tools — all
          in one platform.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
        {options.map((opt, i) => (
          <div
            key={i}
            onClick={() => navigate(opt.route)}
            className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 text-center cursor-pointer transition-transform hover:-translate-y-1 duration-300 border border-slate-200"
          >
            <div className="flex flex-col items-center mb-4 text-indigo-600">
              {opt.icon}
            </div>
            <h2 className="text-lg font-semibold mb-2 text-slate-800">
              {opt.title}
            </h2>
            <p className="text-slate-500 text-sm">{opt.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Business;
