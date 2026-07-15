import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const JobComments = ({ jobId, jobStatus, hasTasker }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const canComment = hasTasker && jobStatus !== 'cancelled';

  useEffect(() => {
    if (!jobId) return;
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${jobId}/comments`);
        if (res.data.success) setComments(res.data.comments);
      } catch {
        // silent — user may not be logged in
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await axiosInstance.post(`/jobs/${jobId}/comments`, { text: text.trim() });
      if (res.data.success) {
        setComments((prev) => [...prev, res.data.comment]);
        setText('');
        toast.success('Comment added');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare size={14} className="text-teal-600" />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-teal-600" size={20} />
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {comments.length > 0 ? (
            comments.map((c) => {
              const isOwn = c.author?._id === user?.id;
              return (
                <div
                  key={c._id}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={c.author?.profilePicture || `https://ui-avatars.com/api/?name=${c.author?.fullName}&background=0d9488&color=fff&size=32`}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                    alt={c.author?.fullName}
                  />
                  <div className={`max-w-[75%] ${isOwn ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
                      <span className="text-[10px] font-black text-slate-700">{c.author?.fullName}</span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        c.authorRole === 'hirer' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'
                      }`}>
                        {c.authorRole}
                      </span>
                      <span className="text-[9px] text-slate-400">{formatTime(c.createdAt)}</span>
                    </div>
                    <p className={`text-sm text-slate-600 leading-relaxed px-3 py-2 rounded-xl ${
                      isOwn ? 'bg-teal-50 text-right' : 'bg-slate-50'
                    }`}>
                      {c.text}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">
              {canComment ? 'No comments yet — start the conversation' : 'Comments available once a tasker is assigned'}
            </p>
          )}
        </div>
      )}

      {user && canComment && (
        <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            maxLength={1000}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl disabled:opacity-50 transition-all shrink-0"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      )}
    </div>
  );
};

export default JobComments;
