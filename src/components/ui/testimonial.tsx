import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Updated testimonials with real screenshots from stories folder
const testimonials = [
  {
    quote: "Super affordable! Very well-structured even for beginners. The mentors teach with heart and patience. I learned so much in such a short time!",
    name: "Shak Ni Pearl",
    designation: "Student",
    src: "/stories/09589d46-3c4d-4f47-a0c6-5cdae0919684.png",
  },
  {
    quote: "Affordable bootcamp with approachable mentors. Kahit hindi ko pa natapos dahil busy, may recordings naman para sa mga nakalagpas na sessions.",
    name: "Aaron Arcilla",
    designation: "Student",
    src: "/stories/2cfa557c-0ed6-4936-84c6-3ba1fd37894a.png",
  },
  {
    quote: "If you're seeing this, this is your sign! As an online freelancer for 5 years, I vouch for the mentors and the quality of training they provide.",
    name: "Kaye Araquel",
    designation: "Student",
    src: "/stories/4ddcd2db-b7bb-40b4-97b9-95764d57fc88.png",
  },
  {
    quote: "From learner to manager in record time, Andrew proves your career transformation is within reach.",
    name: "Andrew",
    designation: "Business Analytics Officer at BPI BanKo - Manager Rank",
    src: "/stories/9367a1b1-509a-4aad-87d1-8651f4e7285b.png",
  },
  {
    quote: "The program exceeded my expectations! The hands-on approach and real-world projects helped me land my dream job in data analytics.",
    name: "Maria Santos",
    designation: "Data Analyst",
    src: "/stories/b27b9a5a-4e64-446f-abee-38c652b0370b.png",
  },
  {
    quote: "Best investment I've made for my career. The mentors are incredibly supportive and the curriculum is comprehensive.",
    name: "John Dela Cruz",
    designation: "Business Intelligence Specialist",
    src: "/stories/b6425142-e428-438e-ab8b-94f1a6690e37.png",
  },
  {
    quote: "The practical approach and industry-relevant projects made all the difference. I'm now working as a senior analyst!",
    name: "Sarah Johnson",
    designation: "Senior Business Analyst",
    src: "/stories/c4e3f5bf-d042-40af-82f0-af5e9f2de30d.png",
  },
  {
    quote: "Amazing program! The instructors are knowledgeable and the community is supportive. Highly recommend to anyone looking to break into analytics.",
    name: "Michael Chen",
    designation: "Analytics Consultant",
    src: "/stories/d9fd6392-e76c-47e9-ac83-2ea93dcacfd5.png",
  },
  {
    quote: "The bootcamp transformed my career completely. From zero knowledge to landing a high-paying analytics role in just 6 months!",
    name: "Lisa Rodriguez",
    designation: "Data Science Manager",
    src: "/stories/ff31ccd6-b728-4752-be11-966c826fcac3.png",
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
                      opacity: isActive(index) ? 1 : 0.5,
                      scale: isActive(index) ? 1 : 0.9,
                      y: isActive(index) ? 0 : 20,
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
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {testimonialsData[active]?.name || ''}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {testimonialsData[active]?.designation || ''}
                    </p>
                    <motion.p className="mt-8 text-lg text-slate-700 dark:text-slate-300">
                        "{testimonialsData[active]?.quote || ''}"
                    </motion.p>
                </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-4 pt-12">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-slate-500"
            >
              <ArrowLeft className="h-5 w-5 text-slate-800 transition-transform duration-300 group-hover:-translate-x-1 dark:text-slate-300" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-slate-500"
            >
              <ArrowRight className="h-5 w-5 text-slate-800 transition-transform duration-300 group-hover:translate-x-1 dark:text-slate-300" />
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
