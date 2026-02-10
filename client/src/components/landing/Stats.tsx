import { motion } from 'framer-motion';

const stats = [
  { value: "10k+", label: "Active Students" },
  { value: "500+", label: "Curated Resources" },
  { value: "50+", label: "Learning Roadmaps" },
  { value: "99%", label: "Satisfaction Rate" }
];

const Stats = () => {
  return (
    <div className="py-20 bg-primary/5 border-y border-primary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            >
              <h3 className="text-4xl md:text-6xl font-black text-primary mb-2">
                {stat.value}
              </h3>
              <p className="text-base-content/70 font-medium uppercase tracking-wider text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
