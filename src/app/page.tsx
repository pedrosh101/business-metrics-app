"use client";

import { useState } from "react";
import Navbar from "./components/navbar";
import dynamic from "next/dynamic";
import { FC } from "react";

const DynamicDashboard = dynamic(() => import("./components/DashboardSection"));
const DynamicVendors = dynamic(() => import("./components/VendorsSection"));
const DynamicSubscriptions = dynamic(() =>
  import("./components/SubscriptionsSection")
);
const DynamicTranslations = dynamic(() =>
  import("./components/TranslationsSection")
);
const DynamicPages = dynamic(() => import("./components/PagesSection"));
const DynamicConfigurations = dynamic(() =>
  import("./components/ConfigurationsSection")
);

type Section = "dashboard" | "vendors" | "subscriptions" | "translations" | "pages" | "configurations";

const Home: FC = () => {
  const [section, setSection] = useState<Section>("dashboard");

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return <DynamicDashboard />;
      case "vendors":
        return <DynamicVendors />;
      case "subscriptions":
        return <DynamicSubscriptions />;
      case "translations":
        return <DynamicTranslations />;
      case "pages":
        return <DynamicPages />;
      case "configurations":
        return <DynamicConfigurations />;
      default:
        return <DynamicDashboard />;
    }
  };

  return (
    <>
      <main className="flex flex-col sm:flex-row bg-stone-200 text-black">
        <Navbar setSection={setSection} />
        <div className="flex flex-col min-h-screen w-full">
          <div className="bg-[#3b0bf7] px-6 py-4 flex justify-between text-white">
            <h1 className="hover:text-slate-100">DASHBOARD</h1>
            <div className="flex items-center space-x-4">
              <select className="bg-[#3b0bf7] border-none text-white cursor-pointer hover:text-slate-100">
                <option value="en">English</option>
                <option value="pt">Português</option>
                <option value="es">Español</option>
              </select>
              <div className="flex items-center space-x-2">
                <svg
                  viewBox="0 0 1024 1024"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
                </svg>
                <span className="hover:text-slate-100 cursor-pointer">Login</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-start min-h-screen">
            {renderSection()}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;