
import React from "react";

export default function TermsService() {
    const effectiveDate = "[Insert effective date: e.g. October 16, 2025]";
    const contactEmail = "[Replace with contact@careercrafter.example]";

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-2">Terms of Service</h1>
                    <p className="text-sm text-gray-600">Welcome to Career Crafter — building connections for your career journey.</p>
                    <p className="mt-3 text-xs text-gray-500">Effective date: <span className="font-medium">{effectiveDate}</span></p>
                </header>

                <article className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                    <section id="intro">
                        <h2>1. Introduction</h2>
                        <p>
                            These Terms of Service ("Terms") govern your access to and use of the Career Crafter website, app, and services
                            (collectively, the "Service"). By using our Service, you agree to these Terms. If you do not agree, please do not
                            use the Service.
                        </p>
                    </section>

                    <section id="eligibility">
                        <h2>2. Eligibility</h2>
                        <p>
                            You must be at least 16 years old to use Career Crafter. By registering, you represent that you meet this age
                            requirement and that all information you provide is accurate and up to date.
                        </p>
                    </section>

                    <section id="account">
                        <h2>3. Account responsibilities</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                            You must notify us immediately of any unauthorized use of your account.
                        </p>
                    </section>

                    <section id="use">
                        <h2>4. Acceptable use</h2>
                        <p>You agree not to use the Service for any unlawful or harmful purpose. This includes:</p>
                        <ul>
                            <li>Posting false or misleading information.</li>
                            <li>Harassing, threatening, or discriminating against others.</li>
                            <li>Uploading malicious code, spam, or content that infringes on others’ rights.</li>
                            <li>Attempting to gain unauthorized access to other accounts or the Service infrastructure.</li>
                        </ul>
                    </section>

                    <section id="jobs">
                        <h2>5. Job listings and user content</h2>
                        <p>
                            Users, employers, or recruiters may post job listings or professional content. Career Crafter does not guarantee
                            the accuracy, completeness, or legitimacy of any job listing or user-generated content.
                        </p>
                        <p>
                            By posting content, you grant Career Crafter a non-exclusive, worldwide, royalty-free license to display, distribute,
                            and promote your content on the platform.
                        </p>
                    </section>

                    <section id="termination">
                        <h2>6. Termination</h2>
                        <p>
                            We may suspend or terminate your access to the Service if you violate these Terms, misuse the platform, or engage in
                            fraudulent activity. You may delete your account at any time by contacting {contactEmail}.
                        </p>
                    </section>

                    <section id="intellectual-property">
                        <h2>7. Intellectual property</h2>
                        <p>
                            All content, logos, trademarks, and software related to Career Crafter are owned or licensed by us. You may not copy,
                            modify, or distribute any part of the Service without prior written permission.
                        </p>
                    </section>

                    <section id="disclaimer">
                        <h2>8. Disclaimer of warranties</h2>
                        <p>
                            The Service is provided on an “as is” and “as available” basis without warranties of any kind, either express or implied.
                            We do not guarantee that the Service will be uninterrupted, secure, or error-free.
                        </p>
                    </section>

                    <section id="liability">
                        <h2>9. Limitation of liability</h2>
                        <p>
                            To the fullest extent permitted by law, Career Crafter and its affiliates shall not be liable for any indirect,
                            incidental, special, or consequential damages arising from your use of the Service.
                        </p>
                    </section>

                    <section id="changes">
                        <h2>10. Changes to Terms</h2>
                        <p>
                            We may update these Terms periodically. The updated version will be posted with a revised effective date. Continued use
                            of the Service after changes means you accept the new Terms.
                        </p>
                    </section>

                    <section id="governing-law">
                        <h2>11. Governing law</h2>
                        <p>
                            These Terms are governed by and construed in accordance with the laws of your country of residence, without regard
                            to conflict of law principles.
                        </p>
                    </section>

                    <section id="contact">
                        <h2>12. Contact us</h2>
                        <p>
                            If you have questions or concerns about these Terms, please contact us at:
                        </p>
                        <div className="mt-3 p-4 bg-gray-50 rounded">
                            <p className="text-sm">Email: <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:underline">{contactEmail}</a></p>
                            <p className="text-sm mt-1">Project: <strong>Career Crafter</strong></p>
                        </div>
                    </section>
                </article>

                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
                    >
                        Print this page
                    </button>

                    <div className="text-xs text-gray-500">Replace placeholders (effective date, contact email) before publishing.</div>
                </div>
            </div>
        </div>
    );
}
