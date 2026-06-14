"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] relative overflow-hidden p-4">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-2xl shadow-slate-200/50">
          <div className="flex justify-center mb-8">
            <Link href="https://laayers.app" className="flex items-center gap-2 group">
              <div className="p-2 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform">
                <Layers className="w-8 h-8 text-blue-600" />
              </div>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 text-sm">Enter your credentials to access your workspace</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 focus-visible:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                className="bg-slate-50 border-slate-200 text-slate-900 h-12 focus-visible:ring-blue-500"
              />
            </div>

            <Button className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-medium text-base shadow-md">
              Sign In
            </Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 rounded-full">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-3 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              Github
            </Button>
          </div>

          <p className="text-center mt-8 text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="#" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
