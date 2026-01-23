import React, { useState, useEffect } from 'react';
import { Mail, User, MessageSquareMore, Send, Sparkles, X, Phone } from 'lucide-react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';

const simulateSubmission = async (formData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Sent!' };
};

export default function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ message: '', type: '', isSubmitting: false });
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch('/icons/Contact Us.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error('Lottie load failed:', err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setStatus({ message: 'Required*', type: 'error' });
            return;
        }
        setStatus({ message: 'Sending...', type: 'info', isSubmitting: true });
        const result = await simulateSubmission(formData);
        setStatus({ message: result.message, type: 'success', isSubmitting: false });
        if (result.success) setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col overflow-hidden">
            
            {/* 1. TIGHT NAV */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    
                    {/* LEFT SIDE (Compressed) */}
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                                Contact <span className="text-teal-600">Us</span>
                            </h1>
                            <p className="text-gray-500 text-sm max-w-xs">
                                Need help? Our team is available 24/7 to assist you.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-50">
                                <Mail size={16} className="text-teal-600 shrink-0" />
                                <span className="text-[11px] font-bold truncate">support@smartrozgar.pk</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-50">
                                <Phone size={16} className="text-teal-600 shrink-0" />
                                <span className="text-[11px] font-bold">+92 300 1234567</span>
                            </div>
                        </div>

                        {/* Smaller Lottie for height saving */}
                        <div className="hidden lg:block w-48 opacity-80">
                            {animationData && <Lottie animationData={animationData} loop={true} />}
                        </div>
                    </div>

                    {/* RIGHT SIDE: COMPACT FORM */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-xl shadow-teal-900/5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {status.message && (
                                <div className={`py-2 px-4 rounded-lg text-[10px] font-bold text-center border ${status.type === 'success' ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                    {status.message}
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="group">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:bg-white transition-all"
                                        />
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500" />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email address"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:bg-white transition-all"
                                        />
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-teal-500" />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Message</label>
                                    <div className="relative">
                                        <textarea
                                            name="message"
                                            rows="3"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us what you need..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:bg-white transition-all resize-none"
                                        />
                                        <MessageSquareMore className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300 group-focus-within:text-teal-500" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status.isSubmitting}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-100 active:scale-[0.98] disabled:opacity-50"
                            >
                                <span className="uppercase tracking-widest text-[10px]">Send Message</span>
                                <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* MINIMAL FOOTER */}
            <footer className="py-4 text-center border-t border-gray-50 shrink-0">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">SmartRozgar Pakistan • 2026</p>
            </footer>
        </div>
    );
}