

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Gradient Background Shape */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl transform rotate-3 shadow-lg group-hover:rotate-6 transition-transform duration-300"></div>
      <div className="absolute inset-0 bg-base-100 rounded-xl transform -rotate-3 border border-base-200 group-hover:-rotate-2 transition-transform duration-300"></div>

      {/* Inner Content */}
      <div className="relative z-10 font-black text-2xl tracking-tighter bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent select-none">
        STC
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-base-100 shadow-sm animate-pulse"></div>
    </div>
  );
};

export default Logo;
