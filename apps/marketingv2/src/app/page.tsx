import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrustedBy } from "@/components/trusted-by";
import { PlatformOverview } from "@/components/platform-overview";
import { ProductStorytelling } from "@/components/product-storytelling";
import { FeatureShowcase } from "@/components/feature-showcase";
import { DeveloperExperience } from "@/components/developer-experience";
import { ApiShowcase } from "@/components/api-showcase";
import { SdkShowcase } from "@/components/sdk-showcase";
import { EnterpriseInfrastructure } from "@/components/enterprise-infrastructure";
import { PerformanceMetrics } from "@/components/performance-metrics";
import { ArchitectureVisualization } from "@/components/architecture-visualization";
import { Security } from "@/components/security";
import { Integrations } from "@/components/integrations";
import { Workflow } from "@/components/workflow";
import { CustomerStories } from "@/components/customer-stories";
import { UseCases } from "@/components/use-cases";
import { Comparison } from "@/components/comparison";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
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
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}