// // components/SlideshowDialog.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// // import { useToast } from "@/components/ui/use-toast";
// import ImageUpload from "@/components/ImageUpload";
// import { Plus } from "lucide-react";
// import { toast } from "sonner";
// import { colors } from "@/lib/colors";

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
//         toast.success("Slide Added")
//         // toast({
//         //   title: "Slide Added",
//         //   description: "The slide has been successfully added to the slideshow.",
//         // });
//         setOpen(false);
//         setImageUrl("");
//         setTopText("");
//         setBottomText("");
//       } else {
//         throw new Error("Failed to add slide");
//       }
//     } catch (error) {
//         toast.error("There was an error adding the slide.")
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
//         <Button variant="outline" className="flex items-center gap-1 text-white" style={{ background: colors.gradients.secondary}}>
//           <Plus className="h-4 w-4" />
//           Add Slide
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px]" style={{ backgroundColor: colors.background.main }}>
//         <DialogHeader>
//           <DialogTitle style={{ color: colors.text.secondary }}>Add New Slideshow Item</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="imageUrl" style={{ color: colors.text.secondary }}>Image *</Label>
//             <ImageUpload
//               value={imageUrl}
//               onChange={(url) => setImageUrl(url)}
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="topText" style={{ color: colors.text.secondary }}>Top Text</Label>
//             <Input
//               id="topText"
//               value={topText}
//               onChange={(e) => setTopText(e.target.value)}
//               placeholder="Optional text to display at top"
//               className="w-full"
//               style={{ color: colors.text.primary }}
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="bottomText" style={{ color: colors.text.secondary }}>Bottom Text</Label>
//             <Input
//               id="bottomText"
//               value={bottomText}
//               onChange={(e) => setBottomText(e.target.value)}
//               placeholder="Optional text to display at bottom"
//               className="w-full "
//               style={{ color: colors.text.primary }}
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
        setOpen(false);
        setImageUrl("");
        setTopText("");
        setBottomText("");
      } else {
        throw new Error("Failed to add slide");
      }
    } catch (error) {
        toast.error("There was an error adding the slide.")
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
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0"
        style={{ backgroundColor: colors.background.main }}
      >
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle style={{ color: colors.text.secondary }}>Add New Slideshow Item</DialogTitle>
        </DialogHeader>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-4">
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
                className="w-full"
                style={{ color: colors.text.primary }}
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
              {isSubmitting ? "Adding..." : "Add Slide"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}