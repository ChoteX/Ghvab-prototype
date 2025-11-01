import Navbar from "@/components/Navbar";
import SchoolSearch from "@/components/SchoolSearch";
import Footer from "@/components/Footer";
import chalkboardBg from "@/assets/chalkboard-bg.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${chalkboardBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        <main className="container mx-auto px-4 py-16 relative z-10 animate-fade-in">
          <div className="text-center pt-16 pb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              Your entire coursework
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                in one place
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Visual explanations, interactive unit tests, unlimited exercises and more
            </p>
          </div>
          <SchoolSearch />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
