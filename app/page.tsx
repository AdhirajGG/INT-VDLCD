// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { Factory, CircuitBoard, Shield, Rocket, LayoutDashboard, LogIn, UserPlus, Warehouse, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserButton, useUser } from "@clerk/nextjs";
import CollapsibleCards from "@/components/CollapsibleCards";

export default function Landing() {
  const { isSignedIn } = useUser();
  const [categories, setCategories] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  // Add state for email
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { user } = useUser(); // Get user
  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Add scroll function
  const scrollToCTA = () => {
    document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Add submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await axios.post("/api/contact", { name, email });
      if (response.data.success) {
        setSubmitSuccess(true);
        setName("");
        setEmail("");
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError("Failed to submit. Please try again later.");
      }
    } catch (error) {
      setSubmitError("Failed to submit. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data));
    axios.get('/api/videos').then(res => {
      const allVideos = res.data.flatMap((cat: any) => cat.videos);
      setVideos(allVideos.slice(0, 4)); // Get first 4 videos
    });
  }, []);

  // Fetch latest posts in useEffect
  useEffect(() => {
    axios.get('/api/blog?limit=3').then(res => setLatestPosts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900 relative">
      {/* Auth Buttons */}
      
      <div className="absolute right-4 top-4 flex gap-3 z-50">
        
        {isSignedIn ? (
          <Link href="/dashboard">
            <Button className="rounded-full px-6 gap-2 bg-indigo-600 hover:bg-indigo-700">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          
        ) : (
          <>
          <Link href="/dashboard">
            <Button className="rounded-full px-6 gap-2 bg-indigo-600 hover:bg-indigo-700">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="rounded-full px-6 gap-2 border-indigo-500 text-white-100 hover:bg-indigo-900/50">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full px-6 gap-2 bg-indigo-600 hover:bg-indigo-700">
                <UserPlus className="h-4 w-4" />
                Register
              </Button>
            </Link>
          </>
        )}<UserButton/>
      </div>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Industrial Automation Solutions
          </h1>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Transforming manufacturing through advanced control systems and IoT integration
          </p>
          <div className="flex gap-4 justify-center">

            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg bg-indigo-600 hover:bg-indigo-700"
              onClick={scrollToCTA}
            >
              Schedule Demo
              <Rocket className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </header>

      {/* Products & Videos Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-indigo-100">Our Products & Videos</h2>
          <p className="text-indigo-300 max-w-2xl mx-auto">
            Explore our range of industrial automation solutions and instructional videos
          </p>
        </div>
        
        {/* Show CollapsibleCards for all users */}
        <div className="mt-8">
          <CollapsibleCards categories={categories} videos={videos} />
        </div>
      </section>
      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-indigo-100">Why Choose VDLCD?</h2>
          <p className="text-indigo-300 max-w-2xl mx-auto">
            Enterprise-grade industrial automation solutions trusted by global manufacturers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: CircuitBoard, title: "Smart Control Systems", desc: "Real-time monitoring and control" },
            { icon: Shield, title: "Cybersecurity", desc: "Industrial-grade security protocols" },
            { icon: Factory, title: "Line Integration", desc: "Seamless production line integration" },
            { icon: Rocket, title: "Rapid Deployment", desc: "Cloud & on-premise solutions" },
            { icon: Factory, title: "PLC Programming", desc: "Customized automation logic" },
            { icon: CircuitBoard, title: "IoT Enabled", desc: "Industry 4.0 ready solutions" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-indigo-900/30 border-indigo-800/50 hover:border-indigo-500 transition-colors">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-cyan-400 mb-4" />
                  <CardTitle className="text-indigo-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-indigo-300">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>






      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-indigo-100">Latest Blog Posts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {latestPosts.map(post => (
            <motion.div key={post.id} whileHover={{ y: -5 }} className="bg-indigo-900/30 rounded-2xl p-6"
            
            >
              {post.image && (
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <img src={post.image} alt={post.title} className="object-cover w-full h-full" />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-indigo-100">{post.title}</h3>
              <p className="text-indigo-300 mb-4">{post.excerpt || "Read more..."}</p>
              <Link href={`/blog/${post.slug}`} className="text-indigo-400 hover:text-indigo-300">
                Read more
              </Link>
            </motion.div>
          ))}
        </div>




      </section>

      {/* Stats Section */}
      <section className="bg-indigo-900/40 py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-bold text-cyan-400">200+</div>
            <div className="text-indigo-200">Automation Projects</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold text-cyan-400">99.98%</div>
            <div className="text-indigo-200">System Uptime</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold text-cyan-400">24/7</div>
            <div className="text-indigo-200">Global Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          className="bg-gradient-to-r from-indigo-900 to-cyan-900/50 rounded-3xl p-12 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-indigo-100">Ready to Automate Your Production?</h2>
          <p className="text-indigo-300 mb-8 max-w-xl mx-auto">
            Connect with our industrial automation experts today
          </p>
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded-lg">
              Thank you! We'll contact you shortly.
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <input
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              pattern="[A-Za-z\s]+"
              title="Name must contain only letters"
              className="w-full rounded-full bg-indigo-800/30 border border-indigo-700 px-6 py-4 text-indigo-100 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              placeholder="Work Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-full bg-indigo-800/30 border border-indigo-700 px-6 py-4 text-indigo-100 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <Button
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full py-6 text-lg bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Request Consultation"}
            </Button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}