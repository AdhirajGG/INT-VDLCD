// app/(dashboard)/(routes)/blog/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { colors } from "@/lib/colors";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  excerpt: string | null;
  createdAt: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    axios.get("/api/blog")
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
        <div className="text-center p-8 rounded-xl" style={{ background: colors.background.main }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Sign in required
          </h2>
          <p className="mb-6" style={{ color: colors.text.secondary }}>
            Please sign in to view our blog content
          </p>
          <Link href="/sign-in">
            <Button className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ background: colors.background.dark }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: colors.background.dark }}>
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: colors.text.primary }}
        >
          Blog
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden border"
              style={{ background: colors.background.light, borderColor: colors.primary.dark }}
            >
              {post.image && (
                <div className="relative h-48 w-full">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                  {post.title}
                </h2>
                <p 
                  className="text-sm mb-4"
                  style={{ color: colors.text.secondary }}
                >
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-4" style={{ color: colors.text.secondary }}>
                  {post.excerpt}
                </p>
                <Link href={`/blog/${post.slug}`} className="text-indigo-400 hover:text-indigo-300">
                  Read more
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}