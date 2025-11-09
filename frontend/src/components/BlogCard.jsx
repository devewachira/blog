import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { getMockImage } from '../utils/mockImages'
import videoFiveK from "../assets/13.mp4"

const BlogCard = ({blog}) => {
    const navigate = useNavigate()
    const date = new Date(blog.createdAt)
    const formattedDate = date.toLocaleDateString("en-GB");
    
    // Debug logging for blogs with thumbnails
    if (blog.thumbnail) {
        console.log(`Blog "${blog.title}" has thumbnail:`, blog.thumbnail);
        const fullUrl = blog.thumbnail.startsWith('/') ? `${import.meta.env.VITE_API_URL}${blog.thumbnail}` : blog.thumbnail;
        console.log(`Full image URL will be:`, fullUrl);
    }
    return (
        <div className="group bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/40 p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
             onClick={()=>navigate(`/blogs/${blog._id}`)}>
            <div className="relative overflow-hidden rounded-xl">
                {String(blog.title || '').toLowerCase().includes('running your first 5k') ? (
                  <video
                    className='w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105'
                    src={videoFiveK}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img 
                    src={blog.thumbnail && blog.thumbnail !== '' ? 
                        (blog.thumbnail.startsWith('/') ? `${import.meta.env.VITE_API_URL}${blog.thumbnail}` : blog.thumbnail) : 
                        getMockImage(blog.category)
                    } 
                    alt={blog.title || 'Blog thumbnail'} 
                    className='w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105'
                    onError={(e) => {
                        e.currentTarget.src = getMockImage(blog.category);
                    }}
                  />
                )}
                {blog.category && (
                    <span className='absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-white/85 dark:bg-black/60 text-gray-800 dark:text-gray-100'>
                        {blog.category}
                    </span>
                )}
            </div>
            <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    By {blog.author?.firstName || 'Author'} • {formattedDate}
                </p>
                <h2 className="text-lg font-semibold mt-1 line-clamp-2">{blog.title}</h2>
                <p className='text-gray-600 dark:text-gray-300 mt-1 line-clamp-2'>{blog.subtitle}</p>
            </div>
            <Button onClick={(e)=>{e.stopPropagation(); navigate(`/blogs/${blog._id}`)}} className="mt-4 px-4 py-2 rounded-lg text-sm ">
                Read More
            </Button>
        </div>
    )
}

export default BlogCard

