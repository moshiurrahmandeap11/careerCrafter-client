import React from "react";

export default function PrivacyPolicy() {
    const effectiveDate = "[Insert effective date: e.g. October 16, 2025]";
    const contactEmail = "[Replace with contact@careercrafter.example]";

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-2">Privacy Policy</h1>
                    <p className="text-sm text-gray-600">Career Crafter — making career connections easier.</p>
                    <p className="mt-3 text-xs text-gray-500">Effective date: <span className="font-medium">{effectiveDate}</span></p>
                </header>

                <nav aria-label="Table of contents" className="mb-6">
                    <ul className="flex flex-wrap gap-2 text-sm">
                        <li><a href="#intro" className="text-blue-600 hover:underline">Introduction</a></li>
                        <li><a href="#info-collected" className="text-blue-600 hover:underline">Information we collect</a></li>
                        <li><a href="#use" className="text-blue-600 hover:underline">How we use information</a></li>
                        <li><a href="#sharing" className="text-blue-600 hover:underline">Sharing & third parties</a></li>
                        <li><a href="#cookies" className="text-blue-600 hover:underline">Cookies</a></li>
                        <li><a href="#security" className="text-blue-600 hover:underline">Security</a></li>
                        <li><a href="#rights" className="text-blue-600 hover:underline">Your rights</a></li>
                        <li><a href="#contact" className="text-blue-600 hover:underline">Contact</a></li>
                    </ul>
                </nav>

                <article className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                    <section id="intro">
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to <strong>Career Crafter</strong> ("we", "us", "our"). This Privacy Policy explains how we collect,
                            use, disclose, and protect personal information when you visit or use our website and services (the "Service").
                        </p>
                    </section>

                    <section id="info-collected">
                        <h2>2. Information we collect</h2>
                        <p>We collect information to provide and improve our Service. Types of information include:</p>

                        <h3>2.1 Information you provide</h3>
                        <ul>
                            <li>Account details: name, email address, password (hashed), profile picture, headline, summary, location, and professional details you add.</li>
                            <li>Job interactions: applications, saved jobs, messages, and other content you submit.</li>
                            <li>Support and communications: messages you send to support or feedback forms.</li>
                        </ul>

                        <h3>2.2 Information collected automatically</h3>
                        <ul>
                            <li>Device and usage data: IP address, browser type, operating system, pages visited, time spent, and referral source.</li>
                            <li>Analytics and performance data to understand how the Service is used and to improve it.</li>
                        </ul>

                        <h3>2.3 Cookies & similar technologies</h3>
                        <p>We use cookies, local storage, and similar technologies to remember preferences, enable features, and collect analytics.</p>
                    </section>

                    <section id="use">
                        <h2>3. How we use information</h2>
                        <p>We may use information for the following purposes:</p>
                        <ul>
                            <li>Provide, operate, and maintain the Service.</li>
                            <li>Improve and personalize your experience.</li>
                            <li>Communicate with you (notifications, marketing if consented, updates).</li>
                            <li>Process applications, manage job listings, and enable messaging between users and employers.</li>
                            <li>Monitor and analyze trends, usage, and activities to enhance security and performance.</li>
                        </ul>
                    </section>

                    <section id="sharing">
                        <h2>4. Sharing and disclosure</h2>
                        <p>We do not sell personal information. We may share information in limited circumstances:</p>
                        <ul>
                            <li>With your consent.</li>
                            <li>With service providers and vendors who perform services on our behalf (hosting, analytics, email, payment processing).</li>
                            <li>To comply with laws, subpoenas, legal process, or to respond to lawful requests.</li>
                            <li>To protect rights, property, or safety of Career Crafter, our users, or the public.</li>
                        </ul>

                        <h3>4.1 Third-party integrations</h3>
                        <p>
                            If you connect third-party services (for example LinkedIn import or job board integrations), those services may
                            share data with us and their own privacy policies will apply. Always review third-party privacy terms before connecting accounts.
                        </p>
                    </section>

                    <section id="cookies">
                        <h2>5. Cookies and tracking</h2>
                        <p>
                            We use cookies and similar technologies for security, preferences, analytics, and advertising. You can control
                            cookies via your browser settings. Blocking cookies may affect functionality.
                        </p>
                    </section>

                    <section id="security">
                        <h2>6. Security</h2>
                        <p>
                            We implement reasonable technical and organizational measures to protect personal information. However, no method
                            of transmission or storage is completely secure. If you suspect a breach, contact us immediately at {contactEmail}.
                        </p>
                    </section>

                    <section id="children">
                        <h2>7. Children</h2>
                        <p>
                            Our Service is not intended for children under 13. We do not knowingly collect personal information from children
                            under 13. If you believe we collected such data, contact us and we will take steps to delete it.
                        </p>
                    </section>

                    <section id="rights">
                        <h2>8. Your rights</h2>
                        <p>Depending on your jurisdiction, you may have rights including:</p>
                        <ul>
                            <li>Access and obtain a copy of your personal data.</li>
                            <li>Request correction of inaccurate information.</li>
                            <li>Request deletion of data (subject to our legal obligations).</li>
                            <li>Object to or restrict processing in some cases.</li>
                        </ul>
                        <p>To exercise these rights, contact us at {contactEmail}. We may ask for verification before taking action.</p>
                    </section>

                    <section id="retention">
                        <h2>9. Data retention</h2>
                        <p>We retain personal data as long as necessary to provide the Service, comply with legal obligations, and resolve disputes.</p>
                    </section>

                    <section id="international">
                        <h2>10. International transfers</h2>
                        <p>
                            Your data may be processed and stored in countries outside your residence. We take steps to ensure appropriate safeguards
                            when transferring data internationally.
                        </p>
                    </section>

                    <section id="changes">
                        <h2>11. Changes to this policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will post the updated policy with a new effective date. Major
                            changes will be communicated via email or in-app notification where practicable.
                        </p>
                    </section>

                    <section id="contact">
                        <h2>12. Contact us</h2>
                        <p>
                            For questions or requests regarding this Privacy Policy, contact us at:
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
                        Print this policy
                    </button>

                    <div className="text-xs text-gray-500">Replace placeholders (effective date, contact email) before publishing.</div>
                </div>
            </div>
        </div>
    );
}
