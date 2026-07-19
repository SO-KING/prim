import { Link } from 'react-router-dom';
import { Shield, Truck, Headphones, Heart, Award, Users, Package, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { useScrollReveal } from '../hooks/useScrollReveal';

function Counter({ end, suffix = '', label }: { end: number; suffix?: string; label: string }) {
  const { ref, isVisible } = useScrollReveal();
  const count = isVisible ? end : 0;

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-accent-600 dark:text-accent-400 mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function TeamMember({ name, role, image }: { name: string; role: string; image: string }) {
  return (
    <AnimatedSection className="text-center group">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-accent-200 dark:ring-accent-800 group-hover:ring-4 group-hover:ring-accent-500 transition-all duration-300">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
      <p className="text-sm text-slate-500">{role}</p>
    </AnimatedSection>
  );
}

export default function About() {
  const features = [
    { icon: Shield, title: 'Secure Shopping', desc: 'Your data is protected with enterprise-grade encryption and security protocols.' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over $200. Delivery within 3-5 business days worldwide.' },
    { icon: Heart, title: 'Quality Guarantee', desc: 'We stand behind every product. 30-day money-back guarantee on all purchases.' },
    { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated support team is always ready to help you anytime, anywhere.' },
    { icon: Award, title: 'Premium Brands', desc: 'We partner with world-class brands to bring you the best products available.' },
    { icon: Users, title: 'Community', desc: 'Join millions of satisfied customers who trust ShopPro for their shopping needs.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Our Mission is to<br />Make Shopping <span className="text-yellow-300">Awesome</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              We're on a mission to transform the online shopping experience. Quality products, 
              exceptional service, and a platform you can trust.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter end={150} suffix="K" label="Happy Customers" />
            <Counter end={50} suffix="K" label="Products Sold" />
            <Counter end={500} suffix="+" label="Brand Partners" />
            <Counter end={99} suffix="%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-accent-600 uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
                From a Small Idea to a Global Platform
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  ShopPro started in 2020 with a simple vision: make premium products accessible 
                  to everyone, everywhere. What began as a small online store has grown into a 
                  trusted global marketplace serving millions of customers.
                </p>
                <p>
                  Our team of dedicated professionals works tirelessly to curate the finest products, 
                  negotiate the best prices, and ensure every shopping experience exceeds expectations. 
                  We believe in quality, transparency, and putting our customers first.
                </p>
                <p>
                  Today, we partner with over 500 brands across 6 categories, offering everything 
                  from electronics to fashion, home goods to sports equipment. And we're just getting started.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800" alt="Our team" className="w-full h-full object-cover" />
              </div>
                <div className="absolute -bottom-6 -left-6 bg-slate-900 dark:bg-slate-800 text-white p-6 rounded-2xl shadow-xl">
                <Package className="h-8 w-8 mb-2" />
                <div className="text-2xl font-bold">150K+</div>
                <div className="text-sm text-white/80">Customers Served</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features */}
      <section className="bg-slate-50 dark:bg-slate-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sm font-semibold text-accent-600 uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Everything You Need in One Place
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 100}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-slate-700 dark:text-slate-300 dark:group-hover:text-slate-900 transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection className="text-center mb-12">
          <span className="text-sm font-semibold text-accent-600 uppercase tracking-wider">Our Team</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
            Meet the People Behind ShopPro
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <TeamMember name="Ahmed Hassan" role="CEO & Founder" image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" />
          <TeamMember name="Sara Mohamed" role="CTO" image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" />
          <TeamMember name="Omar Khaled" role="Head of Design" image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" />
          <TeamMember name="Lina Ahmed" role="Marketing Director" image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200" />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedSection>
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-950 dark:to-black rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">Join thousands of happy customers. Get started today!</p>
              <Link to="/products" className="inline-flex items-center px-6 py-3 bg-white text-accent-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
                Browse Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
