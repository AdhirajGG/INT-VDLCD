// // app/(dashboard)/(routes)/(public)/blog/[slug]/page.tsx

// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { colors } from "@/lib/colors";
// import { useUser } from "@clerk/nextjs";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// interface BlogPost {
//   id: number;
//   title: string;
//   slug: string;
//   image: string | null;
//   content: string;
//   createdAt: string;
// }

// export default function BlogPostPage() {
//   const { slug } = useParams<{ slug: string }>();
//   const [post, setPost] = useState<BlogPost | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { isSignedIn } = useUser();

//   useEffect(() => {
//     axios.get(`/api/blog/${slug}`)
//       .then(res => {
//         setPost(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, [slug]);

//   if (!isSignedIn) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
//         <div className="text-center p-8 rounded-xl" style={{ background: colors.background.main }}>
//           <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
//             Sign in required
//           </h2>
//           <p className="mb-6" style={{ color: colors.text.secondary }}>
//             Please sign in to view this post
//           </p>
//           <Link href="/sign-in">
//             <Button className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700">
//               Sign In
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen" style={{ background: colors.background.dark }}>
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div className="min-h-screen flex justify-center items-center" style={{ background: colors.background.dark }}>
//         <h1 className="text-2xl" style={{ color: colors.text.primary }}>Post not found</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen" style={{ background: colors.background.dark }}>
//       <div className="container mx-auto px-4 py-12 max-w-4xl"
      
//       >
//         <motion.h1 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-4xl font-bold mb-4"
//           style={{ color: colors.secondary.light }}
//         >
//           {post.title}
//         </motion.h1>
//         <p className="text-sm mb-8" style={{ color: colors.text.primary }}>
//           {new Date(post.createdAt).toLocaleDateString()}
//         </p>
//         {post.image && (
//           <div className="relative h-full w-full mb-8 rounded-xl overflow-hidden"
          
//           >
//             <Image
//               src={post.image} 
//               alt={post.title} 
//               className="object-cover w-full h-full"
              
//               width={800}
//               height={800}
//             />
//           </div>
//         )}
//         <div 
//           className="prose prose-invert max-w-none"
//           style={{ color: colors.primary.main }}
//           dangerouslySetInnerHTML={{ __html: post.content }} 
//         />
//       </div>
//     </div>
//   );
// }

// app/(dashboard)/(routes)/(public)/blog/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { colors } from "@/lib/colors";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import CommentSection from "@/components/CommentSection";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  content: string;
  createdAt: string;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    axios.get(`/api/blog/${slug}`)
      .then(res => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
        <div className="text-center p-8 rounded-xl" style={{ background: colors.background.main }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Sign in required
          </h2>
          <p className="mb-6" style={{ color: colors.text.secondary }}>
            Please sign in to view this post
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

  if (!post) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ background: colors.background.dark }}>
        <h1 className="text-2xl" style={{ color: colors.text.primary }}>Post not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: colors.background.dark }}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-4"
          style={{ color: colors.secondary.light }}
        >
          {post.title}
        </motion.h1>
        <p className="text-sm mb-8" style={{ color: colors.text.primary }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
        {post.image && (
          <div className="relative h-full w-full mb-8 rounded-xl overflow-hidden">
            <Image
              src={post.image} 
              alt={post.title} 
              className="object-cover w-full h-full"
              width={800}
              height={800}
            />
          </div>
        )}
        <div 
          className="prose prose-invert max-w-none mb-8"
          style={{ color: colors.primary.main }}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* Add Comment Section */}
        <CommentSection postSlug={post.slug} />
      </div>
    </div>
  );
}