// // app/(dashboard)/(routes)/dashboard/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { useUser, useAuth } from "@clerk/nextjs";
// import { useMachines } from "@/components/machine";
// import axios from "axios";
// import { toast, Toaster } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Plus, ListTree, Wallet, Users, Warehouse, Trash2, Edit, BookCheck, Shield, ArrowLeft } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { colors } from "@/lib/colors";
// import RichTextEditor from "@/components/RichTextEditor";
// import ImageUpload from "@/components/ImageUpload";
// import Link from "next/link";
// import { TestimonialDialog } from "@/components/TestimonialDialog";
// import { SlideshowDialog } from "@/components/SlideshowDialog";

// type StatCardProps = {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
// };

// const StatCard = ({ title, value, icon }: StatCardProps) => (
//   <motion.div
//     whileHover={{ scale: 1.02 }}
//     className="p-3 sm:p-4 rounded-lg border bg-background-light"
//     style={{ borderColor: colors.background.light }}
//   >
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-xs sm:text-sm" style={{ color: colors.text.secondary }}>
//           {title}
//         </p>
//         <p className="text-xl sm:text-2xl font-bold" style={{ color: colors.text.primary }}>
//           {value}
//         </p>
//       </div>
//       <div className="p-2 sm:p-3 rounded-md" style={{ backgroundColor: colors.background.light }}>
//         {icon}
//       </div>
//     </div>
//   </motion.div>
// );

// export default function DashboardPage() {

//   const router = useRouter();
//   const { user, isSignedIn, isLoaded } = useUser();
//   const { getToken } = useAuth();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const { machines, categories, blogs, addMachine, refresh, refreshCategories, refreshBlog } = useMachines();

//   // Category dialog state
//   const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [editingCategory, setEditingCategory] = useState<string | null>(null);
//   const firstCategoryUrl = categories.length > 0
//     ? `/products/category/${categories[0].name.toLowerCase().replace(/\s+/g, "-")}`
//     : "/products";
//   // Product dialog state
//   const [productDialogOpen, setProductDialogOpen] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     slug: "",
//     model: "",
//     image: "",
//     imagePublicId: "",
//     description: "",
//     category: categories[0]?.name || "",
//     specs: [] as [string, string][],
//     videoUrl: "",
//   });

//   const [activeUsers, setActiveUsers] = useState(0);

//   // Set admin flag when user is available
//   useEffect(() => {
//     if (user) {
//       setIsAdmin(user.publicMetadata.role === "admin");
//     }
//   }, [user]);

//   // Fetch categories & machines only for admin
//   useEffect(() => {
//     if (isAdmin) {
//       refreshCategories();
//       refresh();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAdmin]);

//   // Load analytics only for admin
//   useEffect(() => {
//     if (!isAdmin || !isSignedIn) return;
//     (async () => {
//       try {
//         try {
//           const { data: u } = await axios.get("/api/users/active");
//           setActiveUsers(u.count);
//         } catch {
//           setActiveUsers(0);
//         }
//       } catch (e) {
//         console.error(e);
//         toast.error("Failed to load analytics data");
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAdmin, isSignedIn]);

//   // Category handlers
//   const handleCategorySubmit = async () => {
//     if (!isSignedIn || !isAdmin) return;
//     try {
//       if (!newCategory.trim()) throw new Error("Name required");
//       if (editingCategory) {
//         await axios.put(`/api/categories/${encodeURIComponent(editingCategory)}`, { name: newCategory });
//         toast.success("Category updated");
//       } else {
//         await axios.post("/api/categories", { name: newCategory });
//         toast.success("Category added");
//       }
//       setNewCategory("");
//       setEditingCategory(null);
//       await refreshCategories();
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || err.message);
//     }
//   };

//   const handleDeleteCategory = async (name: string) => {
//     if (!isSignedIn || !isAdmin) return;
//     try {
//       await axios.delete(`/api/categories/${name}`);
//       await refreshCategories();
//       await refresh();
//       toast.success("Category deleted");
//     } catch {
//       toast.error("Failed to delete");
//     }
//   };

//   // Product handlers
//   const handleAddProduct = async () => {
//     if (!isSignedIn || !isAdmin) return;
//     try {
//       const { slug, model, image, imagePublicId, description, category, specs, videoUrl } = newProduct;
//       if (!slug || !model || !image || !description) throw new Error("All fields required");
//       const specsObj = Object.fromEntries(specs);
//       await addMachine({
//         slug,
//         model,
//         image,
//         imagePublicId,
//         description,
//         category,
//         specs: specsObj,
//         videoUrl
//       });
//       toast.success("Product added");
//       setProductDialogOpen(false);
//       setNewProduct({
//         slug: "",
//         model: "",
//         image: "",
//         imagePublicId: "",
//         description: "",
//         category: categories[0]?.name || "",
//         specs: [],
//         videoUrl: ""
//       });
//       await refresh();
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || err.message);
//     }
//   };

//   // Show loading state while checking authentication
//   if (!isLoaded) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary.main }}></div>
//           <p style={{ color: colors.text.secondary }}>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Redirect to sign-in if not authenticated
//   if (!isSignedIn) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
//         <Toaster richColors position="top-center" />
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }} 
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center p-8 rounded-xl shadow-lg max-w-md mx-4"
//           style={{ background: colors.background.main }}
//         >
//           <Shield className="h-16 w-16 mx-auto mb-4" style={{ color: colors.primary.main }} />
//           <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
//             Authentication Required
//           </h1>
//           <p className="mb-6" style={{ color: colors.text.secondary }}>
//             You need to sign in to access the dashboard.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <Link href="/sign-in">
//               <Button className="w-full sm:w-auto" style={{ background: colors.primary.main }}>
//                 Sign In
//               </Button>
//             </Link>
//             <Link href="/">
//               <Button variant="outline" className="w-full sm:w-auto" style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Go Home
//               </Button>
//             </Link>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   // Show access denied for non-admin users
//   if (isSignedIn && !isAdmin) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
//         <Toaster richColors position="top-center" />
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }} 
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center p-8 rounded-xl shadow-lg max-w-md mx-4"
//           style={{ background: colors.background.main }}
//         >
//           <Shield className="h-16 w-16 mx-auto mb-4" style={{ color: colors.state.error }} />
//           <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
//             Access Restricted
//           </h1>
//           <p className="mb-2" style={{ color: colors.text.secondary }}>
//             This dashboard is only accessible to administrators.
//           </p>
//           <p className="mb-6 text-sm" style={{ color: colors.text.secondary }}>
//             Contact support if you believe this is an error.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <Link href="/">
//               <Button className="w-full sm:w-auto" style={{ background: colors.primary.main }}>
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Go Home
//               </Button>
//             </Link>
//             <Link href={firstCategoryUrl}>
//               <Button variant="outline" className="w-full sm:w-auto" style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
//                 Browse Products
//               </Button>
//             </Link>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   // Admin Dashboard View
//   return (
//     <div className="p-4 sm:p-6 space-y-6 min-h-screen" style={{ background: colors.background.dark }}>
//       <Toaster richColors position="top-center" />
      
//       {/* Header & Actions */}
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4 rounded-xl p-4 sm:p-6 shadow-lg" style={{ background: colors.background.main }}>
//         <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: colors.gradients.primary }}>
//               Admin Dashboard
//             </h1>
//             <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
//               Welcome back, {user?.firstName || 'Admin'}
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-2 w-full sm:w-auto">
//             <Button onClick={() => setProductDialogOpen(true)} style={{ background: colors.gradients.primary }} className="flex items-center gap-1">
//               <Plus className="h-4 w-4" /> Add Product
//             </Button>
//             <Button variant="outline" onClick={() => setCategoryDialogOpen(true)} style={{ borderColor: colors.primary.main, color: colors.primary.main }} className="flex items-center gap-1">
//               <Plus className="h-4 w-4" /> Manage Categories
//             </Button>
//             <TestimonialDialog />
//             <SlideshowDialog />
//           </div>
//         </motion.header>

//         {/* Stats */}
//         <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <StatCard title="Total Products" value={machines.length} icon={<Warehouse style={{ color: colors.primary.main }} />} />
//           <StatCard title="Categories" value={categories.length} icon={<ListTree style={{ color: colors.icons.quadra }} />} />
//           <StatCard title="Blogs" value={blogs.length} icon={<BookCheck style={{ color: colors.icons.secondary }} />} />
//           <StatCard title="Active Users" value={activeUsers} icon={<Users style={{ color: colors.state.success }} />} />
//         </div>
//       </motion.div>

//       {/* Category Dialog */}
//       <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
//         <DialogContent className="max-w-md" style={{ backgroundColor: colors.background.main }}>
//           <DialogHeader>
//             <DialogTitle style={{ color: colors.text.primary }}>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <Label style={{ color: colors.text.secondary }}>Name</Label>
//             <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }} />
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => { setCategoryDialogOpen(false); setEditingCategory(null); setNewCategory(""); }} style={{
//                 background: colors.state.error,
//                 borderColor: colors.background.dark,
//                 color: colors.text.primary
//               }}>
//                 Cancel
//               </Button>
//               <Button onClick={handleCategorySubmit} style={{ background: colors.primary.main }}>Save</Button>
//             </div>
//             <div className="space-y-2 max-h-40 overflow-y-auto">
//               {categories.map(c => (
//                 <div key={c.name} className="flex justify-between items-center p-2 rounded-md" style={{ backgroundColor: colors.background.light }}>
//                   <span style={{ color: colors.text.primary }}>{c.name}</span>
//                   <div className="flex gap-1">
//                     <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(c.name); setNewCategory(c.name); }} style={{ color: colors.primary.main }}><Edit size={16} /></Button>
//                     <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(c.name)} style={{ color: colors.state.error }}><Trash2 size={16} /></Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Product Dialog */}
//       <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
//         <DialogContent
//           className="max-w-2xl max-h-[90vh] overflow-y-auto"
//           style={{ backgroundColor: colors.background.main }}
//         >
//           <DialogHeader>
//             <DialogTitle style={{ color: colors.text.primary }}>Add Product</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <Label style={{ color: colors.text.secondary }}>Category</Label>
//             <select
//               value={newProduct.category}
//               onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
//               required
//               className="w-full p-2 rounded-md"
//               style={{
//                 backgroundColor: colors.background.light,
//                 borderColor: colors.background.light,
//                 color: colors.text.primary
//               }}
//             >
//               {categories.length > 0 ? (
//                 <>
//                   <option disabled value="">
//                     Select Category
//                   </option>
//                   {categories.map(c => (
//                     <option key={c.name} value={c.name}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </>
//               ) : (
//                 <option disabled value="">
//                   Loading categories...
//                 </option>
//               )}
//             </select>
//             {/* Fields */}
//             {["slug", "model"].map(f => (
//               <div key={f} className="space-y-1">
//                 <Label className="capitalize" style={{ color: colors.text.secondary }}>{f}</Label>
//                 <Input
//                   value={(newProduct as any)[f]}
//                   onChange={e => setNewProduct(p => ({ ...p, [f]: e.target.value }))}
//                   style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
//                 />
//               </div>
//             ))}

//             {/* Image Upload */}
//             <div className="space-y-1">
//               <Label style={{ color: colors.text.secondary }}>Product Image</Label>
//               <ImageUpload
//                 value={newProduct.image}
//                 onChange={(url, publicId) => setNewProduct(p => ({
//                   ...p,
//                   image: url,
//                   imagePublicId: publicId || ""
//                 }))}
//               />
//             </div>

//             {/* Video URL */}
//             <div className="space-y-1">
//               <Label style={{ color: colors.text.secondary }}>Video URL (YouTube)</Label>
//               <Input
//                 value={newProduct.videoUrl}
//                 onChange={e => setNewProduct(p => ({ ...p, videoUrl: e.target.value }))}
//                 placeholder="https://www.youtube.com/watch?v=..."
//                 style={{ color: colors.primary.light }}
//               />
//             </div>

//             {/* Description with RichTextEditor */}
//             <div className="space-y-1"
//               style={{ color: colors.text.primary }}
//             >
//               <Label style={{ color: colors.text.secondary }}>Description</Label>
//               <RichTextEditor
//                 value={newProduct.description}
//                 onChange={value => setNewProduct(p => ({ ...p, description: value }))}
//               />
//             </div>
//             {/* Specs */}
//             <div className="space-y-1">
//               <Label style={{ color: colors.text.secondary }}>Specifications</Label>
//               <div className="space-y-2 max-h-40 overflow-y-auto">
//                 {newProduct.specs.map((sp, i) => (
//                   <div key={i} className="flex gap-2">
//                     <Input
//                       value={sp[0]}
//                       onChange={e => { const arr = [...newProduct.specs]; arr[i][0] = e.target.value; setNewProduct(p => ({ ...p, specs: arr })); }}
//                       style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
//                     />
//                     <Input
//                       value={sp[1]}
//                       onChange={e => { const arr = [...newProduct.specs]; arr[i][1] = e.target.value; setNewProduct(p => ({ ...p, specs: arr })); }}
//                       style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
//                     />
//                   </div>
//                 ))}
//               </div>
//               <Button variant="outline" className="w-full" onClick={() => setNewProduct(p => ({ ...p, specs: [...p.specs, ["", ""]] }))} style={{ background: colors.primary.main, color: colors.text.primary }}>
//                 <Plus className="mr-1" /> Add Spec
//               </Button>
//             </div>
//             {/* Actions */}
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setProductDialogOpen(false)} style={{
//                 background: colors.state.error,
//                 borderColor: colors.background.dark,
//                 color: colors.text.primary
//               }}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddProduct} style={{ background: colors.primary.main }}>Add</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
// app/(dashboard)/(routes)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser, useAuth } from "@clerk/nextjs";
import { useMachines } from "@/components/machine";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ListTree, Wallet, Users, Warehouse, Trash2, Edit, BookCheck, Shield, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colors } from "@/lib/colors";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";
import { TestimonialDialog } from "@/components/TestimonialDialog";
import { SlideshowDialog } from "@/components/SlideshowDialog";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-3 sm:p-4 rounded-lg border bg-background-light"
    style={{ borderColor: colors.background.light }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm" style={{ color: colors.text.secondary }}>
          {title}
        </p>
        <p className="text-xl sm:text-2xl font-bold" style={{ color: colors.text.primary }}>
          {value}
        </p>
      </div>
      <div className="p-2 sm:p-3 rounded-md" style={{ backgroundColor: colors.background.light }}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export default function DashboardPage() {

  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const { machines, categories, blogs, addMachine, refresh, refreshCategories, refreshBlog } = useMachines();

  // Category dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const firstCategoryUrl = categories.length > 0
    ? `/products/category/${categories[0].name.toLowerCase().replace(/\s+/g, "-")}`
    : "/products";
  // Product dialog state
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    slug: "",
    model: "",
    image: "",
    imagePublicId: "",
    description: "",
    category: categories[0]?.name || "",
    specs: [] as [string, string][],
    videoUrl: "",
  });

  const [activeUsers, setActiveUsers] = useState(0);

  // Set admin flag when user is available
  useEffect(() => {
    if (user) {
      setIsAdmin(user.publicMetadata.role === "admin");
    }
  }, [user]);

  // Fetch categories & machines only for admin
  useEffect(() => {
    if (isAdmin) {
      refreshCategories();
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Load analytics only for admin
  useEffect(() => {
    if (!isAdmin || !isSignedIn) return;
    (async () => {
      try {
        try {
          const { data: u } = await axios.get("/api/users/active");
          setActiveUsers(u.count);
        } catch {
          setActiveUsers(0);
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load analytics data");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isSignedIn]);

  // Category handlers
  const handleCategorySubmit = async () => {
    if (!isSignedIn || !isAdmin) return;
    try {
      if (!newCategory.trim()) throw new Error("Name required");
      if (editingCategory) {
        await axios.put(`/api/categories/${encodeURIComponent(editingCategory)}`, { name: newCategory });
        toast.success("Category updated");
      } else {
        await axios.post("/api/categories", { name: newCategory });
        toast.success("Category added");
      }
      setNewCategory("");
      setEditingCategory(null);
      await refreshCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (!isSignedIn || !isAdmin) return;
    try {
      await axios.delete(`/api/categories/${name}`);
      await refreshCategories();
      await refresh();
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Product handlers
  const handleAddProduct = async () => {
    if (!isSignedIn || !isAdmin) return;
    try {
      const { slug, model, image, imagePublicId, description, category, specs, videoUrl } = newProduct;
      if (!slug || !model || !image || !description) throw new Error("All fields required");
      
      // FIXED: Filter out empty specs and send as array to preserve order
      const filteredSpecs = specs.filter(([k, v]) => k.trim() && v.trim());
      
      await addMachine({
        slug,
        model,
        image,
        imagePublicId,
        description,
        category,
        specs: filteredSpecs, // Send as array instead of converting to object
        videoUrl
      });
      toast.success("Product added");
      setProductDialogOpen(false);
      setNewProduct({
        slug: "",
        model: "",
        image: "",
        imagePublicId: "",
        description: "",
        category: categories[0]?.name || "",
        specs: [],
        videoUrl: ""
      });
      await refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  // ADDED: Helper functions for specs management
  const handleAddSpec = () => {
    setNewProduct(p => ({ ...p, specs: [...p.specs, ["", ""]] }));
  };

  const handleSpecChange = (index: number, field: number, value: string) => {
    const updatedSpecs = [...newProduct.specs];
    updatedSpecs[index][field] = value;
    setNewProduct(p => ({ ...p, specs: updatedSpecs }));
  };

  const handleDeleteSpec = (index: number) => {
    setNewProduct(p => ({ ...p, specs: p.specs.filter((_, i) => i !== index) }));
  };

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary.main }}></div>
          <p style={{ color: colors.text.secondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
        <Toaster richColors position="top-center" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 rounded-xl shadow-lg max-w-md mx-4"
          style={{ background: colors.background.main }}
        >
          <Shield className="h-16 w-16 mx-auto mb-4" style={{ color: colors.primary.main }} />
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Authentication Required
          </h1>
          <p className="mb-6" style={{ color: colors.text.secondary }}>
            You need to sign in to access the dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-in">
              <Button className="w-full sm:w-auto" style={{ background: colors.primary.main }}>
                Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto" style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (isSignedIn && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
        <Toaster richColors position="top-center" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 rounded-xl shadow-lg max-w-md mx-4"
          style={{ background: colors.background.main }}
        >
          <Shield className="h-16 w-16 mx-auto mb-4" style={{ color: colors.state.error }} />
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Access Restricted
          </h1>
          <p className="mb-2" style={{ color: colors.text.secondary }}>
            This dashboard is only accessible to administrators.
          </p>
          <p className="mb-6 text-sm" style={{ color: colors.text.secondary }}>
            Contact support if you believe this is an error.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto" style={{ background: colors.primary.main }}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href={firstCategoryUrl}>
              <Button variant="outline" className="w-full sm:w-auto" style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
                Browse Products
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard View
  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen" style={{ background: colors.background.dark }}>
      <Toaster richColors position="top-center" />
      
      {/* Header & Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4 rounded-xl p-4 sm:p-6 shadow-lg" style={{ background: colors.background.main }}>
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: colors.gradients.primary }}>
              Admin Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
              Welcome back, {user?.firstName || 'Admin'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button onClick={() => setProductDialogOpen(true)} style={{ background: colors.gradients.primary }} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(true)} style={{ borderColor: colors.primary.main, color: colors.primary.main }} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Manage Categories
            </Button>
            <TestimonialDialog />
            <SlideshowDialog />
          </div>
        </motion.header>

        {/* Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Products" value={machines.length} icon={<Warehouse style={{ color: colors.primary.main }} />} />
          <StatCard title="Categories" value={categories.length} icon={<ListTree style={{ color: colors.icons.quadra }} />} />
          <StatCard title="Blogs" value={blogs.length} icon={<BookCheck style={{ color: colors.icons.secondary }} />} />
          <StatCard title="Active Users" value={activeUsers} icon={<Users style={{ color: colors.state.success }} />} />
        </div>
      </motion.div>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-md" style={{ backgroundColor: colors.background.main }}>
          <DialogHeader>
            <DialogTitle style={{ color: colors.text.primary }}>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label style={{ color: colors.text.secondary }}>Name</Label>
            <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setCategoryDialogOpen(false); setEditingCategory(null); setNewCategory(""); }} style={{
                background: colors.state.error,
                borderColor: colors.background.dark,
                color: colors.text.primary
              }}>
                Cancel
              </Button>
              <Button onClick={handleCategorySubmit} style={{ background: colors.primary.main }}>Save</Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map(c => (
                <div key={c.name} className="flex justify-between items-center p-2 rounded-md" style={{ backgroundColor: colors.background.light }}>
                  <span style={{ color: colors.text.primary }}>{c.name}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(c.name); setNewCategory(c.name); }} style={{ color: colors.primary.main }}><Edit size={16} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(c.name)} style={{ color: colors.state.error }}><Trash2 size={16} /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: colors.background.main }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: colors.text.primary }}>Add Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label style={{ color: colors.text.secondary }}>Category</Label>
            <select
              value={newProduct.category}
              onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
              required
              className="w-full p-2 rounded-md"
              style={{
                backgroundColor: colors.background.light,
                borderColor: colors.background.light,
                color: colors.text.primary
              }}
            >
              {categories.length > 0 ? (
                <>
                  <option disabled value="">
                    Select Category
                  </option>
                  {categories.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </>
              ) : (
                <option disabled value="">
                  Loading categories...
                </option>
              )}
            </select>
            {/* Fields */}
            {["slug", "model"].map(f => (
              <div key={f} className="space-y-1">
                <Label className="capitalize" style={{ color: colors.text.secondary }}>{f}</Label>
                <Input
                  value={(newProduct as any)[f]}
                  onChange={e => setNewProduct(p => ({ ...p, [f]: e.target.value }))}
                  style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
                />
              </div>
            ))}

            {/* Image Upload */}
            <div className="space-y-1">
              <Label style={{ color: colors.text.secondary }}>Product Image</Label>
              <ImageUpload
                value={newProduct.image}
                onChange={(url, publicId) => setNewProduct(p => ({
                  ...p,
                  image: url,
                  imagePublicId: publicId || ""
                }))}
              />
            </div>

            {/* Video URL */}
            <div className="space-y-1">
              <Label style={{ color: colors.text.secondary }}>Video URL (YouTube)</Label>
              <Input
                value={newProduct.videoUrl}
                onChange={e => setNewProduct(p => ({ ...p, videoUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{ color: colors.primary.light }}
              />
            </div>

            {/* Description with RichTextEditor */}
            <div className="space-y-1"
              style={{ color: colors.text.primary }}
            >
              <Label style={{ color: colors.text.secondary }}>Description</Label>
              <RichTextEditor
                value={newProduct.description}
                onChange={value => setNewProduct(p => ({ ...p, description: value }))}
              />
            </div>
            
            {/* IMPROVED: Specifications Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label style={{ color: colors.text.secondary }}>Specifications</Label>
                <span className="text-sm text-gray-500">
                  {newProduct.specs.length} specification{newProduct.specs.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {newProduct.specs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="w-8 text-sm text-gray-500 flex-shrink-0">
                      {idx + 1}.
                    </div>
                    <Input
                      value={spec[0]}
                      placeholder="Specification name"
                      onChange={(e) => handleSpecChange(idx, 0, e.target.value)}
                      className="flex-1"
                      style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
                    />
                    <Input
                      value={spec[1]}
                      placeholder="Specification value"
                      onChange={(e) => handleSpecChange(idx, 1, e.target.value)}
                      className="flex-1"
                      style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSpec(idx)}
                      className="shrink-0"
                      style={{ backgroundColor: colors.state.error }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {newProduct.specs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No specifications added yet. Click "Add Specification" to get started.
                  </div>
                )}
              </div>
              <Button
                onClick={handleAddSpec}
                variant="outline"
                className="w-full"
                style={{ background: colors.primary.main, color: colors.text.primary }}
              >
                <Plus className="mr-1" /> Add Specification
              </Button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setProductDialogOpen(false)} style={{
                background: colors.state.error,
                borderColor: colors.background.dark,
                color: colors.text.primary
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} style={{ background: colors.primary.main }}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}