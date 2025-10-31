import React, { useEffect } from "react";

export default function HelpCenter() {

      useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-2">Help Center</h1>
                    <p className="text-sm text-gray-600">How can we assist you on your Career Crafter journey?</p>
                </header>

                <section className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold">Getting Started</h2>
                        <p className="text-gray-700">Learn how to create an account, set up your profile, and start exploring job opportunities.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">Account & Profile</h2>
                        <p className="text-gray-700">Tips on updating your personal information, managing your visibility, and securing your account.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">Job Applications</h2>
                        <p className="text-gray-700">Find out how to apply for jobs, track applications, and improve your chances of success.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">AI Resume Builder</h2>
                        <p className="text-gray-700">Discover how our AI-powered tools help you craft a professional resume tailored to your skills.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">Contact Support</h2>
                        <p className="text-gray-700">Need more help? Reach out to us at <a href="mailto:support@careercrafter.example" className="text-blue-600 hover:underline">support@careercrafter.example</a>.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
