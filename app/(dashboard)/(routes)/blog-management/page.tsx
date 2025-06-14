// // app/(dashboard)/(routes)/blog-management/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Plus, Trash2, Edit } from "lucide-react";
// import axios from "axios";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { colors } from "@/lib/colors";
// import RichTextEditor from "@/components/RichTextEditor";
// import { useUser } from "@clerk/nextjs"; // Add this

// type BlogPost = {
//   id: number;
//   title: string;
//   slug: string;
//   image: string;
//   content: string;
//   excerpt: string;
// };

// export default function BlogDashboardPage() {
//   const router = useRouter();
//   const [posts, setPosts] = useState<BlogPost[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editPost, setEditPost] = useState<BlogPost | null>(null);
//   const [newPost, setNewPost] = useState({
//     title: "",
//     slug: "",
//     image: "",
//     content: "",
//     excerpt: ""
//   });
//  const { user } = useUser(); // Get user
//     // Check if user is admin
//   const isAdmin = user?.publicMetadata?.role === "admin";

//   useEffect(() => {
//     // Redirect if not admin
//     if (!isAdmin) {
//       router.push("/dashboard");
//       return;
//     }
    
//     fetchPosts();
//   }, [isAdmin, router]);

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     try {
//       const { data } = await axios.get("/api/blog");
//       setPosts(data);
//       setLoading(false);
//     } catch (error) {
//       toast.error("Failed to load posts");
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       if (editPost) {
//         await axios.put(`/api/blog/${editPost.slug}`, newPost);
//         toast.success("Post updated");
//       } else {
//         await axios.post("/api/blog", newPost);
//         toast.success("Post created");
//       }
//       setDialogOpen(false);
//       setEditPost(null);
//       setNewPost({ title: "", slug: "", image: "", content: "", excerpt: "" });
//       await fetchPosts();
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || err.message);
//     }
//   };

//   const handleDelete = async (slug: string) => {
//     try {
//       await axios.delete(`/api/blog/${slug}`);
//       toast.success("Post deleted");
//       await fetchPosts();
//     } catch {
//       toast.error("Failed to delete");
//     }
//   };

//    // If not admin, show access denied
//   if (!isAdmin) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
//         <div className="text-center p-8 rounded-xl" style={{ background: colors.background.main }}>
//           <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
//             Access Denied
//           </h2>
//           <p className="mb-6" style={{ color: colors.text.secondary }}>
//             You don't have permission to access this page
//           </p>
//           <Button onClick={() => router.push("/dashboard")} style={{ background: colors.primary.main }}>
//             Return to Dashboard
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6 min-h-screen" style={{ background: colors.background.dark }}>
//       <div className="mb-6">
//         <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text.primary }}>
//           Blog Management
//         </h1>
//         <Button 
//           onClick={() => {
//             setEditPost(null);
//             setNewPost({ title: "", slug: "", image: "", content: "", excerpt: "" });
//             setDialogOpen(true);
//           }}
//           className="mt-4"
//           style={{ background: colors.primary.main }}
//         >
//           <Plus className="mr-2" /> New Post
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {posts.map(post => (
//           <motion.div
//             key={post.id}
//             whileHover={{ scale: 1.02 }}
//             className="p-4 rounded-lg border"
//             style={{ background: colors.background.light, borderColor: colors.primary.dark }}
//           >
//             <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
//               {post.image ? (
//                 <img src={post.image} alt={post.title} className="object-cover w-full h-full" />
//               ) : (
//                 <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
//                   <span className="text-gray-500">No Image</span>
//                 </div>
//               )}
//             </div>
//             <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
//               {post.title}
//             </h3>
//             <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>
//               {post.excerpt || "No excerpt available"}
//             </p>
//             <div className="flex justify-between">
//               <Button
//                 onClick={() => {
//                   setEditPost(post);
//                   setNewPost({
//                     title: post.title,
//                     slug: post.slug,
//                     image: post.image,
//                     content: post.content,
//                     excerpt: post.excerpt || ""
//                   });
//                   setDialogOpen(true);
//                 }}
//                 variant="outline"
//                 style={{ borderColor: colors.primary.dark, color: colors.primary.main }}
//               >
//                 <Edit size={16} className="mr-1" /> Edit
//               </Button>
//               <Button
//                 onClick={() => handleDelete(post.slug)}
//                 variant="outline"
//                 style={{ borderColor: colors.state.error, color: colors.state.error }}
//               >
//                 <Trash2 size={16} className="mr-1" /> Delete
//               </Button>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" 
//           style={{ backgroundColor: colors.background.main }}>
//           <DialogHeader>
//             <DialogTitle style={{ color: colors.text.primary }}>
//               {editPost ? "Edit Post" : "Create New Post"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label style={{ color: colors.text.secondary }}>Title</Label>
//               <Input
//                 value={newPost.title}
//                 onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
//                 style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
//               />
//             </div>
//             <div>
//               <Label style={{ color: colors.text.secondary }}>Slug</Label>
//               <Input
//                 value={newPost.slug}
//                 onChange={e => setNewPost(p => ({ ...p, slug: e.target.value }))}
//                 style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
//               />
//             </div>
//             <div>
//               <Label style={{ color: colors.text.secondary }}>Image URL</Label>
//               <Input
//                 value={newPost.image}
//                 onChange={e => setNewPost(p => ({ ...p, image: e.target.value }))}
//                 style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
//               />
//             </div>
//             <div>
//               <Label style={{ color: colors.text.secondary }}>Excerpt (Summary)</Label>
//               <Input
//                 value={newPost.excerpt}
//                 onChange={e => setNewPost(p => ({ ...p, excerpt: e.target.value }))}
//                 style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
//               />
//             </div>
//             <div>
//               <Label style={{ color: colors.text.secondary }}>Content</Label>
//               <RichTextEditor
//                 value={newPost.content}
//                 onChange={value => setNewPost(p => ({ ...p, content: value }))}
//               />
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setDialogOpen(false)}
//                 style={{ background: colors.state.error, color: colors.text.primary }}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleSubmit}
//                 style={{ background: colors.primary.main }}
//               >
//                 {editPost ? "Update" : "Create"}
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// app/(dashboard)/(routes)/blog-management/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colors } from "@/lib/colors";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import { useUser } from "@clerk/nextjs";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  image: string;
  imagePublicId?: string;
  content: string;
  excerpt: string;
};

type NewPostData = {
  title: string;
  slug: string;
  image: string;
  imagePublicId?: string;
  content: string;
  excerpt: string;
};

export default function BlogDashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<NewPostData>({
    title: "",
    slug: "",
    image: "",
    imagePublicId: "",
    content: "",
    excerpt: ""
  });

  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    // Redirect if not admin
    if (user && !isAdmin) {
      router.push("/dashboard");
      return;
    }
    
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin, router, user]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("/api/blog");
      setPosts(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load posts");
      setLoading(false);
    }
  };

  const handleImageChange = (url: string, publicId?: string) => {
    setNewPost(prev => ({
      ...prev,
      image: url,
      imagePublicId: publicId || ""
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setNewPost(prev => ({
      ...prev,
      title,
      slug: editPost ? prev.slug : generateSlug(title) // Only auto-generate slug for new posts
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!newPost.title.trim()) {
        toast.error("Title is required");
        return;
      }
      if (!newPost.slug.trim()) {
        toast.error("Slug is required");
        return;
      }
      if (!newPost.content.trim()) {
        toast.error("Content is required");
        return;
      }

      if (editPost) {
        // If image was changed and there's an old image, delete it from Cloudinary
        if (editPost.imagePublicId && 
            newPost.imagePublicId !== editPost.imagePublicId && 
            editPost.imagePublicId) {
          try {
            await axios.delete('/api/upload', {
              data: { publicId: editPost.imagePublicId }
            });
          } catch (error) {
            console.warn('Failed to delete old image:', error);
          }
        }

        await axios.put(`/api/blog/${editPost.slug}`, newPost);
        toast.success("Post updated successfully");
      } else {
        await axios.post("/api/blog", newPost);
        toast.success("Post created successfully");
      }
      
      setDialogOpen(false);
      setEditPost(null);
      setNewPost({ 
        title: "", 
        slug: "", 
        image: "", 
        imagePublicId: "",
        content: "", 
        excerpt: "" 
      });
      await fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to save post");
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      // Find the post to get its imagePublicId
      const postToDelete = posts.find(p => p.slug === slug);
      
      // Show confirmation toast
      toast.custom((t) => (
        <div className="bg-background-main p-4 rounded-lg shadow-xl border border-red-500/30"
          style={{ background: colors.background.main }}
        >
          <h3 className="font-semibold mb-4" style={{ color: colors.text.primary }}>
            Confirm Deletion
          </h3>
          <p className="mb-4" style={{ color: colors.text.secondary }}>
            Are you sure you want to delete this blog post permanently?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => toast.dismiss(t)}
              style={{ color: colors.text.secondary }}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: colors.state.error }}
              onClick={async () => {
                // Delete image from Cloudinary if it exists
                if (postToDelete?.imagePublicId) {
                  try {
                    await axios.delete('/api/upload', {
                      data: { publicId: postToDelete.imagePublicId }
                    });
                  } catch (error) {
                    console.warn('Failed to delete image from Cloudinary:', error);
                  }
                }
                
                await axios.delete(`/api/blog/${slug}`);
                toast.dismiss(t);
                toast.success("Post deleted successfully");
                await fetchPosts();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ));
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditPost(post);
    setNewPost({
      title: post.title,
      slug: post.slug,
      image: post.image || "",
      imagePublicId: post.imagePublicId || "",
      content: post.content,
      excerpt: post.excerpt || ""
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditPost(null);
    setNewPost({ 
      title: "", 
      slug: "", 
      image: "", 
      imagePublicId: "",
      content: "", 
      excerpt: "" 
    });
    setDialogOpen(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
            style={{ borderColor: colors.primary.main }}
          />
          <p style={{ color: colors.text.secondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If not admin, show access denied
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
        <div className="text-center p-8 rounded-xl" style={{ background: colors.background.main }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Access Denied
          </h2>
          <p className="mb-6" style={{ color: colors.text.secondary }}>
            You don't have permission to access this page
          </p>
          <Button onClick={() => router.push("/dashboard")} style={{ background: colors.primary.main }}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen" style={{ background: colors.background.dark }}>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text.primary }}>
          Blog Management
        </h1>
        <Button 
          onClick={openCreateDialog}
          className="mt-4"
          style={{ background: colors.primary.main }}
        >
          <Plus className="mr-2" /> New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4" style={{ color: colors.text.secondary }}>
            No blog posts yet
          </p>
          <Button onClick={openCreateDialog} style={{ background: colors.primary.main }}>
            Create Your First Post
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg border"
              style={{ background: colors.background.light, borderColor: colors.primary.dark }}
            >
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center"
                    style={{ borderColor: colors.primary.dark, backgroundColor: colors.background.dark }}
                  >
                    <span style={{ color: colors.text.secondary }}>No Image</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: colors.text.primary }}>
                {post.title}
              </h3>
              <p className="text-sm mb-4 line-clamp-3" style={{ color: colors.text.secondary }}>
                {post.excerpt || "No excerpt available"}
              </p>
              <div className="flex justify-between gap-2">
                <Button
                  onClick={() => openEditDialog(post)}
                  variant="outline"
                  className="flex-1"
                  style={{ borderColor: colors.primary.dark, color: colors.primary.main }}
                >
                  <Edit size={16} className="mr-1" /> Edit
                </Button>
                <Button
                  onClick={() => handleDelete(post.slug)}
                  variant="outline"
                  className="flex-1"
                  style={{ borderColor: colors.state.error, color: colors.state.error }}
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" 
          style={{ backgroundColor: colors.background.main }}>
          <DialogHeader>
            <DialogTitle style={{ color: colors.text.primary }}>
              {editPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label style={{ color: colors.text.secondary }}>Title *</Label>
                <Input
                  value={newPost.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                  style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
                />
              </div>
              <div>
                <Label style={{ color: colors.text.secondary }}>Slug *</Label>
                <Input
                  value={newPost.slug}
                  onChange={e => setNewPost(p => ({ ...p, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                  style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
                />
              </div>
            </div>

            <div>
              <Label style={{ color: colors.text.secondary }}>Featured Image</Label>
              <ImageUpload
                value={newPost.image}
                onChange={handleImageChange}
              />
            </div>

            <div>
              <Label style={{ color: colors.text.secondary }}>Excerpt (Summary)</Label>
              <Input
                value={newPost.excerpt}
                onChange={e => setNewPost(p => ({ ...p, excerpt: e.target.value }))}
                placeholder="Brief description of the post"
                style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
              />
            </div>

            <div>
              <Label style={{ color: colors.text.secondary }}>Content *</Label>
              <div className="mt-2">
                <RichTextEditor
                  value={newPost.content}
                  onChange={value => setNewPost(p => ({ ...p, content: value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                style={{ borderColor: colors.text.secondary, color: colors.text.secondary }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                style={{ background: colors.primary.main }}
                disabled={!newPost.title.trim() || !newPost.slug.trim() || !newPost.content.trim()}
              >
                {editPost ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}