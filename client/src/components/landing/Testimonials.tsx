import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    name: "Ritesh Sharma",
    role: "Frontend Developer",
    content: "The interactive roadmaps changed the way I learn. seemingly complex topics like React and Redux became so easy to understand.",
    rating: 5,
    initial: "A",
    color: "bg-primary"
  },
  {
    name: "Manpreet Singh",
    role: "Data Science Student",
    content: "I was struggling to find good resources for Python and AI. This platform curated everything I needed in one place.",
    rating: 5,
    initial: "S",
    color: "bg-secondary"
  },
  {
    name: "Rachit Tanwar",
    role: "Full Stack Engineer",
    content: "The community here is amazing. Getting feedback on my projects from real people helped me land my first job.",
    rating: 5,
    initial: "M",
    color: "bg-accent"
  }
];

const Testimonials = () => {
  return (
    <div className="py-24 bg-base-200/50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Loved by <span className="text-secondary">Students</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-base-content/70 max-w-2xl mx-auto"
          >
            Join thousands of others who are accelerating their careers.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="card bg-base-100 shadow-xl border border-base-content/5 hover:border-primary/20 transition-all duration-300"
            >
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`avatar placeholder`}>
                    <div className={`${t.color} text-white rounded-full w-12 text-xl font-bold`}>
                      <span>{t.initial}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <p className="text-sm text-base-content/60">{t.role}</p>
                  </div>
                </div>

                <div className="flex mb-4 text-warning">
                  {[...Array(t.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5" />
                  ))}
                </div>

                <p className="text-base-content/80 italic">"{t.content}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
