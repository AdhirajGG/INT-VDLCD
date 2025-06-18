// // components/SlideshowDialog.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// // import { useToast } from "@/components/ui/use-toast";
// import { toast, Toaster } from "sonner";

// export function SlideshowDialog() {
//   const [open, setOpen] = useState(false);
//   const [imageUrl, setImageUrl] = useState("");
//   const [topText, setTopText] = useState("");
//   const [bottomText, setBottomText] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const { toast } = useToast();

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const response = await fetch("/api/slides", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ imageUrl, topText, bottomText }),
//       });

//       if (response.ok) {
//          toast.success("Slide Added");
//         // toast({
//         //   title: "Slide Added",
//         //   description: "The slide has been successfully added to the slideshow.",
//         // });
//         setOpen(false);
//         // Reset form
//         setImageUrl("");
//         setTopText("");
//         setBottomText("");
//       } else {
//         throw new Error("Failed to add slide");
//       }
//     } catch (error) {
//         toast.error("There was an error adding the slide.");
//     //   toast({
//     //     title: "Error",
//     //     description: "There was an error adding the slide.",
//     //     variant: "destructive",
//     //   });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">Add Slide</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Add New Slideshow Item</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="imageUrl" className="text-right">
//               Image URL
//             </Label>
//             <Input
//               id="imageUrl"
//               value={imageUrl}
//               onChange={(e) => setImageUrl(e.target.value)}
//               className="col-span-3"
//               required
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="topText" className="text-right">
//               Top Text
//             </Label>
//             <Input
//               id="topText"
//               value={topText}
//               onChange={(e) => setTopText(e.target.value)}
//               className="col-span-3"
//               placeholder="Optional"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="bottomText" className="text-right">
//               Bottom Text
//             </Label>
//             <Input
//               id="bottomText"
//               value={bottomText}
//               onChange={(e) => setBottomText(e.target.value)}
//               className="col-span-3"
//               placeholder="Optional"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end">
//           <Button onClick={handleSubmit} disabled={isSubmitting}>
//             {isSubmitting ? "Adding..." : "Add Slide"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// components/SlideshowDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { colors } from "@/lib/colors";

export function SlideshowDialog() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl, topText, bottomText }),
      });

      if (response.ok) {
        toast.success("Slide Added")
        // toast({
        //   title: "Slide Added",
        //   description: "The slide has been successfully added to the slideshow.",
        // });
        setOpen(false);
        setImageUrl("");
        setTopText("");
        setBottomText("");
      } else {
        throw new Error("Failed to add slide");
      }
    } catch (error) {
        toast.error("There was an error adding the slide.")
    //   toast({
    //     title: "Error",
    //     description: "There was an error adding the slide.",
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
          Add Slide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" style={{ backgroundColor: colors.background.main }}>
        <DialogHeader>
          <DialogTitle style={{ color: colors.text.secondary }}>Add New Slideshow Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl" style={{ color: colors.text.secondary }}>Image *</Label>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topText" style={{ color: colors.text.secondary }}>Top Text</Label>
            <Input
              id="topText"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="Optional text to display at top"
              className="w-full"
              style={{ color: colors.text.primary }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bottomText" style={{ color: colors.text.secondary }}>Bottom Text</Label>
            <Input
              id="bottomText"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="Optional text to display at bottom"
              className="w-full "
              style={{ color: colors.text.primary }}
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
            {isSubmitting ? "Adding..." : "Add Slide"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}