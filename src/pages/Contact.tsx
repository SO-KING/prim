import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedSection from '../components/AnimatedSection';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    // Simulate sending
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const contactInfo = [
    { icon: MapPin, title: 'Our Location', desc: '123 Commerce Street, Cairo, Egypt', detail: 'Business District, 5th Floor' },
    { icon: Mail, title: 'Email Us', desc: 'support@shoppro.com', detail: 'We reply within 24 hours' },
    { icon: Phone, title: 'Call Us', desc: '+20 123 456 7890', detail: 'Mon-Fri from 9am to 6pm' },
    { icon: Clock, title: 'Working Hours', desc: 'Monday - Friday', detail: '9:00 AM - 6:00 PM EET' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm mb-6">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              We'd Love to <span className="text-yellow-300">Hear</span> From You
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Have a question, feedback, or just want to say hello? We're here for you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {contactInfo.map((info, i) => (
            <AnimatedSection key={info.title} delay={i * 100}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors duration-300">
                  <info.icon className="h-6 w-6 text-slate-600 dark:text-slate-300 group-hover:text-white dark:group-hover:text-slate-900 transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{info.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{info.desc}</p>
                <p className="text-xs text-slate-400 mt-0.5">{info.detail}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <AnimatedSection>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Send us a Message</h2>
              <p className="text-slate-500 mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none transition-all"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 outline-none transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-accent-500/25 active:scale-[0.98]"
                >
                  {sending ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="h-5 w-5 mr-2" /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </AnimatedSection>

          {/* Map / Info */}
          <AnimatedSection direction="right" delay={200}>
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Visit Our Store</h2>
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13819.385861825345!2d31.2001!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzQwLjAiTiAzMcKwMTInMDAuNCJF!5e0!3m2!1sen!2seg!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="ShopPro Location"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">FAQ</h2>
                <div className="space-y-4">
                  {[
                    { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days domestically and 7-14 days internationally.' },
                    { q: 'What is your return policy?', a: 'We offer a 30-day money-back guarantee on all products. No questions asked.' },
                    { q: 'Do you offer international shipping?', a: 'Yes! We ship to over 50 countries worldwide with tracking included.' },
                  ].map((faq, i) => (
                    <details key={i} className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-slate-900 dark:text-white py-2">
                        {faq.q}
                        <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="text-sm text-slate-500 mt-1 pb-2">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
