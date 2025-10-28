import { Link } from "react-router";
import { Video } from "lucide-react"; // nice icon

const LiveInterviewBanner = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-12 px-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Wanna take a <span className="text-yellow-300">Live Interview?</span>
        </h1>
        <p className="text-sm md:text-base opacity-90">
          Get real-time AI interview experience to boost your confidence before the real one.
        </p>
      </div>

      <Link
        to="/live-interview"
        className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-100 transition-all font-semibold px-6 py-3 rounded-xl shadow-md"
      >
        <Video className="w-5 h-5" />
        Start Live Interview
      </Link>
    </div>
  );
};

export default LiveInterviewBanner;
