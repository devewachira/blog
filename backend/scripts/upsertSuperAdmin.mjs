import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../models/user.model.js'

async function main() {
  try {
    const EMAIL = process.env.ADMIN_EMAIL || process.argv[2]
    const PASSWORD = process.env.ADMIN_PASS || process.argv[3]
    const FIRST = process.env.ADMIN_FIRST || process.argv[4] || 'Super'
    const LAST = process.env.ADMIN_LAST || process.argv[5] || 'Admin'

    if (!EMAIL || !PASSWORD) {
      console.error('Usage: ADMIN_EMAIL=... ADMIN_PASS=... node backend/scripts/upsertSuperAdmin.mjs')
      process.exit(1)
    }
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI missing in .env')
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGO_URI)

    const hash = await bcrypt.hash(PASSWORD, 10)

    const update = {
      firstName: FIRST,
      lastName: LAST,
      password: hash,
      role: 'superadmin',
    }

    const res = await User.updateOne(
      { email: EMAIL },
      { $set: update, $setOnInsert: { email: EMAIL } },
      { upsert: true }
    )

    const user = await User.findOne({ email: EMAIL }).select('-password')

    console.log(JSON.stringify({ matched: res.matchedCount, modified: res.modifiedCount, upserted: res.upsertedCount || 0, user }, null, 2))
    await mongoose.disconnect()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
