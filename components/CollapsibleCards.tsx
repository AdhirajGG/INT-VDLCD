// components/CollapsibleCards.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Warehouse, Play } from "lucide-react";
import { motion } from "framer-motion";
import { colors } from "@/lib/colors";
import Link from "next/link";

interface CollapsibleCardsProps {
  categories: any[];
  videos: any[];
}

export default function CollapsibleCards({ categories, videos }: CollapsibleCardsProps) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  
  const toggleCategory = (id: string) => {
    setOpenCategoryId(prev => prev === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Categories Card */}
      <motion.div whileHover={{ y: -5 }}>
        <Card
          className="border rounded-xl overflow-hidden"
          style={{
            backgroundColor: colors.background.light,
            borderColor: colors.primary.dark,
          }}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span style={{ color: colors.text.primary }}>
                Product Categories
              </span>
              <button
                onClick={() => toggleCategory("products")}
                className="p-2 rounded-full"
                style={{ backgroundColor: colors.primary.dark }}
              >
                {openCategoryId === "products" ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </CardTitle>
          </CardHeader>

          {openCategoryId === "products" && (
            <CardContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/products/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block p-3 rounded-lg transition-colors hover:bg-indigo-800/50"
                    style={{ color: colors.text.secondary }}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 p-2 rounded-full" style={{ backgroundColor: colors.primary.dark }}>
                        <Warehouse className="h-4 w-4" />
                      </div>
                      <span>{category.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Video Library Card */}
      <motion.div whileHover={{ y: -5 }}>
        <Card
          className="border rounded-xl overflow-hidden"
          style={{
            backgroundColor: colors.background.light,
            borderColor: colors.primary.dark,
          }}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span style={{ color: colors.text.primary }}>
                Video Library
              </span>
              <button
                onClick={() => toggleCategory("videos")}
                className="p-2 rounded-full"
                style={{ backgroundColor: colors.primary.dark }}
              >
                {openCategoryId === "videos" ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </CardTitle>
          </CardHeader>

          {openCategoryId === "videos" && (
            <CardContent>
              <div className="space-y-3">
                {videos.map((video) => (
                  <Link
                    key={video.id}
                    href="/videos"
                    className="block"
                  >
                    <div className="p-3 rounded-lg flex items-center transition-colors hover:bg-indigo-800/50">
                      <div className="mr-3 p-2 rounded-full" style={{ backgroundColor: colors.primary.dark }}>
                        <Play className="h-4 w-4" />
                      </div>
                      <span>{video.title}</span>
                    </div>
                  </Link>
                ))}
                <Link href="/videos">
                  <div className="p-3 rounded-lg text-center font-medium text-indigo-300 hover:text-indigo-100 transition-colors">
                    View All Videos →
                  </div>
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
}