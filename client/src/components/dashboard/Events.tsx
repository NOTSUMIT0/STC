import { CalendarDaysIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const events = [
  {
    id: 1,
    title: "Global Hackathon 2026",
    type: "Upcoming",
    date: "March 15, 2026",
    time: "10:00 AM UTC",
    location: "Online",
    image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Join developers from around the world to build the future of education technology."
  },
  {
    id: 2,
    title: "System Design Bootcamp",
    type: "Current",
    date: "Feb 10 - Feb 14, 2026",
    time: "Live Sessions",
    location: "Zoom",
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Deep dive into scalable architectures with industry veterans."
  },
  {
    id: 3,
    title: "AI in 2026: The Next Step",
    type: "Upcoming",
    date: "April 02, 2026",
    time: "5:00 PM EST",
    location: "New York & Online",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    description: "A panel discussion on the ethical implications of AGI."
  }
];

const Events = () => {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Events Hub</h2>

      {/* Featured / Current */}
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="w-2 h-8 bg-secondary rounded-full inline-block"></span> Happening Now</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {events.filter(e => e.type === 'Current').map(event => (
          <div key={event.id} className="card lg:card-side bg-base-100 shadow-xl border border-white/5 overflow-hidden group">
            <figure className="lg:w-1/3 h-64 lg:h-auto relative overflow-hidden">
              <img src={event.image} alt="Event" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-2 left-2 badge badge-secondary animate-pulse">LIVE</div>
            </figure>
            <div className="card-body">
              <h2 className="card-title text-2xl">{event.title}</h2>
              <p className="opacity-70">{event.description}</p>
              <div className="flex flex-col gap-2 mt-2 text-sm text-gray-400">
                <div className="flex items-center gap-2"><CalendarDaysIcon className="w-4 h-4" /> {event.date}</div>
                <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4" /> {event.time}</div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary w-full">Join Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="w-2 h-8 bg-primary rounded-full inline-block"></span> Upcoming Events</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.filter(e => e.type === 'Upcoming').map(event => (
          <div key={event.id} className="card bg-base-100 shadow-xl border border-white/5 hover:-translate-y-2 transition-transform duration-300">
            <figure className="h-48 overflow-hidden relative">
              <img src={event.image} alt="Event" className="object-cover w-full h-full" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            </figure>
            <div className="card-body p-5">
              <h3 className="card-title text-lg">{event.title}</h3>
              <div className="flex flex-col gap-1 mt-2 mb-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><CalendarDaysIcon className="w-3 h-3" /> {event.date}</span>
                <span className="flex items-center gap-1"><MapPinIcon className="w-3 h-3" /> {event.location}</span>
              </div>
              <button className="btn btn-outline btn-sm w-full group-hover:bg-primary group-hover:text-white transition-colors">Register Interest</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
