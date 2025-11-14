import React from "react";
import {
  MapPin,
  Calendar,
  Users,
  Zap,
  ArrowRight,
  Map,
  Brain,
  Share2,
  Settings,
  ChevronDown,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Map className="w-8 h-8" />,
      title: "Smart Map & Discovery",
      description:
        "Explore Cebu's famous spots with real-time location awareness and instant notifications when nearby attractions.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Itineraries",
      description:
        "Get personalized travel plans optimized for your budget, interests, and time. Let AI handle the planning.",
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Community Feed",
      description:
        "Share your travel experiences, photos, and get real-time feedback from other Cebu travelers.",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Trip Planning",
      description:
        "Organize activities with traffic analysis, weather forecasts, and optimized routes for each day.",
    },
  ];

  const screens = [
    {
      name: "Map & Home",
      description:
        "Discover nearby attractions with interactive pins and geofencing alerts",
    },
    {
      name: "AI Planner",
      description:
        "Generate personalized itineraries based on your preferences",
    },
    {
      name: "Social Feed",
      description: "Connect with travelers and share your Cebu adventures",
    },
    {
      name: "Your Profile",
      description: "Manage your posts and saved favorite locations",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Sugoyage</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-red-600 transition"
            >
              Features
            </a>
            <a
              href="#screens"
              className="text-gray-700 hover:text-red-600 transition"
            >
              App Screens
            </a>
            <a
              href="#tech"
              className="text-gray-700 hover:text-red-600 transition"
            >
              Tech Stack
            </a>
          </div>
          <button
            onClick={() => navigate("/auth/login")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                Your Smart Travel Assistant
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Explore Cebu Smarter
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover hidden gems, get AI-powered personalized itineraries,
                and share your travel experiences with a community of explorers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2">
                  Download App <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-red-600 hover:text-red-600 transition font-semibold">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl blur-3xl opacity-60"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="w-16 h-16 text-red-600 mx-auto" />
                  <p className="text-gray-600 font-medium">
                    Cebu's Smart Travel Guide
                  </p>
                  <div className="flex gap-2 justify-center">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-red-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <p className="text-red-100">Famous Spots</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <p className="text-red-100">Community Posts</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                AI-Powered
              </div>
              <p className="text-red-100">Trip Planning</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                Real-time
              </div>
              <p className="text-red-100">Notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to make your Cebu journey unforgettable
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition"
              >
                <div className="text-red-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screens Section */}
      <section id="screens" className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Meet the App
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Navigate through 5 intuitive screens designed for seamless travel
              planning
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {screens.map((screen, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 font-bold text-lg">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {screen.name}
                </h3>
                <p className="text-sm text-gray-600">{screen.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Built on Modern Tech
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powered by free and open-source technologies for scalability and
              reliability
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Frontend</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  React Native
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  React Native Maps
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Backend & Services
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  Firebase (Auth, Firestore, Storage)
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  Gemini AI API
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Location & Routing
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  OpenRouteService
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  Turf.js Geofencing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Development Phases */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Development Roadmap
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              5 strategic phases to bring Sugoyage to life
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                phase: "Phase 1",
                title: "Foundation & Auth",
                time: "4 Weeks",
                color: "from-red-500",
              },
              {
                phase: "Phase 2",
                title: "Location Core & Geofencing",
                time: "6 Weeks",
                color: "from-orange-500",
              },
              {
                phase: "Phase 3",
                title: "Social Community",
                time: "6 Weeks",
                color: "from-yellow-500",
              },
              {
                phase: "Phase 4",
                title: "AI Planning & Analysis",
                time: "8 Weeks",
                color: "from-green-500",
              },
              {
                phase: "Phase 5",
                title: "Testing & Launch",
                time: "4 Weeks",
                color: "from-blue-500",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-6">
                <div
                  className={`bg-gradient-to-br ${item.color} to-transparent w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                >
                  {index + 1}
                </div>
                <div className="bg-white rounded-lg p-6 flex-grow border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        {item.phase}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <div className="text-sm font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-lg w-fit">
                      {item.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Explore Cebu?
          </h2>
          <p className="text-lg text-red-100">
            Join thousands of travelers discovering the best of Cebu with
            Sugoyage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button className="bg-white text-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition font-semibold">
              Download on App Store
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-red-500 transition font-semibold">
              Get on Google Play
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Social</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">
              &copy; 2025 Sugoyage. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
