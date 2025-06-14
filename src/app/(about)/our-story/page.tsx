import React from 'react';

export default function OurStory() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Story</h1>
      
      <div className="space-y-8">
        <section className="prose prose-lg">
          <p className="text-gray-700 mb-6">
            NewsBite was born from a simple yet powerful idea: to make staying informed about pop culture and trends as easy as scrolling through your social media feed. In a world where information moves at lightning speed, we saw a need for a platform that could cut through the noise and deliver the most relevant, engaging content.
          </p>

          <h2 className="text-2xl font-semibold mb-4">The Beginning</h2>
          <p className="text-gray-700 mb-6">
            Founded in 2023, NewsBite started as a small team of passionate content creators and tech enthusiasts who believed that news about pop culture, fashion, and trends should be accessible, entertaining, and meaningful. We wanted to create a space where people could not just consume content, but truly engage with it.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At NewsBite, we're on a mission to redefine how people engage with pop culture news. We believe that staying informed about trends and cultural moments shouldn't feel like homework. Instead, it should be an exciting journey of discovery that connects people and sparks conversations.
          </p>

          <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
          <ul className="list-disc pl-6 space-y-4 text-gray-700">
            <li>
              <strong>Curated Content:</strong> We don't just report the news; we curate it with care, ensuring that every piece of content we share adds value to your day.
            </li>
            <li>
              <strong>Community First:</strong> Our readers aren't just an audience; they're part of our community. We actively engage with our readers and value their input.
            </li>
            <li>
              <strong>Fresh Perspective:</strong> We bring a unique voice to pop culture coverage, combining deep insights with an approachable, engaging style.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Looking Forward</h2>
          <p className="text-gray-700 mb-6">
            As we continue to grow, our commitment to delivering high-quality, engaging content remains unwavering. We're constantly evolving and adapting to better serve our community, exploring new ways to make staying informed about pop culture more enjoyable and meaningful.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">Join Our Journey</h3>
            <p className="text-gray-700">
              Whether you're a casual reader or a pop culture enthusiast, there's a place for you in the NewsBite community. Subscribe to our newsletter to stay updated with the latest trends and cultural moments.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
} 