import 'dotenv/config'
import mongoose from 'mongoose'
import { Blog } from '../models/blog.model.js'
import { User } from '../models/user.model.js'

const CATEGORIES = [
  'Web Development',
  'Digital Marketing',
  'Blogging',
  'Photography',
  'Cooking',
  'Sports',
]

function imgFor(title) {
  // Deterministic placeholder images by title
  return `https://picsum.photos/seed/${encodeURIComponent(title)}/800/400`;
}

const SAMPLE_BLOGS = [
  {
    title: 'Getting Started with React 18',
    subtitle: 'A modern guide to building UIs',
    category: 'Web Development',
    description: `<p>React 18 introduces concurrent rendering, automatic batching, and more. In this guide, we'll set up a new project, explore hooks, and build a real-world component.</p>`
  },
  {
    title: 'SEO Basics for 2025',
    subtitle: 'What matters now',
    category: 'Digital Marketing',
    description: `<p>Search has evolved. We'll cover high-quality content, Core Web Vitals, intent, and how to build pages that users (and search engines) love.</p>`
  },
  {
    title: 'How to Start a Tech Blog',
    subtitle: 'From idea to first post',
    category: 'Blogging',
    description: `<p>Blogging is a great way to learn in public. We'll pick a niche, set up tools, outline posts, and promote your work.</p>`
  },
  {
    title: 'Mastering Mobile Photography',
    subtitle: 'Pro tips with your phone',
    category: 'Photography',
    description: `<p>Composition, lighting, and editing tricks to take your mobile shots from good to great—no DSLR required.</p>`
  },
  {
    title: 'Quick & Healthy Meal Prep',
    subtitle: 'Save time and eat better',
    category: 'Cooking',
    description: `<p>Plan, prep, and store delicious meals for the week. We'll cover protein, grains, veggies, and sauces to mix and match.</p>`
  },
  {
    title: 'Strength Training 101',
    subtitle: 'Build muscle safely',
    category: 'Sports',
    description: `<p>Learn proper form, progressive overload, and recovery strategies to get stronger without injury.</p>`
  },
  {
    title: 'TypeScript Tips for Large Apps',
    subtitle: 'Types that scale',
    category: 'Web Development',
    description: `<p>Improve DX with strict settings, utility types, module boundaries, and shared interfaces across your monorepo.</p>`
  },
  {
    title: 'Email Marketing that Converts',
    subtitle: 'From signup to sale',
    category: 'Digital Marketing',
    description: `<p>Build sequences that deliver value, segment your audience, and write subject lines that get opened.</p>`
  },
  {
    title: 'Write Better Technical Articles',
    subtitle: 'Clarity and structure',
    category: 'Blogging',
    description: `<p>Use clear headings, visual examples, and step-by-step instructions. Always write for readers first.</p>`
  },
  {
    title: 'Editing Photos Like a Pro',
    subtitle: 'Lightroom basics',
    category: 'Photography',
    description: `<p>Crop for composition, fix exposure and white balance, and add subtle contrast for a natural look.</p>`
  },
  {
    title: 'One-Pot Dinners You’ll Love',
    subtitle: 'Less cleanup, more flavor',
    category: 'Cooking',
    description: `<p>These simple one-pot meals are perfect for busy nights—hearty, healthy, and ready fast.</p>`
  },
  {
    title: 'Running Your First 5K',
    subtitle: 'Beginner’s plan',
    category: 'Sports',
    description: `<p>Build endurance with a gentle plan, track progress, and choose the right shoes to avoid injury.</p>`
  }
]

async function main() {
  try {
    const MONGO_URI = process.env.MONGO_URI
    if (!MONGO_URI) throw new Error('MONGO_URI missing in .env')

    await mongoose.connect(MONGO_URI)

    // Find an author (prefer the superadmin you created)
    let author = await User.findOne({ email: 'mejoarwachira@gmail.com' })
    if (!author) {
      // fallback to any user
      author = await User.findOne()
    }
    if (!author) {
      throw new Error('No users found to assign as blog author. Create a user first.')
    }

    let created = 0
    for (const b of SAMPLE_BLOGS) {
      const exists = await Blog.findOne({ title: b.title })
      const payload = {
        title: b.title,
        subtitle: b.subtitle,
        description: b.description,
        category: b.category,
        thumbnail: imgFor(b.title),
        author: author._id,
        isPublished: true,
      }
      if (exists) {
        // Update missing thumbnail/fields on existing seed
        const update = {}
        if (!exists.thumbnail) update.thumbnail = payload.thumbnail
        if (!exists.description) update.description = payload.description
        if (!exists.subtitle) update.subtitle = payload.subtitle
        if (!exists.category) update.category = payload.category
        if (Object.keys(update).length) {
          await Blog.updateOne({ _id: exists._id }, { $set: update })
        }
      } else {
        await Blog.create(payload)
        created += 1
      }
    }

    const total = await Blog.countDocuments()
    console.log(JSON.stringify({ seeded: created, totalBlogs: total }, null, 2))
    await mongoose.disconnect()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
