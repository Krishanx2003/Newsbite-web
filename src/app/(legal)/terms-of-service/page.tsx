import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using NewsBite, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily access the materials on NewsBite for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on NewsBite</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
          <p className="text-gray-700 mb-4">
            By posting content on NewsBite, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content. You represent and warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>You own or have the necessary rights to the content</li>
            <li>The content does not violate any third-party rights</li>
            <li>The content is not illegal, obscene, threatening, or defamatory</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Disclaimer</h2>
          <p className="text-gray-700">
            The materials on NewsBite are provided on an 'as is' basis. NewsBite makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Limitations</h2>
          <p className="text-gray-700">
            In no event shall NewsBite or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NewsBite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms of Service, please contact us at{' '}
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