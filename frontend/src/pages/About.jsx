import React from 'react';
import aboutImg from "../assets/About-blog.avif"

const About = () => {
  return (
    <div className="relative min-h-screen pt-28 px-4 md:px-0 mb-7 overflow-hidden">
      {/* decorative gradient blobs */}
      <div className='absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-r from-fuchsia-500/15 to-blue-500/15 rounded-full blur-3xl pointer-events-none' />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center animate-fade-up" style={{animationDelay:'0.05s'}}>
          <h1 className="md:text-5xl text-4xl font-extrabold mb-4">
            About <span className='bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent'>Chris Dev</span>
          </h1>
          <p className="text-lg opacity-90">
            A place to share thoughts, inspire others, and grow together through web development and tech insights.
          </p>
        </div>

        {/* Image + Text Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
          <div className='animate-fade-up' style={{animationDelay:'0.15s'}}>
            <img
              src={aboutImg}
              alt="Blog Illustration"
              className="w-full h-72 object-cover rounded-2xl shadow-xl transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
          <div className='space-y-4 animate-slide-right' style={{animationDelay:'0.25s'}}>
            <p className="text-lg">
              Welcome to Chris Dev! I'm passionate about web development and love sharing knowledge through
              tutorials, insights, and creative solutions. Whether you're a fellow developer, student, or
              tech enthusiast, this platform is designed to help you grow and learn.
            </p>
            <p className="text-lg">
              My mission is to create valuable content that helps developers solve real-world problems.
              From MERN stack tutorials to modern web development practices, I share what I learn
              and discover in my coding journey.
            </p>
            <p className="text-lg">
              Thank you for being part of this journey. Feel free to reach out at <span className='font-semibold'>mejoarwachira@gmail.com</span>
              if you have any questions or suggestions!
            </p>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-16 text-center animate-fade-in" style={{animationDelay:'0.35s'}}>
          <blockquote className="text-2xl italic text-gray-500">
            "Words are powerful. Use them to inspire."
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default About;

