import ExperiencedTeamCard from './ExperiencedTeamCard';
import Navbar from './Navbar';
import Footer from './Footer';

function CardDemo() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-light mb-4" style={{ color: '#1F1F1F' }}>
              Team Card Component
            </h1>
            <p className="text-base font-light" style={{ color: '#6B7280' }}>
              Modern medical aesthetic clinic card design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ExperiencedTeamCard />
            <ExperiencedTeamCard />
            <ExperiencedTeamCard />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CardDemo;
