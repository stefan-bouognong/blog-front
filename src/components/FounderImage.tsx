import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FounderImageProps {
  src?: string;
  alt?: string;
  className?: string;
  variant?: 'hero' | 'about' | 'sidebar';
}

export function FounderImage({ 
  src, 
  alt = "Eliade Kibangoud Mboungou - Fondateur du FPC",
  className,
  variant = 'hero'
}: FounderImageProps) {
  const placeholderImage = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop&crop=face";
  
  const variants = {
    hero: "w-48 h-48 md:w-64 md:h-64 rounded-full",
    about: "w-full max-w-md aspect-[3/4] rounded-2xl",
    sidebar: "w-full aspect-square rounded-xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden shadow-xl",
        variants[variant],
        className
      )}
    >
      <img
        src={src || placeholderImage}
        alt={alt}
        className="w-full h-full object-cover"
      />
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
    </motion.div>
  );
}
