// // app/(dashboard)/(routes)/products/item/[slug]/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useUser } from "@clerk/nextjs";
// import axios from "axios";
// import { toast } from "sonner";
// import Loading from "./loading";
// import { colors } from "@/lib/colors";
// import RichTextEditor from "@/components/RichTextEditor"; // Add this

// type Machine = {
//   slug: string;
//   model: string;
//   image: string;
//   description: string;
//   category: string;
//   specs: Record<string, string>;
//   videoUrl?: string; // Add videoUrl
// };
// type Category = {
//   name: string;
// };
// type EditFormData = {
//   model: string;
//   image: string;
//   description: string;
//   category: string;
//   specs: [string, string][];
//   videoUrl?: string; // Add videoUrl
// };

// export default function ProductDetailPage() {
//   const { slug } = useParams<{ slug: string }>();
//   const router = useRouter();
//   const [machine, setMachine] = useState<Machine | null>(null);
//   const [loading, setLoading] = useState(true);

//   const { user } = useUser();
//   const isAdmin = user?.publicMetadata?.role === "admin";
//  const [categories, setCategories] = useState<{ name: string }[]>([]);
//   const [editOpen, setEditOpen] = useState(false);
//   const [editData, setEditData] = useState<EditFormData>({
//     model: "",
//     image: "",
//     description: "",
//     category: "",
//     specs: [],
//     videoUrl: "", // Add videoUrl
//   });

//   useEffect(() => {
//     if (!slug) return;
//     (async () => {
//       try {
//         const { data } = await axios.get<Machine>(`/api/machines/${slug}`);
//         setMachine(data);
//         setEditData({
//           model: data.model,
//           image: data.image,
//           description: data.description,
//           category: data.category,
//           specs: Object.entries(data.specs),
//           videoUrl: data.videoUrl || "", // Add videoUrl
//         });
//       } catch {
//         toast.error("Product not found");
//         router.replace("/products");
//       } finally {
//         setLoading(false);
//       }
//     })();
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get('/api/categories');
//         setCategories(data);
//       } catch (error) {
//         toast.error("Failed to load categories");
//       }
//     };
//     fetchCategories();
//   }, [slug, router]);

//   const handleEditSpecChange = (index: number, field: number, value: string) => {
//     const updatedSpecs = [...editData.specs];
//     updatedSpecs[index][field] = value;
//     setEditData(d => ({ ...d, specs: updatedSpecs }));
//   };

//   const handleAddSpec = () => setEditData(d => ({ ...d, specs: [...d.specs, ["", ""]] }));
//   const handleDeleteSpec = (index: number) => setEditData(d => ({ ...d, specs: d.specs.filter((_, i) => i !== index) }));

//   const handleUpdateProduct = async () => {
//     try {
//       const specsObj = Object.fromEntries(editData.specs.filter(([k, v]) => k && v));
//       await axios.put(`/api/machines/${slug}`, { ...editData, specs: specsObj });
//       toast.success("Product updated!");

//       const { data } = await axios.get<Machine>(`/api/machines/${slug}`);
//       setMachine(data);
//       setEditData({
//         model: data.model,
//         image: data.image,
//         description: data.description,
//         category: data.category,
//         specs: Object.entries(data.specs),
//         videoUrl: data.videoUrl || "", // Add videoUrl
//       });
//       setEditOpen(false);
//       router.refresh();
//     } catch {
//       toast.error("Failed to update product");
//     }
//   };

//   const handleDeleteProduct = async () => {
//     try {
//       toast.custom((t) => (
//         <div className="bg-background-main p-4 rounded-lg shadow-xl border border-red-500/30"
//           style={{ background: colors.background.main }}
//         >
//           <h3 className="font-semibold mb-4" style={{ color: colors.text.primary }}>
//             Confirm Deletion
//           </h3>
//           <p className="mb-4" style={{ color: colors.text.secondary }}>
//             Are you sure you want to delete this product permanently?
//           </p>
//           <div className="flex justify-end gap-2">
//             <Button
//               variant="outline"
//               onClick={() => toast.dismiss(t)}
//               style={{ color: colors.text.secondary }}
//             >
//               Cancel
//             </Button>
//             <Button
//               style={{ backgroundColor: colors.state.error }}
//               onClick={async () => {
//                 await axios.delete(`/api/machines/${slug}`);
//                 toast.dismiss(t);
//                 toast.success("Product deleted successfully");
//                 router.push("/dashboard");
//               }}
//             >
//               Delete
//             </Button>
//           </div>
//         </div>
//       ));
//     } catch (error) {
//       toast.error("Failed to delete product");
//     }
//   };

  



//   if (loading) return <div className="container p-6"><Loading /></div>;
//   if (!machine) return null;
 
//   return (
//     <div className="container p-6 min-h-screen">
//       <div
//         className="rounded-3xl p-8 shadow-2xl"
//         style={{ background: colors.background.main }}
//       >
//         {/* Image Section */}
//         <div
//           className="relative aspect-square rounded-2xl overflow-hidden border-2 mb-8"
//           style={{
//             borderColor: colors.primary.dark,
//             backgroundColor: colors.background.dark
//           }}
//         >
//           <img
//             src={machine.image}
//             alt={machine.model}
//             className="object-contain w-full h-full p-8"
//           />
//         </div>

//         {/* Details Section */}
//         <div className="space-y-8">
//           <div className="pb-6 border-b" style={{ borderColor: colors.primary.dark }}>
//             <div className="flex justify-between items-start">
//               <div>
//                 <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>
//                   {machine.model}
//                 </h1>
                
//               </div>
//               {isAdmin && (
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     className="text-cyan-400 border-cyan-400 hover:bg-cyan-900/20"
//                     onClick={() => setEditOpen(true)}
//                   >
//                     Edit Product
//                   </Button>
//                   <Button
//                     variant="outline"
//                     style={{
//                       color: colors.state.error,
//                       borderColor: colors.state.error
//                     }}
//                     onClick={handleDeleteProduct}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
//             {machine.description}
//           </p>

//           {/* Specifications */}
//           <div
//             className="rounded-xl p-6 border"
//             style={{
//               backgroundColor: colors.background.light,
//               borderColor: colors.primary.dark
//             }}
//           >
//             <h2 className="text-xl font-semibold"
//               style={{ color: colors.text.primary }}
//             >Technical Specifications</h2>
//             <div className="space-y-4">
//               {Object.entries(machine.specs).map(([key, value]) => (
//                 <div key={key} className="flex justify-between items-center py-2 border-b border-indigo-800/50">
//                   <span className="text-indigo-300">{key}</span>
//                   <span className="text-indigo-100 font-medium">{value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Action Buttons */}
        
//         </div>
//       </div>

//       {/* Edit Dialog */}
//       <Dialog open={editOpen} onOpenChange={setEditOpen}>
//         <DialogContent
//           className="max-w-2xl max-h-[90vh] overflow-y-auto"
//           style={{ background: colors.gradients.primary }}
//         >
//           <DialogHeader>
//             <DialogTitle>Edit Product Details</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <Label>Model Name</Label>
//                 <Input
//                   value={editData.model}
//                   onChange={(e) => setEditData(d => ({ ...d, model: e.target.value }))}
//                 />
//               </div>

             

//               <div className="col-span-full">
//                 <Label>Image URL</Label>
//                 <Input
//                   value={editData.image}
//                   onChange={(e) => setEditData(d => ({ ...d, image: e.target.value }))}
//                 />
//               </div>

//               <div className="col-span-full">
//                 <Label>Description</Label>
//                 <textarea
//                   value={editData.description}
//                   onChange={(e) => setEditData(d => ({ ...d, description: e.target.value }))}
//                   className="w-full border rounded-md p-2 min-h-[100px] bg-indigo-900/30 border-indigo-800/50 text-indigo-100"
//                 />
//               </div>

//               <div className="col-span-full">
//                 <Label className="text-sm" style={{ color: colors.text.secondary }}>
//                   Category
//                 </Label>
//                 <select
//                   className="w-full p-2 text-sm rounded-md"
//                   value={editData.category}
//                   onChange={(e) => setEditData(d => ({ ...d, category: e.target.value }))}
//                   style={{
//                     backgroundColor: colors.background.light,
//                     borderColor: colors.background.light,
//                     color: colors.text.primary
//                   }}
//                   required
//                 >
//                   {categories.length === 0 ? (
//                     <option disabled value="">Loading categories...</option>
//                   ) : (
//                     <>
//                       <option disabled value="">Select Category</option>
//                       {categories.map(c => (
//                         <option key={c.name} value={c.name}>{c.name}</option>
//                       ))}
//                     </>
//                   )}
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <Label>Specifications</Label>
//               <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
//                 {editData.specs.map((spec, idx) => (
//                   <div key={idx} className="flex gap-2">
//                     <Input
//                       value={spec[0]}
//                       placeholder="Spec name"
//                       onChange={(e) => handleEditSpecChange(idx, 0, e.target.value)}
//                     />
//                     <Input
//                       value={spec[1]}
//                       placeholder="Spec value"
//                       onChange={(e) => handleEditSpecChange(idx, 1, e.target.value)}
//                     />
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleDeleteSpec(idx)}
//                       className="shrink-0"
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//               <Button
//                 onClick={handleAddSpec}
//                 variant="secondary"
//                 className="w-full"
//               >
//                 Add Specification
//               </Button>
//             </div>

//             <div className="flex justify-end gap-4 mt-6">
//               <Button variant="outline" onClick={() => setEditOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleUpdateProduct}>Save Changes</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// app/(dashboard)/(routes)/products/item/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import Loading from "./loading";
import { colors } from "@/lib/colors";
import RichTextEditor from "@/components/RichTextEditor";

type Machine = {
  slug: string;
  model: string;
  image: string;
  description: string;
  category: string;
  specs: Record<string, string>;
  videoUrl?: string;
};

type Category = {
  name: string;
};

type EditFormData = {
  model: string;
  image: string;
  description: string;
  category: string;
  specs: [string, string][];
  videoUrl?: string;
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditFormData>({
    model: "",
    image: "",
    description: "",
    category: "",
    specs: [],
    videoUrl: "",
  });

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const { data } = await axios.get<Machine>(`/api/machines/${slug}`);
        setMachine(data);
        setEditData({
          model: data.model,
          image: data.image,
          description: data.description,
          category: data.category,
          specs: Object.entries(data.specs),
          videoUrl: data.videoUrl || "",
        });
      } catch {
        toast.error("Product not found");
        router.replace("/products");
      } finally {
        setLoading(false);
      }
    })();
    
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, [slug, router]);

  const handleEditSpecChange = (index: number, field: number, value: string) => {
    const updatedSpecs = [...editData.specs];
    updatedSpecs[index][field] = value;
    setEditData(d => ({ ...d, specs: updatedSpecs }));
  };

  const handleAddSpec = () => setEditData(d => ({ ...d, specs: [...d.specs, ["", ""]] }));
  const handleDeleteSpec = (index: number) => setEditData(d => ({ ...d, specs: d.specs.filter((_, i) => i !== index) }));

  const handleUpdateProduct = async () => {
    try {
      const specsObj = Object.fromEntries(editData.specs.filter(([k, v]) => k && v));
      await axios.put(`/api/machines/${slug}`, { ...editData, specs: specsObj });
      toast.success("Product updated!");

      const { data } = await axios.get<Machine>(`/api/machines/${slug}`);
      setMachine(data);
      setEditData({
        model: data.model,
        image: data.image,
        description: data.description,
        category: data.category,
        specs: Object.entries(data.specs),
        videoUrl: data.videoUrl || "",
      });
      setEditOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      toast.custom((t) => (
        <div className="bg-background-main p-4 rounded-lg shadow-xl border border-red-500/30"
          style={{ background: colors.background.main }}
        >
          <h3 className="font-semibold mb-4" style={{ color: colors.text.primary }}>
            Confirm Deletion
          </h3>
          <p className="mb-4" style={{ color: colors.text.secondary }}>
            Are you sure you want to delete this product permanently?
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
                await axios.delete(`/api/machines/${slug}`);
                toast.dismiss(t);
                toast.success("Product deleted successfully");
                router.push("/dashboard");
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <div className="container p-6"><Loading /></div>;
  if (!machine) return null;
  
  // Helper function to extract YouTube ID
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="container p-6 min-h-screen">
      <div
        className="rounded-3xl p-8 shadow-2xl"
        style={{ background: colors.background.main }}
      >
        {/* Image Section */}
        <div
          className="relative aspect-square rounded-2xl overflow-hidden border-2 mb-8"
          style={{
            borderColor: colors.primary.dark,
            backgroundColor: colors.background.dark
          }}
        >
          <img
            src={machine.image}
            alt={machine.model}
            className="object-contain w-full h-full p-8"
          />
        </div>

        {/* Details Section */}
        <div className="space-y-8">
          <div className="pb-6 border-b" style={{ borderColor: colors.primary.dark }}>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold" style={{ color: colors.text.primary }}>
                  {machine.model}
                </h1>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-cyan-400 border-cyan-400 hover:bg-cyan-900/20"
                    onClick={() => setEditOpen(true)}
                  >
                    Edit Product
                  </Button>
                  <Button
                    variant="outline"
                    style={{
                      color: colors.state.error,
                      borderColor: colors.state.error
                    }}
                    onClick={handleDeleteProduct}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Formatted HTML Description */}
          <div 
            className="prose prose-invert max-w-none" 
            style={{ color: colors.text.primary }}
            dangerouslySetInnerHTML={{ __html: machine.description }} 
          />

          {/* Specifications */}
          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background.light,
              borderColor: colors.primary.dark
            }}
          >
            <h2 className="text-xl font-semibold"
              style={{ color: colors.text.primary }}
            >Technical Specifications</h2>
            <div className="space-y-4">
              {Object.entries(machine.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-indigo-800/50">
                  <span className="text-indigo-300">{key}</span>
                  <span className="text-indigo-100 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Section */}
          {machine.videoUrl && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>
                Product Video
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(machine.videoUrl)}`}
                  title={machine.model}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ background: colors.gradients.primary }}
        >
          <DialogHeader>
            <DialogTitle>Edit Product Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Model Name</Label>
                <Input
                  value={editData.model}
                  onChange={(e) => setEditData(d => ({ ...d, model: e.target.value }))}
                />
              </div>

              <div className="col-span-full">
                <Label>Image URL</Label>
                <Input
                  value={editData.image}
                  onChange={(e) => setEditData(d => ({ ...d, image: e.target.value }))}
                />
              </div>

              {/* Video URL */}
              <div className="col-span-full">
                <Label>Video URL (YouTube)</Label>
                <Input
                  value={editData.videoUrl || ''}
                  onChange={(e) => setEditData(d => ({ ...d, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Rich Text Editor for Description */}
              <div className="col-span-full"
              style={{ color: colors.text.primary }}
              >
                <Label>Description</Label>
                <RichTextEditor
                  value={editData.description}
                  onChange={value => setEditData(d => ({ ...d, description: value }))}
                />
              </div>

              <div className="col-span-full">
                <Label className="text-sm" style={{ color: colors.text.secondary }}>
                  Category
                </Label>
                <select
                  className="w-full p-2 text-sm rounded-md"
                  value={editData.category}
                  onChange={(e) => setEditData(d => ({ ...d, category: e.target.value }))}
                  style={{
                    backgroundColor: colors.background.light,
                    borderColor: colors.background.light,
                    color: colors.text.primary
                  }}
                  required
                >
                  {categories.length === 0 ? (
                    <option disabled value="">Loading categories...</option>
                  ) : (
                    <>
                      <option disabled value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Specifications</Label>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {editData.specs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={spec[0]}
                      placeholder="Spec name"
                      onChange={(e) => handleEditSpecChange(idx, 0, e.target.value)}
                    />
                    <Input
                      value={spec[1]}
                      placeholder="Spec value"
                      onChange={(e) => handleEditSpecChange(idx, 1, e.target.value)}
                    />
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteSpec(idx)}
                      className="shrink-0"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleAddSpec}
                variant="secondary"
                className="w-full"
              >
                Add Specification
              </Button>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}