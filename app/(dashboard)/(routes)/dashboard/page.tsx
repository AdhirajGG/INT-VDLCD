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
// import { Plus, ListTree, Wallet, Users, Warehouse, Trash2, Edit } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { colors } from "@/lib/colors";
// import RichTextEditor from "@/components/RichTextEditor";
// import Link from "next/link";


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
//   const { user, isSignedIn } = useUser();
//   const { getToken } = useAuth();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const { machines, categories,blogs, addMachine, refresh, refreshCategories, refreshBlog } = useMachines();
//   const firstCategoryUrl = categories.length > 0
//     ? `/products/category/${categories[0].name.toLowerCase().replace(/\s+/g, "-")}`
//     : "/products"; // fallback if no categories

//   // Category dialog state
//   const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [editingCategory, setEditingCategory] = useState<string | null>(null);

//   // Product dialog state
//   const [productDialogOpen, setProductDialogOpen] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     slug: "",
//     model: "",
//     image: "",
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

//   // Fetch categories & machines once
//   useEffect(() => {
//     refreshCategories();
//     refresh();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Load analytics once if admin
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

//   // Category handlers (only for admin)
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

//   // Product handlers (only for admin)
//   const handleAddProduct = async () => {
//     if (!isSignedIn || !isAdmin) return;
//     try {
//       const { slug, model, image, description, category, specs, videoUrl } = newProduct;
//       if (!slug || !model || !image || !description) throw new Error("All fields required");
//       const specsObj = Object.fromEntries(specs);
//       await addMachine({ slug, model, image, description, category, specs: specsObj, videoUrl });
//       toast.success("Product added");
//       setProductDialogOpen(false);
//       setNewProduct({ slug: "", model: "", image: "", description: "", category: categories[0]?.name || "", specs: [], videoUrl: "" });
//       await refresh();
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || err.message);
//     }
//   };

//   // Public Dashboard View (for non-authenticated users)
//   if (!isSignedIn) {
//     return (
//       <div className="p-4 sm:p-6 space-y-6 min-h-screen" style={{ background: colors.background.dark }}>
//         <Toaster richColors position="top-center" />

//         {/* Public Header */}
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4 rounded-xl p-4 sm:p-6 shadow-lg" style={{ background: colors.background.main }}>
//           <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//             <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: colors.gradients.primary }}>
//               Public Dashboard
//             </h1>
//             <div className="flex gap-2 w-full sm:w-auto">
//               <Link href="/sign-in">
//                 <Button style={{ background: colors.primary.main }}>
//                   Sign In
//                 </Button>
//               </Link>
//               <Link href="/sign-up">
//                 <Button variant="outline" style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
//                   Sign Up
//                 </Button>
//               </Link>
//             </div>
//           </motion.header>

//           {/* Public Stats */}
//           <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             <StatCard title="Total Products" value={machines.length} icon={<Warehouse style={{ color: colors.primary.main }} />} />
//             <StatCard title="Categories" value={categories.length} icon={<ListTree style={{ color: colors.secondary.main }} />} />
//             <StatCard title="Blogs" value={blogs.length} icon={<ListTree style={{ color: colors.secondary.main }} />} />
//             <StatCard title="Public Access" value={1} icon={<Users style={{ color: colors.state.success }} />} />
//           </div>

//           {/* Public Information */}
//           <div className="text-center p-6 rounded-lg" style={{ background: colors.background.light }}>
//             <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>
//               Welcome to Our Platform
//             </h2>
//             <p className="mb-4" style={{ color: colors.text.secondary }}>
//               Explore our products, videos, and resources. Sign in to access blog content and personalized features.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href={firstCategoryUrl}>
//                 <Button style={{ background: colors.primary.main }}>
//                   Browse Products
//                 </Button>
//               </Link>
//               <Link href="/videos">
//                 <Button variant="outline" style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
//                   Watch Videos
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   // Authenticated Dashboard View
//   return (
//     <div className="p-4 sm:p-6 space-y-6 min-h-screen" style={{ background: colors.background.dark }}>
//       <Toaster richColors position="top-center" />

//       {/* Header & Actions */}
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4 rounded-xl p-4 sm:p-6 shadow-lg" style={{ background: colors.background.main }}>
//         <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: colors.gradients.primary }}>
//             {isAdmin ? "Admin" : "User"} Dashboard
//           </h1>
//           {isAdmin && (
//             <div className="flex gap-2 w-full sm:w-auto">
//               <Button onClick={() => setProductDialogOpen(true)} style={{ background: colors.gradients.primary }}>
//                 <Plus className="mr-1" /> Add Product
//               </Button>
//               <Button variant="outline" onClick={() => setCategoryDialogOpen(true)} style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
//                 <Plus className="mr-1" /> Manage Categories
//               </Button>
//             </div>
//           )}
//         </motion.header>

//         {/* Stats */}
//         <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <StatCard title="Total Products" value={machines.length} icon={<Warehouse style={{ color: colors.primary.main }} />} />
//           <StatCard title="Categories" value={categories.length} icon={<ListTree style={{ color: colors.secondary.main }} />} />
//           {/* <StatCard title="Active Users" value={activeUsers} icon={<Users style={{ color: colors.state.success }} />} /> */}
//           <StatCard title="Blogs" value={blogs.length} icon={<ListTree style={{ color: colors.secondary.main }} />} />
//         </div>
//       </motion.div>

//       {/* Admin-only dialogs */}
//       {isAdmin && (
//         <>
//           {/* Category Dialog */}
//           <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
//             <DialogContent className="max-w-md" style={{ backgroundColor: colors.background.main }}>
//               <DialogHeader>
//                 <DialogTitle style={{ color: colors.text.primary }}>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <Label style={{ color: colors.text.secondary }}>Name</Label>
//                 <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }} />
//                 <div className="flex justify-end gap-2">
//                   <Button variant="outline" onClick={() => { setCategoryDialogOpen(false); setEditingCategory(null); setNewCategory(""); }} style={{
//                     background: colors.state.error,
//                     borderColor: colors.background.dark,
//                     color: colors.text.primary
//                   }}>
//                     Cancel
//                   </Button>
//                   <Button onClick={handleCategorySubmit} style={{ background: colors.primary.main }}>Save</Button>
//                 </div>
//                 <div className="space-y-2 max-h-40 overflow-y-auto">
//                   {categories.map(c => (
//                     <div key={c.name} className="flex justify-between items-center p-2 rounded-md" style={{ backgroundColor: colors.background.light }}>
//                       <span style={{ color: colors.text.primary }}>{c.name}</span>
//                       <div className="flex gap-1">
//                         <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(c.name); setNewCategory(c.name); }} style={{ color: colors.primary.main }}><Edit size={16} /></Button>
//                         <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(c.name)} style={{ color: colors.state.error }}><Trash2 size={16} /></Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>

//           {/* Product Dialog */}
//           <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
//             <DialogContent
//               className="max-w-2xl max-h-[90vh] overflow-y-auto"
//               style={{ backgroundColor: colors.background.main }}
//             >
//               <DialogHeader>
//                 <DialogTitle style={{ color: colors.text.primary }}>Add Product</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <Label style={{ color: colors.text.secondary }}>Category</Label>
//                 <select
//                   value={newProduct.category}
//                   onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
//                   required
//                   className="w-full p-2 rounded-md"
//                   style={{
//                     backgroundColor: colors.background.light,
//                     borderColor: colors.background.light,
//                     color: colors.text.primary
//                   }}
//                 >
//                   {categories.length > 0 ? (
//                     <>
//                       <option disabled value="">
//                         Select Category
//                       </option>
//                       {categories.map(c => (
//                         <option key={c.name} value={c.name}>
//                           {c.name}
//                         </option>
//                       ))}
//                     </>
//                   ) : (
//                     <option disabled value="">
//                       Loading categories...
//                     </option>
//                   )}
//                 </select>
//                 {/* Fields */}
//                 {["slug", "model", "image"].map(f => (
//                   <div key={f} className="space-y-1">
//                     <Label className="capitalize" style={{ color: colors.text.secondary }}>{f}</Label>
//                     <Input
//                       value={(newProduct as any)[f]}
//                       onChange={e => setNewProduct(p => ({ ...p, [f]: e.target.value }))}
//                       style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
//                     />
//                   </div>
//                 ))}
//                 {/* Video URL */}
//                 <div className="space-y-1">
//                   <Label style={{ color: colors.text.secondary }}>Video URL (YouTube)</Label>
//                   <Input
//                     value={newProduct.videoUrl}
//                     onChange={e => setNewProduct(p => ({ ...p, videoUrl: e.target.value }))}
//                     placeholder="https://www.youtube.com/watch?v=..."
//                     style={{ color: colors.primary.light }}
//                   />
//                 </div>

//                 {/* Description with RichTextEditor */}
//                 <div className="space-y-1"
//                   style={{ color: colors.text.primary }}
//                 >
//                   <Label style={{ color: colors.text.secondary }}>Description</Label>
//                   <RichTextEditor
//                     value={newProduct.description}
//                     onChange={value => setNewProduct(p => ({ ...p, description: value }))}
//                   />
//                 </div>
//                 {/* Specs */}
//                 <div className="space-y-1">
//                   <Label style={{ color: colors.text.secondary }}>Specifications</Label>
//                   <div className="space-y-2 max-h-40 overflow-y-auto">
//                     {newProduct.specs.map((sp, i) => (
//                       <div key={i} className="flex gap-2">
//                         <Input
//                           value={sp[0]}
//                           onChange={e => { const arr = [...newProduct.specs]; arr[i][0] = e.target.value; setNewProduct(p => ({ ...p, specs: arr })); }}
//                           style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
//                         />
//                         <Input
//                           value={sp[1]}
//                           onChange={e => { const arr = [...newProduct.specs]; arr[i][1] = e.target.value; setNewProduct(p => ({ ...p, specs: arr })); }}
//                           style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                   <Button variant="outline" className="w-full" onClick={() => setNewProduct(p => ({ ...p, specs: [...p.specs, ["", ""]] }))} style={{ background: colors.primary.main, color: colors.text.primary }}>
//                     <Plus className="mr-1" /> Add Spec
//                   </Button>
//                 </div>
//                 {/* Actions */}
//                 <div className="flex justify-end gap-2">
//                   <Button variant="outline" onClick={() => setProductDialogOpen(false)} style={{
//                     background: colors.state.error,
//                     borderColor: colors.background.dark,
//                     color: colors.text.primary
//                   }}>
//                     Cancel
//                   </Button>
//                   <Button onClick={handleAddProduct} style={{ background: colors.primary.main }}>Add</Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </>
//       )}
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
import { Plus, ListTree, Wallet, Users, Warehouse, Trash2, Edit, BookCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colors } from "@/lib/colors";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";

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
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const { machines, categories, blogs, addMachine, refresh, refreshCategories, refreshBlog } = useMachines();
  const firstCategoryUrl = categories.length > 0
    ? `/products/category/${categories[0].name.toLowerCase().replace(/\s+/g, "-")}`
    : "/products";

  // Category dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

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

  // Fetch categories & machines once
  useEffect(() => {
    refreshCategories();
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load analytics once if admin
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

  // Category handlers (only for admin)
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

  // Product handlers (only for admin)
  const handleAddProduct = async () => {
    if (!isSignedIn || !isAdmin) return;
    try {
      const { slug, model, image, imagePublicId, description, category, specs, videoUrl } = newProduct;
      if (!slug || !model || !image || !description) throw new Error("All fields required");
      const specsObj = Object.fromEntries(specs);
      await addMachine({
        slug,
        model,
        image,
        imagePublicId,
        description,
        category,
        specs: specsObj,
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

  // Public Dashboard View (for non-authenticated users)
  if (!isSignedIn) {
    return (
      <div className="p-4 sm:p-6 space-y-6 min-h-screen" style={{ background: colors.background.dark }}>
        <Toaster richColors position="top-center" />

        {/* Public Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4 rounded-xl p-4 sm:p-6 shadow-lg" style={{ background: colors.background.main }}>
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: colors.gradients.primary }}>
              Public Dashboard
            </h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link href="/sign-in">
                <Button style={{ background: colors.primary.main }}>
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
                  Sign Up
                </Button>
              </Link>
            </div>
          </motion.header>

          {/* Public Stats */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Total Products" value={machines.length} icon={<Warehouse style={{ color: colors.icons.primary }} />} />
            <StatCard title="Categories" value={categories.length} icon={<ListTree style={{ color: colors.icons.quadra }} />} />
            <StatCard title="Blogs" value={blogs.length} icon={<BookCheck style={{ color: colors.icons.secondary }} />} />
            <StatCard title="Public Access" value={1} icon={<Users style={{ color: colors.state.success }} />} />
          </div>

          {/* Public Information */}
          <div className="text-center p-6 rounded-lg" style={{ background: colors.background.light }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>
              Welcome to Our Platform
            </h2>
            <p className="mb-4" style={{ color: colors.text.secondary }}>
              Explore our products, videos, and resources. Sign in to access blog content and personalized features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={firstCategoryUrl}>
                <Button style={{ background: colors.primary.main }}>
                  Browse Products
                </Button>
              </Link>
              <Link href="/videos">
                <Button variant="outline" style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
                  Watch Videos
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated Dashboard View
  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen" style={{ background: colors.background.dark }}>
      <Toaster richColors position="top-center" />

      {/* Header & Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gap-4 rounded-xl p-4 sm:p-6 shadow-lg" style={{ background: colors.background.main }}>
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: colors.gradients.primary }}>
            {isAdmin ? "Admin" : "User"} Dashboard
          </h1>
          {isAdmin && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={() => setProductDialogOpen(true)} style={{ background: colors.gradients.primary }}>
                <Plus className="mr-1" /> Add Product
              </Button>
              <Button variant="outline" onClick={() => setCategoryDialogOpen(true)} style={{ borderColor: colors.primary.main, color: colors.primary.main }}>
                <Plus className="mr-1" /> Manage Categories
              </Button>
            </div>
          )}
        </motion.header>

        {/* Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Products" value={machines.length} icon={<Warehouse style={{ color: colors.primary.main }} />} />
          <StatCard title="Categories" value={categories.length} icon={<ListTree style={{ color: colors.icons.quadra }} />} />
          <StatCard title="Blogs" value={blogs.length} icon={<BookCheck style={{ color: colors.icons.secondary }} />} />
        </div>
      </motion.div>

      {/* Admin-only dialogs */}
      {isAdmin && (
        <>
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
                {/* Specs */}
                <div className="space-y-1">
                  <Label style={{ color: colors.text.secondary }}>Specifications</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newProduct.specs.map((sp, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={sp[0]}
                          onChange={e => { const arr = [...newProduct.specs]; arr[i][0] = e.target.value; setNewProduct(p => ({ ...p, specs: arr })); }}
                          style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
                        />
                        <Input
                          value={sp[1]}
                          onChange={e => { const arr = [...newProduct.specs]; arr[i][1] = e.target.value; setNewProduct(p => ({ ...p, specs: arr })); }}
                          style={{ backgroundColor: colors.background.light, borderColor: colors.background.light, color: colors.text.primary }}
                        />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setNewProduct(p => ({ ...p, specs: [...p.specs, ["", ""]] }))} style={{ background: colors.primary.main, color: colors.text.primary }}>
                    <Plus className="mr-1" /> Add Spec
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
        </>
      )}
    </div>
  );
}