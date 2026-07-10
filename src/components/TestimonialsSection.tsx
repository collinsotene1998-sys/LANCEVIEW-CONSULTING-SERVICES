import React from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "I had no idea the county was holding $42,000 from my mother's estate after the tax sale. Lanceview reached out, explained the entire process clearly, and handled all the legal paperwork without asking for a dime upfront. We received our check in just over two months.",
    author: "Sarah Jenkins",
    role: "Heir & Client",
    location: "Orange County, FL"
  },
  {
    id: 2,
    quote: "After losing my property to foreclosure, I felt completely defeated. The Lanceview team was incredibly professional and compassionate. They audited my case, discovered an $89,000 surplus, and their attorneys filed the motion immediately. Their zero-risk promise is real.",
    author: "David M.",
    role: "Former Homeowner",
    location: "Fulton County, GA"
  },
  {
    id: 3,
    quote: "Other firms wanted thousands of dollars in retainer fees just to 'investigate'. Lanceview took our case on contingency, absorbed all the filing fees, and successfully recovered funds we didn't even know existed. Highly recommend their auditing team.",
    author: "The Rodriguez Family",
    role: "Clients",
    location: "Los Angeles County, CA"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-editorial-bg border-y border-editorial-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-editorial-ink tracking-tight mb-4">
            Proven Results, Zero Risk
          </h2>
          <p className="text-editorial-muted text-lg">
            Don't just take our word for it. Hear from clients who have successfully recovered their surplus funds through our strict contingency model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-editorial-paper border border-editorial-card rounded-xl p-8 flex flex-col relative overflow-hidden"
            >
              {/* Decorative background element */}
              <Quote className="absolute top-6 right-6 w-24 h-24 text-editorial-muted/5 -z-0 transform rotate-12" />
              
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-editorial-rust text-editorial-rust" />
                ))}
              </div>
              
              <blockquote className="flex-1 text-editorial-ink/90 font-serif italic mb-8 relative z-10 text-lg leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="relative z-10 border-t border-editorial-card pt-6">
                <div className="font-semibold text-editorial-ink">
                  {testimonial.author}
                </div>
                <div className="text-sm text-editorial-muted mt-1">
                  {testimonial.role} &bull; {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
