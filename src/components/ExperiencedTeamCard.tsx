import { Users, ClipboardList, Stethoscope, Heart } from 'lucide-react';

function ExperiencedTeamCard() {
  return (
    <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-40 -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50 to-transparent rounded-full opacity-40 -ml-12 -mb-12"></div>

      {/* Main content container */}
      <div className="relative h-full flex flex-col p-8" style={{ backgroundColor: '#F5F8FA' }}>

        {/* Top illustration area */}
        <div className="flex-shrink-0 mb-6">
          <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-xl shadow-sm overflow-hidden">
            {/* Medical team illustration placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Doctor icons arranged in a professional layout */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border-2" style={{ borderColor: '#1C2B3A' }}>
                    <Users size={28} style={{ color: '#1C2B3A' }} strokeWidth={1.5} />
                  </div>
                  <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border-3" style={{ borderColor: '#1C2B3A', borderWidth: '3px' }}>
                    <Stethoscope size={36} style={{ color: '#1C2B3A' }} strokeWidth={1.5} />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border-2" style={{ borderColor: '#1C2B3A' }}>
                    <Heart size={28} style={{ color: '#1C2B3A' }} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Subtle medical cross elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 opacity-20" style={{ color: '#1C2B3A' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/>
                  </svg>
                </div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 opacity-20" style={{ color: '#1C2B3A' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Abstract background pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="#1C2B3A"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Process icons */}
        <div className="flex-shrink-0 mb-6">
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Users, label: '咨询' },
              { icon: ClipboardList, label: '规划' },
              { icon: Stethoscope, label: '治疗' },
              { icon: Heart, label: '护理' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <item.icon size={20} style={{ color: '#1C2B3A' }} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-light text-center" style={{ color: '#6B7280' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Text content */}
        <div className="flex-grow flex flex-col justify-center text-center space-y-4">
          <h2 className="text-2xl font-normal tracking-wide" style={{ color: '#1F1F1F' }}>
            Experienced Medical Team
          </h2>

          <p className="text-sm font-light leading-relaxed px-2" style={{ color: '#6B7280' }}>
            Our skilled doctors provide transparent consultation, precise treatment planning, and professional care throughout every step of your aesthetic journey.
          </p>
        </div>

        {/* Bottom decorative line */}
        <div className="flex-shrink-0 mt-6">
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: '#1C2B3A', opacity: 0.2 }}></div>
        </div>

      </div>
    </div>
  );
}

export default ExperiencedTeamCard;
