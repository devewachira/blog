import Hero from '@/components/Hero'
import React, { useEffect } from 'react'
import BlogCard from '@/components/BlogCard'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog } from '@/redux/blogSlice'
import { useNavigate } from 'react-router-dom'
import gridVideo from "../assets/11.mp4"
import video13 from "../assets/13.mp4"

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { blog } = useSelector(store => store.blog)

  useEffect(() => {
    const getAllPublishedBlogs = async () => {
      try {
        const res = await axios.get('/api/v1/blog/get-published-blogs')
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs))
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAllPublishedBlogs()
  }, [])

  const featured = blog?.[0]
  const rest = blog?.slice(1) || []

  return (
    <div className='pt-16'>
      <Hero />

      {/* Featured */}
      {featured && (
        <div className='max-w-7xl mx-auto px-4 md:px-0 mt-6'>
          <div className='relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer'
               onClick={() => navigate(`/blogs/${featured._id}`)}>
            {String(featured.title || '').toLowerCase().includes('running your first 5k') ? (
              <video
                className='w-full h-[380px] md:h-[460px] object-cover transition-transform duration-500 group-hover:scale-105'
                src={video13}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={featured.thumbnail || ''}
                onError={(e)=>{e.currentTarget.src = 'https://picsum.photos/seed/featured/1200/600'}}
                alt={featured.title}
                className='w-full h-[380px] md:h-[460px] object-cover transition-transform duration-500 group-hover:scale-105'
              />
            )}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'></div>
            <div className='absolute bottom-0 p-6 md:p-8 text-white'>
              <span className='inline-block text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-md mb-3'>
                {featured.category || 'Featured'}
              </span>
              <h2 className='text-2xl md:text-4xl font-bold mb-2 line-clamp-2'>{featured.title}</h2>
              <p className='opacity-90 line-clamp-2'>{featured.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid with background video */}
      <section className='relative mt-8'>
        <video
          className='absolute inset-0 w-full h-full object-cover'
          src={gridVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40' />
        <div className='relative z-10'>
          <div className='max-w-7xl mx-auto grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-10 px-4 md:px-0'>
            {rest.map((b, index) => (
              <BlogCard blog={b} key={b._id || index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

