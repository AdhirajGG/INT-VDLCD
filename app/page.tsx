// app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Factory, CircuitBoard, Shield, Rocket,
  LayoutDashboard, Warehouse, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import CollapsibleCards from "@/components/CollapsibleCards";
import Image from "next/image";
import LandingNavbar from "@/components/landing-navbar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import "react-phone-number-input/style.css";
import { toast } from "sonner";

export default function Landing() {
  const { isSignedIn, user } = useUser();
  const [categories, setCategories] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const [phone, setPhone] = useState<string | undefined>("");
  const [message, setMessage] = useState<string>('');
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAdmin = user?.publicMetadata?.role === "admin";

  const scrollToCTA = () => {
    document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch data
  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data));
    axios.get('/api/videos').then(res => {
      const allVideos = res.data.flatMap((cat: any) => cat.videos);
      setVideos(allVideos.slice(0, 4));
    });
    axios.get('/api/blog?limit=3').then(res => setLatestPosts(res.data));
    axios.get('/api/testimonials').then(res => setTestimonials(res.data));
    axios.get('/api/slides').then(res => setSlides(res.data));
  }, []);

  // Slideshow auto-play
  useEffect(() => {
    if (slides.length > 1 && !isPaused) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [slides.length, isPaused]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation
    if (!name || !phone || !message) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      toast.error("Name must contain only letters and spaces");
      setIsSubmitting(false);
      return;
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      toast.error("Please enter a valid phone number");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("/api/contact", {
        name,
        phone,
        message
      });

      if (response.data.success) {
        setName("");
        setPhone("");
        setMessage("");
        toast.success("Request submitted! We'll contact you shortly");
      } else {
        const errorMessage = response.data.error || "Failed to submit request";

        if (errorMessage.includes("phone")) {
          toast.error("Phone error: " + errorMessage);
        } else if (errorMessage.includes("Name")) {
          toast.error("Name error: " + errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
        error.message ||
        "Network error. Please try again";
      toast.error("Submission failed: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    resetTimer();
  };

  const resetTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    slideInterval.current = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900 relative">
      <LandingNavbar />

      {/* Hero Section */}
      <header className="container  mx-auto px-4 py-16 text-center">



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
          {/* Slideshow Section */}
          {slides.length > 0 && (
            <div
              className="relative w-full max-w-4xl mx-auto h-120 rounded-2xl overflow-hidden mb-12 shadow-xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slides */}
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <Image
                    src={slide.imageUrl}
                    alt="Slideshow"
                    fill
                    className="object-cover"
                  />

                  {/* Top Text */}
                  {slide.topText && (
                    <div className="absolute top-0 left-0 right-0 bg-black/50 p-4 text-white text-xl font-bold text-center">
                      {slide.topText}
                    </div>
                  )}

                  {/* Bottom Text */}
                  {slide.bottomText && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white text-xl font-bold text-center">
                      {slide.bottomText}
                    </div>
                  )}
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
              >
                <ChevronRight size={24} />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      resetTimer();
                    }}
                    className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </div>
          )}
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

        <div className="mt-8">
          <CollapsibleCards categories={categories} videos={videos} />
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-indigo-100">What Our Clients Say</h2>
            <p className="text-indigo-300 max-w-2xl mx-auto">
              Hear from industry leaders who have transformed their operations with our solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-indigo-900/30 border-indigo-800/50 hover:border-indigo-500 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      {testimonial.avatarUrl ? (
                        <Image
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full mr-4"
                        />
                      ) : (
                        <div className="bg-indigo-700 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <span className="text-white font-bold">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-indigo-100">{testimonial.name}</h3>
                        <p className="text-indigo-300 text-sm">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-indigo-200 italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

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

      {/* Blog Section */}
      {latestPosts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-indigo-100">Latest Blog Posts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {latestPosts.map(post => (
              <motion.div
                key={post.id}
                whileHover={{ y: -5 }}
                className="bg-indigo-900/30 rounded-2xl p-6"
              >
                {post.image && (
                  <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full"
                      fill
                    />
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
      )}

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

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                pattern="[A-Za-z\s]+"
                title="Name must contain only letters"
                className="w-full rounded-full bg-indigo-800/30 border border-indigo-700 px-6 py-4 text-indigo-100 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <PhoneInput
                international
                defaultCountry="IN"
                value={phone}
                onChange={setPhone}
                required
                className="w-full rounded-full bg-indigo-800/30 border border-indigo-700 px-6 py-4 text-black placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <Textarea
                placeholder="Tell us about your project"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full rounded-2xl bg-indigo-800/30 border border-indigo-700 px-6 py-4 text-indigo-100 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                rows={3}
              />
            </div>

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