'use client';

import { useState } from 'react';
import { FREE_ENTRY_ADDRESS_LINES, FREE_ENTRY_INSTRUCTIONS } from '@/lib/free-entry';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
          Get In Touch
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
          Have a question, feedback, or need support? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="animate-fade-in-up lg:col-span-2 space-y-6" style={{ animationDelay: '100ms' }}>
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: 'Email Us',
              value: 'hello@horsepowercomps.co.uk',
              sub: 'We reply within 24 hours',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              title: 'Free Postal Entry Address',
              value: FREE_ENTRY_ADDRESS_LINES.join(', '),
              sub: 'For free competition entries by post',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Support Hours',
              value: 'Mon-Fri, 9am-6pm',
              sub: 'GMT/BST',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 bg-card border border-border rounded-xl p-5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-foreground font-medium">{item.value}</p>
                <p className="text-xs text-muted mt-0.5 font-medium">{item.sub}</p>
              </div>
            </div>
          ))}

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <h3 className="font-bold text-foreground mb-2">Free Postal Entry</h3>
            <p className="text-sm text-muted font-medium leading-relaxed">{FREE_ENTRY_INSTRUCTIONS}</p>
          </div>
        </div>

        <div className="animate-fade-in-up lg:col-span-3" style={{ animationDelay: '200ms' }}>
          {submitted ? (
            <div className="bg-card border border-success/30 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-black text-foreground mb-2">Message Sent!</h2>
              <p className="text-muted mb-6 font-medium">We&apos;ll get back to you within 24 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary-light transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">First Name</label>
                  <input type="text" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Last Name</label>
                  <input type="text" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="Smith" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
                <input type="email" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Subject</label>
                <select className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
                  <option>General Enquiry</option>
                  <option>Prize Question</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                  <option>Complaint</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Message</label>
                <textarea required rows={5} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors resize-none" placeholder="How can we help?" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-[1.02]">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
