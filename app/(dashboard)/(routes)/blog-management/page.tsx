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
import { useUser } from "@clerk/nextjs"; // Add this

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  image: string;
  content: string;
  excerpt: string;
};

export default function BlogDashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: "",
    slug: "",
    image: "",
    content: "",
    excerpt: ""
  });
 const { user } = useUser(); // Get user
    // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }
    
    fetchPosts();
  }, [isAdmin, router]);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleSubmit = async () => {
    try {
      if (editPost) {
        await axios.put(`/api/blog/${editPost.slug}`, newPost);
        toast.success("Post updated");
      } else {
        await axios.post("/api/blog", newPost);
        toast.success("Post created");
      }
      setDialogOpen(false);
      setEditPost(null);
      setNewPost({ title: "", slug: "", image: "", content: "", excerpt: "" });
      await fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await axios.delete(`/api/blog/${slug}`);
      toast.success("Post deleted");
      await fetchPosts();
    } catch {
      toast.error("Failed to delete");
    }
  };

   // If not admin, show access denied
  if (!isAdmin) {
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
          onClick={() => {
            setEditPost(null);
            setNewPost({ title: "", slug: "", image: "", content: "", excerpt: "" });
            setDialogOpen(true);
          }}
          className="mt-4"
          style={{ background: colors.primary.main }}
        >
          <Plus className="mr-2" /> New Post
        </Button>
      </div>

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
                <img src={post.image} alt={post.title} className="object-cover w-full h-full" />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
              {post.title}
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.text.secondary }}>
              {post.excerpt || "No excerpt available"}
            </p>
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  setEditPost(post);
                  setNewPost({
                    title: post.title,
                    slug: post.slug,
                    image: post.image,
                    content: post.content,
                    excerpt: post.excerpt || ""
                  });
                  setDialogOpen(true);
                }}
                variant="outline"
                style={{ borderColor: colors.primary.dark, color: colors.primary.main }}
              >
                <Edit size={16} className="mr-1" /> Edit
              </Button>
              <Button
                onClick={() => handleDelete(post.slug)}
                variant="outline"
                style={{ borderColor: colors.state.error, color: colors.state.error }}
              >
                <Trash2 size={16} className="mr-1" /> Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" 
          style={{ backgroundColor: colors.background.main }}>
          <DialogHeader>
            <DialogTitle style={{ color: colors.text.primary }}>
              {editPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label style={{ color: colors.text.secondary }}>Title</Label>
              <Input
                value={newPost.title}
                onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
              />
            </div>
            <div>
              <Label style={{ color: colors.text.secondary }}>Slug</Label>
              <Input
                value={newPost.slug}
                onChange={e => setNewPost(p => ({ ...p, slug: e.target.value }))}
                style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
              />
            </div>
            <div>
              <Label style={{ color: colors.text.secondary }}>Image URL</Label>
              <Input
                value={newPost.image}
                onChange={e => setNewPost(p => ({ ...p, image: e.target.value }))}
                style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
              />
            </div>
            <div>
              <Label style={{ color: colors.text.secondary }}>Excerpt (Summary)</Label>
              <Input
                value={newPost.excerpt}
                onChange={e => setNewPost(p => ({ ...p, excerpt: e.target.value }))}
                style={{ backgroundColor: colors.background.light, color: colors.text.primary }}
              />
            </div>
            <div>
              <Label style={{ color: colors.text.secondary }}>Content</Label>
              <RichTextEditor
                value={newPost.content}
                onChange={value => setNewPost(p => ({ ...p, content: value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                style={{ background: colors.state.error, color: colors.text.primary }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                style={{ background: colors.primary.main }}
              >
                {editPost ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}