import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContexts/AuthContexts";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUserTie,
  FaBuilding,
  FaLaptopCode,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router";

const SearchJob = () => {
  const { searchResult, searchTopic } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          {searchResult?.length || 0} result
          {searchResult?.length > 1 ? "s" : ""} found for
          <span className="text-indigo-600 font-bold ml-2">"{searchTopic}"</span>
        </h1>
      </div>

      {/* Job Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResult && searchResult.length > 0 ? (
          searchResult.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100 flex flex-col"
            >
              {/* Job Image */}
              <img
                src={job.image}
                alt={job.title}
                className="h-44 w-full object-cover"
              />

              {/* Job Info */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                {/* Title & Company */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
                    <FaLaptopCode className="text-indigo-500" />
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <FaBuilding className="text-gray-500" />
                    {job.company}
                  </p>

                  {/* Location */}
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    {job.location}
                  </p>

                  {/* Experience & Education */}
                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                    <FaUserTie className="text-gray-500" />
                    {job.experienceLevel} level • {job.educationLevel}
                  </p>

                  {/* Salary */}
                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                    <FaMoneyBillWave className="text-green-500" />
                    ${job.salaryMin} - ${job.salaryMax}
                  </p>

                  {/* Job Type & Work Mode */}
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium text-indigo-600">
                      {job.jobType}
                    </span>{" "}
                    • {job.workMode}
                  </p>

                  {/* AI Compatible */}
                  {job.aiCompatible && (
                    <div className="flex items-center gap-2 mb-3">
                      <FaCheckCircle className="text-emerald-500" />
                      <span className="text-sm text-emerald-600 font-medium">
                        AI Compatible
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Skills */}
                  {job.requiredSkills?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">
                        Required Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link to={`/job/${job._id}`} className="w-full sm:w-auto bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-600 transition">
                    View Details
                  </Link>
                  <Link to={`/job/${job._id}`} className="w-full sm:w-auto bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition">
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            No jobs found for "{searchTopic}" 😔
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-center mt-16">
        <Link to={'/jobs'} className="w-full sm:w-auto bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-600 transition">See All Jobs</Link>
      </div>
    </div>
  );
};

export default SearchJob;
