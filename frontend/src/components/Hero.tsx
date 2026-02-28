import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";

const Hero = () => {
  return (
    <section className="flex-1 flex items-center justify-between px-16 py-10 bg-white">

      {/* LEFT TEXT */}
      <div className="max-w-xl space-y-6">
        <h2 className="text-5xl font-bold text-primary leading-tight">
          Organize your day. <br />
          Simplify your life.
        </h2>

        <p className="text-secondary text-lg">
          A clean and minimal task manager designed to help you stay focused.
        </p>

        <Link
          to="/login"
          className="inline-block mt-4 px-8 py-3 rounded-full bg-accent text-primary font-medium hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </div>

      {/* RIGHT BIG IMAGE */}
      <div className="w-1/2 flex justify-end">
        <img
          src={hero}
          alt="App Preview"
          className="w-full max-w-2xl object-contain drop-shadow-xl"
        />
      </div>

    </section>
  );
};

export default Hero;