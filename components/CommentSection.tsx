// components/CommentSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { colors } from "@/lib/colors";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send } from "lucide-react";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
  };
}

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/blog/${postSlug}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`/api/blog/${postSlug}/comments`, {
        content: newComment
      });
      
      setNewComment("");
      toast.success("Comment submitted! It will appear after admin approval.");
      // Don't refetch comments since new comment won't be approved yet
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  if (!isSignedIn) {
    return null; // Don't show comment section if user is not signed in
  }

  return (
    <div className="mt-12 border-t pt-8" style={{ borderColor: colors.primary.dark }}>
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={24} style={{ color: colors.primary.main }} />
        <h3 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <Card className="mb-8" style={{ backgroundColor: colors.background.light, borderColor: colors.primary.dark }}>
        <CardHeader>
          <h4 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
            Leave a Comment
          </h4>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              style={{ 
                backgroundColor: colors.background.main, 
                color: colors.text.primary,
                borderColor: colors.primary.dark
              }}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                Your comment will be reviewed before being published.
              </p>
              <Button
                type="submit"
                disabled={submitting || !newComment.trim()}
                style={{ backgroundColor: colors.primary.main }}
                className="flex items-center gap-2"
              >
                <Send size={16} />
                {submitting ? "Submitting..." : "Submit Comment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" 
               style={{ borderColor: colors.primary.main }}></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p style={{ color: colors.text.secondary }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card 
              key={comment.id} 
              style={{ backgroundColor: colors.background.light, borderColor: colors.primary.dark }}
            >
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback style={{ backgroundColor: colors.primary.main }}>
                      {getInitials(comment.author.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium" style={{ color: colors.text.primary }}>
                        {comment.author.email.split('@')[0]}
                      </span>
                      <span className="text-sm" style={{ color: colors.text.secondary }}>
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p style={{ color: colors.text.primary }}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}