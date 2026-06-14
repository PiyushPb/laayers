"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Zap, Shield, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa] text-slate-900">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 lg:px-12 bg-white/60 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Layers className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tighter">laayers</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="https://blogs.laayers.app" className="hover:text-slate-900 transition-colors">Blogs</Link>
            <Link href="https://chat.laayers.app" className="hover:text-slate-900 transition-colors">Community</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://auth.laayers.app">
              <Button variant="ghost" className="text-slate-600 hover:bg-slate-100 hover:text-slate-900">Sign In</Button>
            </Link>
            <Link href="https://auth.laayers.app">
              <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm">Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center lg:pt-48 lg:pb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm text-blue-700 border border-blue-200 rounded-full bg-blue-50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v2.0 is now live
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900">
              Build your digital world <br className="hidden md:block" />
              with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">absolute precision.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
              Laayers provides the ultimate modular architecture for your applications. Integrate auth, blogs, and chat seamlessly into a unified workspace.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="https://auth.laayers.app">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-lg shadow-slate-900/20">
                  Start Building Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-slate-200 bg-white hover:bg-slate-50 rounded-full shadow-sm">
                View Documentation
              </Button>
            </motion.div>
          </motion.div>
        </main>

        {/* Features Bento Grid */}
        <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Everything you need to scale</h2>
            <p className="text-slate-600 max-w-xl mx-auto">A fully integrated suite of tools designed to help you build faster and deploy with confidence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">Lightning Fast Edge</h3>
              <p className="text-slate-600 leading-relaxed">
                Deployed on the edge with intelligent routing. Your applications load instantly for users globally, ensuring maximum retention and engagement.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="col-span-1 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Secure Auth</h3>
              <p className="text-slate-600">
                Enterprise-grade security built into every layer.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="col-span-1 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center mb-6 text-pink-600 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Global CDN</h3>
              <p className="text-slate-600">
                Distribute your content to over 200+ edge locations worldwide.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900">Modular Apps</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect subdomains like auth.laayers.app and blogs.laayers.app into a seamless unified experience. Your workspace, your rules.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 mt-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold tracking-tighter text-slate-900">laayers</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 Laayers Inc. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-slate-900">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-900">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
