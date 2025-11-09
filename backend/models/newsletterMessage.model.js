import mongoose from "mongoose";

const newsletterMessageSchema = new mongoose.Schema({
  subject: { type: String, default: 'Announcement from techblog' },
  message: { type: String, required: true },
  stats: {
    totalRecipients: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    errors: { type: Number, default: 0 },
  }
}, { timestamps: true });

export const NewsletterMessage = mongoose.model('NewsletterMessage', newsletterMessageSchema);