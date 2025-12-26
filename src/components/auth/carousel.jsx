import { motion } from "framer-motion";
import CarouselContainer from "./carousel-container";
import CarouselButtons from "./carousel-buttons";
import DecorativeSVG from "./decorative-svg";

export default function Carousel({
  testimonials,
  testimonialIndex,
  handleCarouselChange,
}) {
  const current = testimonials[testimonialIndex];

  const getCarouselRotation = (index) => {
    const diff = index - testimonialIndex;
    let position = diff;

    if (diff > 1) position = diff - testimonials.length;
    if (diff < -1) position = diff + testimonials.length;

    return position;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="hidden lg:flex lg:col-span-3 flex-col justify-between p-8 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent border-l border-white/10 relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-white">{current.title}</h2>
        <p className="text-blue-200 text-sm mt-2">{current.description}</p>
      </motion.div>

      <CarouselContainer
        testimonials={testimonials}
        testimonialIndex={testimonialIndex}
        getCarouselRotation={getCarouselRotation}
        handleCarouselChange={handleCarouselChange}
      />

      <CarouselButtons handleCarouselChange={handleCarouselChange} />

      <DecorativeSVG />
    </motion.div>
  );
}
