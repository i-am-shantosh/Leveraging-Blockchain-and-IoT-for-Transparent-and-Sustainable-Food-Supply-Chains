import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { RocketIcon, LeafIcon, ShieldCheckIcon } from "https://esm.sh/lucide-react";

const Button = ({ children }) => (
  <button className="mt-6 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl">
    {children}
  </button>
);

const Card = ({ icon: Icon, title, text }) => (
  <div className="shadow-md rounded-2xl bg-white">
    <div className="p-6 text-center">
      <Icon className="mx-auto h-10 w-10 text-green-500" />
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  </div>
);

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6 font-sans">
      <header className="text-center py-12">
        <h1 className="text-4xl font-bold text-green-700">Blockchain-Powered Sustainable Food Supply</h1>
        <p className="mt-4 text-lg text-gray-600">
          Leveraging Blockchain and IoT for Transparency and Trust in the Food Chain
        </p>
        <Button>View Project on GitHub</Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
        <Card icon={RocketIcon} title="Smart Tracking" text="Real-time monitoring of food transportation using IoT sensors to record temperature, humidity, and location." />
        <Card icon={ShieldCheckIcon} title="Secure Data Ledger" text="Blockchain ensures that collected data is immutable, verifiable, and trusted by all stakeholders." />
        <Card icon={LeafIcon} title="Sustainable Goals" text="Promotes food safety, reduces waste, and supports environmentally sustainable practices." />
      </section>

      <footer className="mt-20 text-center text-sm text-gray-500">
        © 2025 FoodChain Research | Built with ❤️ using React & Tailwind CSS
      </footer>
    </div>
  );
}

ReactDOM.render(<HomePage />, document.getElementById("root"));
