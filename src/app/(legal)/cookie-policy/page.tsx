import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p className="text-gray-700">
            Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide a better user experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Essential cookies: Required for the website to function properly</li>
            <li>Analytics cookies: Help us understand how visitors interact with our website</li>
            <li>Functionality cookies: Remember your preferences and settings</li>
            <li>Marketing cookies: Used to track visitors across websites for marketing purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
              <p className="text-gray-700">
                These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Analytics Cookies</h3>
              <p className="text-gray-700">
                We use Google Analytics to help us understand how our website is being used. These cookies may track things such as how long you spend on the site and the pages that you visit.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
          <p className="text-gray-700 mb-4">
            Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience using our website. To learn more about cookies and how to manage them, visit{' '}
            <a
              href="https://www.aboutcookies.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric-purple hover:underline"
            >
              www.aboutcookies.org
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Updates to This Policy</h2>
          <p className="text-gray-700">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please check this page periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about our Cookie Policy, please contact us at{' '}
            <a href="mailto:hello@vibecheck.in" className="text-electric-purple hover:underline">
              hello@vibecheck.in
            </a>
          </p>
        </section>

        <section>
          <p className="text-gray-600 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
} 