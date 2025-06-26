// // components/TestimonialDialog.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// // import { useToast } from "@/components/ui/use-toast";
// import ImageUpload from "@/components/ImageUpload";
// import { Plus } from "lucide-react";
// import { toast } from "sonner";
// import { colors } from "@/lib/colors";

// export function TestimonialDialog() {
//   const [open, setOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [position, setPosition] = useState("");
//   const [company, setCompany] = useState("");
//   const [content, setContent] = useState("");
//   const [avatarUrl, setAvatarUrl] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const { toast } = useToast();

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const response = await fetch("/api/testimonials", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, position, company, content, avatarUrl }),
//       });

//       if (response.ok) {
//         toast.success('Testimonial Added')
//         // toast({
//         //   title: "Testimonial Added",
//         //   description: "The testimonial has been successfully added.",
//         // });
//         setOpen(false);
//         setName("");
//         setPosition("");
//         setCompany("");
//         setContent("");
//         setAvatarUrl("");
//       } else {
//         throw new Error("Failed to add testimonial");
//       }
//     } catch (error) {
//         toast.error('There was an error adding the testimonial.')
//     //   toast({
//     //     title: "Error",
//     //     description: "There was an error adding the testimonial.",
//     //     variant: "destructive",
//     //   });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="flex items-center gap-1 text-white" style={{ background: colors.gradients.secondary}}>
//           <Plus className="h-4 w-4" />
//           Add Testimonial
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px]"
//       style={{ backgroundColor: colors.background.main }}
//       >
//         <DialogHeader>
//           <DialogTitle style={{ color: colors.text.primary }}>Add New Testimonial</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="name" style={{ color: colors.text.secondary }}>Name *</Label>
//             <Input
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full"
//               style={{ color: colors.text.primary }}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="position" style={{ color: colors.text.secondary }}>Position *</Label>
//             <Input
//               id="position"
//               value={position}
//               onChange={(e) => setPosition(e.target.value)}
//               required
//               className="w-full"
//               style={{ color: colors.text.primary }}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="company" style={{ color: colors.text.secondary }}>Company *</Label>
//             <Input
//               id="company"
//               value={company}
//               onChange={(e) => setCompany(e.target.value)}
//               required
//               className="w-full"
//               style={{ color: colors.text.primary }}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="content" style={{ color: colors.text.secondary }}>Testimonial *</Label>
//             <Textarea
//               id="content"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               required
//               rows={4}
//               className="w-full"
//               style={{ color: colors.text.primary }}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="avatar" style={{ color: colors.text.secondary }}>Avatar</Label>
//             <ImageUpload
//               value={avatarUrl}
//               onChange={(url) => setAvatarUrl(url)}
//             />
//           </div>
//         </div>
//         <div className="flex justify-end gap-2">
//           <Button 
//             variant="outline" 
//             onClick={() => setOpen(false)}
//           >
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={isSubmitting}>
//             {isSubmitting ? "Adding..." : "Add Testimonial"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
// components/TestimonialDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUpload from "@/components/ImageUpload";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { colors } from "@/lib/colors";

export function TestimonialDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, position, company, content, avatarUrl }),
      });

      if (response.ok) {
        toast.success('Testimonial Added')
        setOpen(false);
        setName("");
        setPosition("");
        setCompany("");
        setContent("");
        setAvatarUrl("");
      } else {
        throw new Error("Failed to add testimonial");
      }
    } catch (error) {
      toast.error('There was an error adding the testimonial.')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 text-white" style={{ background: colors.gradients.secondary }}>
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0"
        style={{ backgroundColor: colors.background.main }}
      >
        {/* <DialogContent 
  className="sm:max-w-[600px] max-w-[95vw] max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0"
  style={{ backgroundColor: colors.background.main }}
> */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle style={{ color: colors.text.primary }}>Add New Testimonial</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: colors.text.secondary }}>Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
                style={{ color: colors.text.primary }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" style={{ color: colors.text.secondary }}>Position *</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="w-full"
                style={{ color: colors.text.primary }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" style={{ color: colors.text.secondary }}>Company *</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full"
                style={{ color: colors.text.primary }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" style={{ color: colors.text.secondary }}>Testimonial *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="w-full"
                style={{ color: colors.text.primary }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar" style={{ color: colors.text.secondary }}>Avatar</Label>
              <ImageUpload
                value={avatarUrl}
                onChange={(url) => setAvatarUrl(url)}
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        style={{ backgroundColor: colors.background.main }}
        >
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Testimonial"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}