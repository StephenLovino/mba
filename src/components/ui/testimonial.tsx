import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Updated testimonials with real screenshots from stories folder
// Now using properly named image files
const testimonials = [
  {
    quote: "If you're seeing this, this is your sign! As an online freelancer for 5 years, I vouch for the mentors and the quality of training they provide.",
    name: "Kaye Araquel",
    designation: "Student",
    src: "/stories/Kaye.png",
  },
  {
    quote: "Affordable bootcamp with approachable mentors. Kahit hindi ko pa natapos dahil busy, may recordings naman para sa mga nakalagpas na sessions.",
    name: "Aaron Arcilla",
    designation: "Student",
    src: "/stories/Aaron.png",
  },
  {
    quote: "From learner to manager in record time, Andrew proves your career transformation is within reach.",
    name: "Andrew",
    designation: "Business Analytics Officer at BPI BanKo - Manager Rank",
    src: "/stories/Andrew.png",
  },
  {
    quote: "Super affordable! Very well-structured even for beginners. The mentors teach with heart and patience. I learned so much in such a short time!",
    name: "Shak Ni Pearl",
    designation: "Student",
    src: "/stories/Shak.png",
  },
  {
    quote: "The program exceeded my expectations! The hands-on approach and real-world projects helped me land my dream job in data analytics.",
    name: "Elvira",
    designation: "Data Analyst",
    src: "/stories/Elvira.png",
  },
  {
    quote: "Best investment I've made for my career. The mentors are incredibly supportive and the curriculum is comprehensive.",
    name: "Jona",
    designation: "Business Intelligence Specialist",
    src: "/stories/Jona.png",
  },
  {
    quote: "The practical approach and industry-relevant projects made all the difference. I'm now working as a senior analyst!",
    name: "Mae",
    designation: "Senior Business Analyst",
    src: "/stories/Mae.png",
  },
  {
    quote: "Amazing program! The instructors are knowledgeable and the community is supportive. Highly recommend to anyone looking to break into analytics.",
    name: "Normilah",
    designation: "Student",
    src: "/stories/Normila.png",
  },
];

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

const AnimatedTestimonials = ({
  testimonials: testimonialsData = [],
  autoplay = true,
}: {
  testimonials?: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % Math.max(testimonialsData.length, 1));
  }, [testimonialsData.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + Math.max(testimonialsData.length, 1)) % Math.max(testimonialsData.length, 1));
  }, [testimonialsData.length]);

  useEffect(() => {
    if (!autoplay || testimonialsData.length === 0) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext, testimonialsData.length]);

  if (testimonialsData.length === 0) {
    return <div>No testimonials available</div>;
  }

  const isActive = (index: number) => index === active;
  const randomRotate = () => `${Math.floor(Math.random() * 16) - 8}deg`;

  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-6xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-16">
        {/* Image Section */}
        <div className="flex items-center justify-center">
            <div className="relative h-80 w-full max-w-sm md:h-96 md:max-w-md lg:h-[28rem] lg:max-w-lg">
              <AnimatePresence>
                {testimonialsData.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.src}
                    initial={{ opacity: 0, scale: 0.9, y: 50, rotate: randomRotate() }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.15,
                      scale: isActive(index) ? 1 : 0.85,
                      y: isActive(index) ? 0 : 30,
                      zIndex: isActive(index) ? testimonialsData.length : testimonialsData.length - Math.abs(index - active),
                      rotate: isActive(index) ? '0deg' : randomRotate(),
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 origin-bottom"
                    style={{ perspective: '1000px' }}
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={600}
                      height={600}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-contain shadow-2xl bg-white/5 border border-white/10"
                    style={{
                      filter: isActive(index) ? 'none' : 'blur(2px) brightness(0.3)',
                    }}
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/600x600/e2e8f0/64748b?text=${testimonial.name.charAt(0)}`;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
        </div>

        {/* Text and Controls Section */}
        <div className="flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col justify-between"
            >
                <div>
                    <h3 className="text-2xl font-bold text-white">
                        {testimonialsData[active]?.name || ''}
                    </h3>
                    <p className="text-sm text-gray-300">
                        {testimonialsData[active]?.designation || ''}
                    </p>
                    <motion.p className="mt-8 text-lg text-gray-200">
                        "{testimonialsData[active]?.quote || ''}"
                    </motion.p>
                </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-4 pt-12">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <ArrowLeft className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <ArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the main component for use in other parts of the app
export { AnimatedTestimonials, testimonials };
export default AnimatedTestimonials;
