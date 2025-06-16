// // components/TestimonialDialog.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// // import { useToast } from "sonner";
// import { toast, Toaster } from "sonner";
// export function TestimonialDialog() {
//   const [open, setOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [position, setPosition] = useState("");
//   const [company, setCompany] = useState("");
//   const [content, setContent] = useState("");
//   const [avatarUrl, setAvatarUrl] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

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
//         toast.success("Testimonial Added");
//         // toast({
//         //   title: "Testimonial Added",
//         //   description: "The testimonial has been successfully added.",
//         // });
//         setOpen(false);
//         // Reset form
//         setName("");
//         setPosition("");
//         setCompany("");
//         setContent("");
//         setAvatarUrl("");
//       } else {
//         throw new Error("Failed to add testimonial");
//       }
//     } catch (error) {
//          toast.error("There was an error adding the testimonial.");
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
//         <Button variant="outline">Add Testimonial</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Add New Testimonial</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="name" className="text-right">
//               Name
//             </Label>
//             <Input
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="col-span-3"
//               required
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="position" className="text-right">
//               Position
//             </Label>
//             <Input
//               id="position"
//               value={position}
//               onChange={(e) => setPosition(e.target.value)}
//               className="col-span-3"
//               required
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="company" className="text-right">
//               Company
//             </Label>
//             <Input
//               id="company"
//               value={company}
//               onChange={(e) => setCompany(e.target.value)}
//               className="col-span-3"
//               required
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="content" className="text-right">
//               Testimonial
//             </Label>
//             <Textarea
//               id="content"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               className="col-span-3"
//               rows={4}
//               required
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="avatar" className="text-right">
//               Avatar URL
//             </Label>
//             <Input
//               id="avatar"
//               value={avatarUrl}
//               onChange={(e) => setAvatarUrl(e.target.value)}
//               className="col-span-3"
//               placeholder="Optional"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end">
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
// import { useToast } from "@/components/ui/use-toast";
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
//   const { toast } = useToast();

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
        // toast({
        //   title: "Testimonial Added",
        //   description: "The testimonial has been successfully added.",
        // });
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
    //   toast({
    //     title: "Error",
    //     description: "There was an error adding the testimonial.",
    //     variant: "destructive",
    //   });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 text-white" style={{ background: colors.gradients.secondary}}>
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]"
      style={{ backgroundColor: colors.background.main }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: colors.text.primary }}>Add New Testimonial</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" style={{ color: colors.text.secondary }}>Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
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
      </DialogContent>
    </Dialog>
  );
}