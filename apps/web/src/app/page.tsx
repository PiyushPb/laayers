import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import TrustedBy from "@/components/sections/TrustedBy";
import PlatformOverview from "@/components/sections/PlatformOverview";
import ProductStorytelling from "@/components/sections/ProductStorytelling";
import FeatureShowcase from "@/components/sections/FeatureShowcase";
import DeveloperExperience from "@/components/sections/DeveloperExperience";
import ApiShowcase from "@/components/sections/ApiShowcase";
import SdkShowcase from "@/components/sections/SdkShowcase";
import EnterpriseInfrastructure from "@/components/sections/EnterpriseInfrastructure";
import PerformanceMetrics from "@/components/sections/PerformanceMetrics";
import ArchitectureVisualization from "@/components/sections/ArchitectureVisualization";
import Security from "@/components/sections/Security";
import Integrations from "@/components/sections/Integrations";
import Workflow from "@/components/sections/Workflow";
import CustomerStories from "@/components/sections/CustomerStories";
import UseCases from "@/components/sections/UseCases";
import Comparison from "@/components/sections/Comparison";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col w-full relative">
        <Hero />
        <TrustedBy />
        <PlatformOverview />
        <ProductStorytelling />
        <FeatureShowcase />
        <DeveloperExperience />
        <ApiShowcase />
        <SdkShowcase />
        <EnterpriseInfrastructure />
        <PerformanceMetrics />
        <ArchitectureVisualization />
        <Security />
        <Integrations />
        <Workflow />
        <CustomerStories />
        <UseCases />
        <Comparison />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
