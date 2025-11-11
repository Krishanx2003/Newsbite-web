import React from 'react';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'Founder & Editor-in-Chief',
    bio: 'Former fashion editor with a passion for pop culture and digital media. Sarah leads our editorial vision and content strategy.',
    image: '/team/sarah.jpg' // You'll need to add these images
  },
  {
    name: 'Michael Rodriguez',
    role: 'Creative Director',
    bio: 'Award-winning designer with 10+ years of experience in digital media. Michael ensures our content looks as good as it reads.',
    image: '/team/michael.jpg'
  },
  {
    name: 'Priya Patel',
    role: 'Senior Content Writer',
    bio: 'Pop culture expert and former entertainment journalist. Priya brings her unique perspective to our trending stories.',
    image: '/team/priya.jpg'
  },
  {
    name: 'David Kim',
    role: 'Tech Lead',
    bio: 'Full-stack developer with a love for creating seamless user experiences. David keeps our platform running smoothly.',
    image: '/team/david.jpg'
  }
];

export default function Team() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Meet Our Team</h1>
      <p className="text-gray-700 text-center max-w-2xl mx-auto mb-12">
        We're a diverse group of passionate individuals united by our love for pop culture and commitment to delivering engaging content.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-electric-purple font-medium mb-4">{member.role}</p>
              <p className="text-gray-700">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
        <p className="text-gray-700 mb-6">
          We're always looking for talented individuals who share our passion for pop culture and digital media.
        </p>
        <a
          href="/careers"
          className="inline-block bg-electric-purple text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
        >
          View Open Positions
        </a>
      </div>
    </div>
  );
} 