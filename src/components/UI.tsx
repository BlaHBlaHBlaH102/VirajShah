import { motion, useScroll, useTransform } from "motion/react";
import { LucideIcon, ArrowRight } from "lucide-react";
import { ReactNode, useRef } from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  tags?: string[];
  date?: string;
  delay?: number;
  className?: string;
  link?: string;
  linkText?: string;
}

export const Card = ({ title, subtitle, description, icon: Icon, tags, date, delay = 0, className = "", link, linkText }: CardProps) => {
  const content = (
    <>
      <div className="flex justify-between items-start mb-8">
        {Icon && (
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
            <Icon size={28} />
          </div>
        )}
        {date && (
          <span className="text-[9px] md:text-[11px] font-mono text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.6em] border border-slate-800 px-3 md:px-4 py-1 md:py-1.5 rounded-full font-light">
            {date}
          </span>
        )}
      </div>
      <h3 className="card-title mb-4">{title}</h3>
      {subtitle && <p className="text-blue-400/80 font-light text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] mb-6">{subtitle}</p>}
      {description && <p className="text-slate-400 text-lg leading-relaxed mb-10 flex-grow font-light">{description}</p>}
      
      {link && linkText && (
        <div className="mb-10">
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
            onClick={(e) => e.stopPropagation()}
          >
            {linkText} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      )}

      {tags && (
        <div className="flex flex-wrap gap-3 mt-auto">
          {tags.map((tag) => (
            <span key={tag} className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] font-light">
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className={`glass p-8 md:p-10 rounded-[2.5rem] card-hover flex flex-col relative z-10 ${className} ${link && !linkText ? 'cursor-pointer' : ''}`}
      onClick={() => link && !linkText && window.open(link, '_blank')}
    >
      {content}
    </motion.div>
  );
};

export const Section = ({ children, id, title, subtitle }: { children: ReactNode; id: string; title?: string; subtitle?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section id={id} ref={ref} className="relative py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-visible z-10">
      
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="mb-16"
        >
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="text-slate-400 max-w-4xl text-lg md:text-xl font-light leading-relaxed tracking-normal">{subtitle}</p>}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-transparent mt-6 rounded-full" />
        </motion.div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};
