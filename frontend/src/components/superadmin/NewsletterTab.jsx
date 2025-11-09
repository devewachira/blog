import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsletterTab = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('Announcement from techblog');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get('/api/v1/superadmin/newsletter/subscribers');
      if (response.data.success) {
        setSubscribers(response.data.subscribers);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setSending(true);
    try {
      const response = await axios.post('/api/v1/superadmin/newsletter/broadcast', { subject: subject?.trim() || undefined, message: message.trim() });
      if (response.data.success) {
        const sent = response.data.item?.stats?.sent ?? 0;
        const total = response.data.item?.stats?.totalRecipients ?? 0;
        const firstErr = Array.isArray(response.data.errors) && response.data.errors.length > 0 ? response.data.errors[0]?.error || response.data.errors[0] : null;
        if (sent === 0 && firstErr) {
          alert(`Broadcast attempted but no emails were sent. Reason: ${firstErr}`);
        } else {
          alert(`Broadcast sent: ${sent}/${total}`);
        }
        setMessage('');
      } else {
        alert('Failed to send broadcast');
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      alert('Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  if (loading) {
    return <div className="p-4">Loading newsletter data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Broadcast Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Send Broadcast Message</h3>
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="Announcement from techblog"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to all subscribers ({subscribers.length} recipients)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              rows="4"
              placeholder="Enter your message here..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending...' : 'Send Broadcast'}
          </button>
        </form>
      </div>

      {/* Subscribers List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Newsletter Subscribers</h3>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {subscribers.length} subscribers
          </span>
        </div>
        
        {subscribers.length === 0 ? (
          <p className="text-gray-500">No subscribers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.subscribed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.subscribed ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscriber.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterTab;