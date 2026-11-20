import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

export const EDITORIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface EditorialRevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}

/**
 * Smooth GPU-composited reveal triggered once as elements enter the viewport.
 */
export function EditorialReveal({
  children,
  delay = 0,
  y = 22,
  duration = 0.72,
  className,
  ...rest
}: EditorialRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration, delay, ease: EDITORIAL_EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface LineMaskRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  immediate?: boolean;
}

/**
 * Masked vertical glide for display headlines and editorial titles.
 */
export function LineMaskReveal({
  children,
  delay = 0,
  duration = 0.78,
  className,
  immediate = false,
}: LineMaskRevealProps) {
  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        initial={{ opacity: 0, y: '28%' }}
        {...(immediate
          ? { animate: { opacity: 1, y: '0%' } }
          : { whileInView: { opacity: 1, y: '0%' }, viewport: { once: true, amount: 0.15 } })}
        transition={{ duration, delay, ease: EDITORIAL_EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface StaggerGroupProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  immediate?: boolean;
  className?: string;
}

export function StaggerGroup({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  immediate = false,
  className,
  ...rest
}: StaggerGroupProps) {
  return (
    <motion.div
      initial="hidden"
      {...(immediate
        ? { animate: 'visible' }
        : { whileInView: 'visible', viewport: { once: true, amount: 0.1 } })}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  y?: number;
  className?: string;
}

export function StaggerItem({ children, y = 18, className, ...rest }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: EDITORIAL_EASE },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
