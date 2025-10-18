import React from "react";

export default function CookiePolicy() {
    const effectiveDate = "October 16, 2025";
    const contactEmail = "support@careercrafter.com";

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-2">Cookie Policy</h1>
                    <p className="text-sm text-gray-600">Understanding how Career Crafter uses cookies and similar technologies.</p>
                    <p className="mt-3 text-xs text-gray-500">Effective date: <span className="font-medium">{effectiveDate}</span></p>
                </header>

                <article className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                    <section id="intro">
                        <h2>1. Introduction</h2>
                        <p>
                            This Cookie Policy explains how <strong>Career Crafter</strong> ("we", "our", "us") uses cookies and similar
                            technologies when you visit our website or use our services (the "Service"). It should be read together with our
                            <a href="/privacy-policy" className="text-blue-600 hover:underline"> Privacy Policy</a>.
                        </p>
                    </section>

                    <section id="what-are-cookies">
                        <h2>2. What are cookies?</h2>
                        <p>
                            Cookies are small text files placed on your device when you visit a website. They help remember your preferences,
                            improve functionality, and analyze how you interact with our Service.
                        </p>
                    </section>

                    <section id="types-of-cookies">
                        <h2>3. Types of cookies we use</h2>
                        <h3>3.1 Necessary cookies</h3>
                        <p>
                            These cookies are essential for the operation of our website and enable basic features such as page navigation and
                            secure login.
                        </p>

                        <h3>3.2 Performance and analytics cookies</h3>
                        <p>
                            These cookies collect information about how visitors use our site, such as which pages are most visited or if users
                            encounter error messages. This helps us improve our website.
                        </p>

                        <h3>3.3 Functional cookies</h3>
                        <p>
                            These cookies allow the website to remember your preferences and choices, such as language or location settings.
                        </p>

                        <h3>3.4 Advertising cookies</h3>
                        <p>
                            These cookies are used to deliver relevant ads and track ad campaign performance. They may also limit how often you
                            see an ad.
                        </p>
                    </section>

                    <section id="third-party">
                        <h2>4. Third-party cookies</h2>
                        <p>
                            Some cookies are placed by third-party services that appear on our website, such as analytics, advertising networks,
                            or social media integrations. These providers have their own privacy and cookie policies.
                        </p>
                    </section>

                    <section id="manage-cookies">
                        <h2>5. Managing your cookie preferences</h2>
                        <p>
                            You can manage or delete cookies through your browser settings. Most browsers allow you to block or delete cookies,
                            but doing so may affect the functionality of our website.
                        </p>
                        <ul>
                            <li>Google Chrome: Settings → Privacy and security → Cookies and other site data</li>
                            <li>Mozilla Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                            <li>Safari: Preferences → Privacy → Manage Website Data</li>
                            <li>Microsoft Edge: Settings → Cookies and site permissions</li>
                        </ul>
                    </section>

                    <section id="changes">
                        <h2>6. Changes to this policy</h2>
                        <p>
                            We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our
                            cookie practices. We encourage you to review this page periodically.
                        </p>
                    </section>

                    <section id="contact">
                        <h2>7. Contact us</h2>
                        <p>
                            If you have any questions or concerns about our use of cookies, please contact us at:
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
                </div>
            </div>
        </div>
    );
}
