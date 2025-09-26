import React from 'react';

// Placeholder sponsor logos (replace with actual URLs)
const sponsors = [
  'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
  'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
  'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
  'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
  'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
];

const Hero = () => {
  return (
    <div
      className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/t4qcPNXx/image.jpg')" }}
    >
      {/* Overlay for Readability */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[600px] md:min-h-[700px] text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
          Shape Your Future with Career Crafter
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto">
          Discover opportunities, connect with professionals, and build a career that inspires you.
        </p>
      </div>

      {/* Sponsor Ticker */}
      <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur-sm py-4 z-20 overflow-hidden">
        <div className="flex animate-ticker">
          {[...sponsors, ...sponsors].map((sponsor, index) => (
            <img
              key={index}
              src={sponsor}
              alt={`Sponsor ${index + 1}`}
              className="h-10 mx-6 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// CSS for Ticker Animation
const styles = `
  @keyframes ticker {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  .animate-ticker {
    animation: ticker 20s linear infinite;
    display: flex;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Hero;
