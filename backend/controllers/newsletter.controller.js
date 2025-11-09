import { NewsletterSubscriber } from '../models/newsletterSubscriber.model.js'
import { NewsletterMessage } from '../models/newsletterMessage.model.js'
import { sendNewsletterEmails } from '../utils/mailer.js'

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const emailNorm = String(email).trim().toLowerCase();

    let existing = await NewsletterSubscriber.findOne({ email: emailNorm });
    if (existing) {
      if (!existing.subscribed) {
        existing.subscribed = true;
        await existing.save();
      }
      return res.status(200).json({ success: true, message: 'You are already subscribed. Stay tuned for more content!' });
    }

    await NewsletterSubscriber.create({ email: emailNorm });

    // Send welcome email (best effort; do not fail subscription if email fails)
    try {
      const subject = process.env.NEWSLETTER_WELCOME_SUBJECT || 'Welcome to techblog';
      const welcome = process.env.NEWSLETTER_WELCOME_MESSAGE || `Hi,

Thanks for subscribing to techblog! You'll receive occasional updates with new posts, tips, and announcements.

If you didn’t subscribe, you can ignore this email.`;
      await sendNewsletterEmails([emailNorm], subject, welcome);
    } catch (e) {
      // swallow email errors for subscribe flow
    }

    return res.status(201).json({ success: true, message: 'Thank you for subscribing! Stay tuned for more content.' });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(200).json({ success: true, message: 'You are already subscribed. Stay tuned for more content!' });
    }
    return res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
}

export const listSubscribers = async (_req, res) => {
  try {
    const subs = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, subscribers: subs, total: subs.length });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers' });
  }
}

export const broadcast = async (req, res) => {
  try {
    const { message, subject } = req.body;
    if (!message || !String(message).trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const subs = await NewsletterSubscriber.find({ subscribed: true }).select('email')
    const emails = subs.map(s => s.email)

    // Send emails if SMTP configured
    const { sent, errors } = await sendNewsletterEmails(emails, subject, String(message).trim())

    const saved = await NewsletterMessage.create({
      subject: subject || 'Announcement from techblog',
      message: String(message).trim(),
      stats: { totalRecipients: emails.length, sent, errors: errors.length }
    })

    return res.status(201).json({ success: true, message: `Broadcast processed: ${sent}/${emails.length} sent`, item: saved, errors });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to broadcast message' });
  }
}
