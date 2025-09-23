import React from "react";
import Sidebar from "./sidebar";
import {
  Check,
  Layers,
  Zap,
  MessageCircle,
  Shield,
  ArrowRight,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    features: [
      {
        icon: <Check className="w-5 h-5 text-teal-600" />,
        text: "50 content generations",
      },
      {
        icon: <Layers className="w-5 h-5 text-teal-600" />,
        text: "Basic templates",
      },
      {
        icon: <Zap className="w-5 h-5 text-teal-600" />,
        text: "Readability score",
      },
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Pro",
    price: "₹4,999",
    period: "/month",
    features: [
      {
        icon: <Check className="w-5 h-5 text-teal-600" />,
        text: "500 content generations",
      },
      {
        icon: <Layers className="w-5 h-5 text-teal-600" />,
        text: "Advanced templates",
      },
      {
        icon: <Zap className="w-5 h-5 text-teal-600" />,
        text: "BrandTone Engine™",
      },
      {
        icon: <MessageCircle className="w-5 h-5 text-teal-600" />,
        text: "Marketing suggestions",
      },
    ],
    popular: true,
    cta: "Start Free Trial",
    savings: "Save 17% annually",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      {
        icon: <Check className="w-5 h-5 text-teal-600" />,
        text: "Unlimited requests",
      },
      {
        icon: <Shield className="w-5 h-5 text-teal-600" />,
        text: "API access",
      },
      {
        icon: <MessageCircle className="w-5 h-5 text-teal-600" />,
        text: "Dedicated support",
      },
      {
        icon: <Zap className="w-5 h-5 text-teal-600" />,
        text: "Self-learning agent",
      },
    ],
    popular: false,
    cta: "Contact Sales",
  },
];

const Pricing = () => (
  <div className="flex min-h-screen bg-white font-inter rounded-tl-2xl rounded-bl-2xl">
    <Sidebar />
    {/* Main Content */}
    <main className="flex-1 bg-violet-950 rounded-tr-2xl rounded-br-2xl p-8 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-white text-5xl font-bold">Pricing</h1>
        <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="12" r="8" fill="#D6CFF5" />
            <ellipse cx="18" cy="28" rx="12" ry="7" fill="#D6CFF5" />
            <circle cx="18" cy="12" r="5" fill="#210D5A" opacity="0.2" />
          </svg>
        </div>
      </div>
      <hr className="border-t border-violet-800 mb-8" />

      <section className="flex-1 flex gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col bg-white rounded-xl shadow-lg p-6 flex-1 border-2 ${
              plan.popular
                ? "border-teal-500 scale-105 z-10"
                : "border-transparent"
            }`}
          >
            {plan.popular && (
              <span className="self-center mb-2 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold text-violet-950 mb-2">
              {plan.name}
            </h3>
            <div className="flex items-end mb-2">
              <span className="text-3xl font-extrabold text-violet-950">
                {plan.price}
              </span>
              {plan.period && (
                <span className="ml-1 text-base text-violet-400 font-medium">
                  {plan.period}
                </span>
              )}
            </div>
            {plan.savings && (
              <div className="mb-2 text-teal-600 text-xs font-semibold">
                {plan.savings}
              </div>
            )}
            <ul className="mb-4 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-violet-900">
                  {f.icon}
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-auto px-4 py-2 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                plan.popular
                  ? "bg-teal-500 text-white hover:bg-teal-600"
                  : "bg-violet-100 text-violet-950 hover:bg-violet-200"
              }`}
            >
              {plan.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </section>
    </main>
  </div>
);

export default Pricing;
