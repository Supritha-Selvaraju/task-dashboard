import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero />
    </div>
  );
};

export default Landing;