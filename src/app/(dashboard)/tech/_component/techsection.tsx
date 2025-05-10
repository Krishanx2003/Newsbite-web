import React from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const TechSection: React.FC = () => {
  return (
    <section className="relative pt-24 pb-16 md:py-32 overflow-hidden">
      {/* Background gradient animation */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] animate-gradient-wave -z-10"
        aria-hidden="true"
      />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-neon-pink/5 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-neon-blue/5 blur-3xl" aria-hidden="true" />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="gradient-text neon-shadow">News That Gets You</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300 max-w-lg">
              Stay in the know with Gen Z vibes. News that matters, stories that inspire, content that connects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-neon-pink hover:bg-neon-pink/80 text-white">
                Join the Vibe
              </Button>
              <Button variant="outline" size="lg" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10">
                Explore Stories
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center animate-fade-in" style={{animationDelay: "0.2s"}}>
            <div className="relative w-full max-w-md">
              {/* Main hero image using Next.js Image */}
              <Image 
                src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Young people reading news on mobile devices"
                className="rounded-2xl shadow-lg w-full object-cover"
                width={600}
                height={400}
                priority
              />
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 p-4 bg-card rounded-xl shadow-lg transform rotate-[-5deg] w-40">
                <div className="badge badge-neutral mb-2">Breaking</div>
                <p className="text-xs font-medium line-clamp-2">Climate activists take global action</p>
              </div>
              
              <div className="absolute -top-4 -right-4 p-4 bg-card rounded-xl shadow-lg transform rotate-[5deg] w-40">
                <div className="badge badge-opinion mb-2">Trending</div>
                <p className="text-xs font-medium line-clamp-2">Tech giants face new regulations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSection;