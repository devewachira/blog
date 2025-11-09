import React, { useState } from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import heroVideo from "../assets/12.mp4"
import heroImageLeft from "../assets/blog2.png"

const Hero = () => {
  const [videoReady, setVideoReady] = useState(false)
  const videoUrl = heroVideo
  const poster = 'https://picsum.photos/seed/tech-hero/1200/600'

  return (
    <div className='relative h-[60vh] md:h-[70vh] overflow-hidden'>
      {/* Background image first */}
      <img
        src={poster}
        alt="hero poster"
        className='absolute inset-0 w-full h-full object-cover'
      />
      {/* Background video fades in after load */}
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        src={videoUrl}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        onLoadedData={() => setVideoReady(true)}
      />
      {/* Overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60' />

      {/* Content */}
      <div className='relative z-10 h-full px-4 md:px-0'>
        {/* Left hero image */}
        <div className='absolute left-4 md:left-10 top-1/2 -translate-y-1/2 hidden md:block animate-fade-in' style={{animationDelay:'0.1s'}}>
          <img
            src={heroImageLeft}
            alt="Hero graphic"
            className='w-64 sm:w-80 md:w-[28rem] lg:w-[32rem] rounded-xl'
          />
        </div>
        <div className='max-w-7xl mx-auto h-full flex items-center justify-end'>
          <div className='max-w-2xl text-right'>
            <h1 className='text-4xl md:text-6xl font-extrabold mb-4 text-white'>
              Explore the Latest Tech & Web Trends
            </h1>
            <p className='text-lg md:text-xl mb-6 text-white'>
              Stay ahead with in-depth articles, tutorials, and insights on web development, digital marketing, and tech innovations.
            </p>
            <div className='flex gap-4 justify-end'>
              <Link to={'/dashboard/write-blog'}><Button className='text-base md:text-lg'>Get Started</Button></Link>
              <Link to={'/about'}><Button variant='outline' className='px-6 py-3 text-base md:text-lg'>Learn More</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

