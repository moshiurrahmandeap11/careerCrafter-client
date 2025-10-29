import React from "react";
import { Mail } from "lucide-react";

const HireButton = ({ email, name }) => {
  const handleHireClick = () => {
    if (!email) {
      alert("Email address not found!");
      return;
    }

    const subject = encodeURIComponent("Job Opportunity");
    const body = encodeURIComponent(
      `Hi ${name || "there"},\n\nWe are impressed with your profile and would like to hire you for a suitable position.\n\nBest regards,\n[Your Company Name]`
    );

    // ✅ Use window.open() instead of location.href — works better with user clicks
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
  };

  return (
    <button
      type="button"
      onClick={handleHireClick}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
    >
      <Mail size={18} />
      Hire
    </button>
  );
};

export default HireButton;
