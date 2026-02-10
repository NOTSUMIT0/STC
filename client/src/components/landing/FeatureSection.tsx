import { motion } from 'framer-motion';
import {
  MapIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    title: "Interactive Roadmaps",
    description: "Visual learning paths for Frontend, Backend, AI, and more. Track your progress node by node.",
    icon: MapIcon,
    color: "primary",
    delay: 0
  },
  {
    title: "Curated Resources",
    description: "Access a verified library of books, articles, and video tutorials. No more endless searching.",
    icon: BookOpenIcon,
    color: "secondary",
    delay: 0.1
  },
  {
    title: "Vibrant Community",
    description: "Join study groups, ask questions, and collaborate with peers who share your goals.",
    icon: UserGroupIcon,
    color: "accent",
    delay: 0.2
  },
  {
    title: "Smart Analytics",
    description: "Visual insights into your learning habits. Set goals, track streaks, and stay motivated.",
    icon: ChartBarIcon,
    color: "info",
    delay: 0.3
  }
];

const FeatureSection = () => {
  return (
    <div className="py-32 px-6 bg-base-100 relative">
      <div className="text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Everything You Need to <span className="text-primary">Excel</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-base-content/60 max-w-2xl mx-auto"
        >
          We've combined the best tools into one seamless platform.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: feature.delay }}
            whileHover={{ y: -10 }}
            className="card bg-base-200/50 border border-base-content/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
          >
            <div className="card-body items-center text-center">
              <div className={`p-4 rounded-2xl bg-${feature.color}/10 mb-6 text-${feature.color}`}>
                <feature.icon className="w-10 h-10" />
              </div>
              <h3 className="card-title text-2xl mb-2">{feature.title}</h3>
              <p className="text-base-content/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
