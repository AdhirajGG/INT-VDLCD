// // app/dashboard/(routes)/products/category/[category]/page.tsx
// "use client";

// import { useEffect, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useMachines } from "@/components/machine";

// import { motion } from "framer-motion";
// import { colors } from "@/lib/colors";

// export default function CategoryProductsPage() {
//   const router = useRouter();
//   const { category } = useParams<{ category: string }>();
//   const { machines, loading, error, refresh } = useMachines();

//   useEffect(() => { refresh(); }, []);

//   const normalizedCategory = useMemo(() => {
//     if (!category) return "";
//     return decodeURIComponent(category).replace(/-/g, " ").trim().toLowerCase();
//   }, [category]);

//   const filtered = useMemo(
//     () => machines.filter(m => m.category.toLowerCase() === normalizedCategory),
//     [machines, normalizedCategory]
//   );



//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen" style={{ backgroundColor: colors.background.light }}>
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity }}
//           className="rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"
//         />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center" style={{ color: colors.state.error }}>{error}</div>;
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className=" shadow-2xl max-w-screen mx-auto min-h-screen p-4 sm:p-6 space-y-6"
//       style={{ background: colors.background.dark }}
//     >
//       {/* <div className="   p-4 sm:p-6 space-y-6 min-h-screen"
//         style={{ background: colors.background.main }}
//       > */}
//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-3xl font-bold mb-8 text-center"
//           style={{
//             color: colors.text.primary,

//           }}
//         >
//           {normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1)} Equipment
//         </motion.h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
//           {filtered.map((product) => (
//             <motion.div key={product.slug}
//             whileHover={{ y: -5 }}
//             >
//               <Card
//                 className="rounded-xl p-6 border transition-colors"
//                 style={{
//                   backgroundColor: colors.background.light,
//                   borderColor: `${colors.background.light}80`
//                 }}
//               >
//                 <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden"
//                   style={{
//                     background: `${colors.secondary.main}30`,
//                     borderColor: `${colors.background.light}80`
//                   }}
//                 >
//                   <Image
//                     src={product.image}
//                     alt={product.model}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="flex-1"
//                 >
//                   <h2 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
//                     {product.model}
//                   </h2>
//                 </div>
//                 <div className="flex flex-col space-y-2 mt-auto">
//                   <Button
//                     variant="outline"
//                     className="w-full"
//                     style={{
//                       backgroundColor: colors.background.light,
//                       borderColor: colors.primary.dark,
//                       color: colors.text.primary
//                     }}
//                     onClick={() =>
//                       router.push(`/products/item/${product.slug}`)
//                     }
//                   >
//                     View Details
//                   </Button>
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       {/* </div> */}
//     </motion.div>
//   );
// }

// app/dashboard/(routes)/products/category/[category]/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMachines } from "@/components/machine";
import { Package, Loader2 } from "lucide-react";

import { motion } from "framer-motion";
import { colors } from "@/lib/colors";

export default function CategoryProductsPage() {
  const router = useRouter();
  const { category } = useParams<{ category: string }>();
  const { machines, loading, error, refresh } = useMachines();

  useEffect(() => { refresh(); }, []);

  const normalizedCategory = useMemo(() => {
    if (!category) return "";
    return decodeURIComponent(category).replace(/-/g, " ").trim().toLowerCase();
  }, [category]);

  const filtered = useMemo(
    () => machines.filter(m => m.category.toLowerCase() === normalizedCategory),
    [machines, normalizedCategory]
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <Card
          key={index}
          className="rounded-xl p-6 border animate-pulse"
          style={{
            backgroundColor: colors.background.light,
            borderColor: `${colors.background.light}80`
          }}
        >
          <div 
            className="h-48 w-full mb-4 rounded-lg"
            style={{ backgroundColor: colors.primary.dark + "30" }}
          />
          <div 
            className="h-6 w-3/4 mb-2 rounded"
            style={{ backgroundColor: colors.primary.dark + "30" }}
          />
          <div 
            className="h-10 w-full rounded"
            style={{ backgroundColor: colors.primary.dark + "30" }}
          />
        </Card>
      ))}
    </div>
  );

  // No products available component
  const NoProductsAvailable = () => (
    <div className="text-center py-16">
      <div className="flex flex-col items-center space-y-4">
        <div 
          className="p-4 rounded-full"
          style={{ backgroundColor: colors.primary.dark + "20" }}
        >
          <Package 
            className="h-12 w-12" 
            style={{ color: colors.primary.light }}
          />
        </div>
        <h3 
          className="text-xl font-semibold"
          style={{ color: colors.text.primary }}
        >
          No Products Available
        </h3>
        <p 
          className="text-sm max-w-md"
          style={{ color: colors.text.secondary }}
        >
          There are currently no products available in the "{normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1)}" category.
        </p>
        {/* <Button
          onClick={() => router.push('/products')}
          className="mt-4"
          style={{ 
            backgroundColor: colors.primary.dark,
            color: colors.text.primary 
          }}
        >
          Browse All Products
        </Button> */}
      </div>
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="text-center py-16">
      <div className="flex flex-col items-center space-y-4">
        <div 
          className="p-4 rounded-full"
          style={{ backgroundColor: "#ef4444" + "20" }}
        >
          <Package 
            className="h-12 w-12" 
            style={{ color: "#ef4444" }}
          />
        </div>
        <h3 
          className="text-xl font-semibold"
          style={{ color: colors.text.primary }}
        >
          Something went wrong
        </h3>
        <p 
          className="text-sm max-w-md"
          style={{ color: colors.text.secondary }}
        >
          {error}
        </p>
        <Button
          onClick={() => refresh()}
          className="mt-4"
          style={{ 
            backgroundColor: colors.primary.dark,
            color: colors.text.primary 
          }}
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="shadow-2xl max-w-screen mx-auto min-h-screen p-4 sm:p-6 space-y-6"
        style={{ background: colors.background.dark }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: colors.text.primary }}
        >
          {normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1)} Equipment
        </motion.h1>

        <div className="flex justify-center items-center py-8">
          <Loader2 
            className="h-8 w-8 animate-spin mr-3" 
            style={{ color: colors.primary.light }}
          />
          <span style={{ color: colors.text.secondary }}>
            Loading products...
          </span>
        </div>

        <LoadingSkeleton />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="shadow-2xl max-w-screen mx-auto min-h-screen p-4 sm:p-6 space-y-6"
        style={{ background: colors.background.dark }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: colors.text.primary }}
        >
          {normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1)} Equipment
        </motion.h1>

        <ErrorMessage />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="shadow-2xl max-w-screen mx-auto min-h-screen p-4 sm:p-6 space-y-6"
      style={{ background: colors.background.dark }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: colors.text.primary }}
      >
        {normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1)} Equipment
      </motion.h1>

      {/* Show no products message if filtered array is empty */}
      {filtered.length === 0 ? (
        <NoProductsAvailable />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, index) => (
            <motion.div 
              key={product.slug}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className="rounded-xl p-6 border transition-colors"
                style={{
                  backgroundColor: colors.background.light,
                  borderColor: `${colors.background.light}80`
                }}
              >
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden"
                  style={{
                    background: `${colors.secondary.main}30`,
                    borderColor: `${colors.background.light}80`
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.model}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
                    {product.model}
                  </h2>
                </div>
                <div className="flex flex-col space-y-2 mt-auto">
                  <Button
                    variant="outline"
                    className="w-full transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: colors.background.light,
                      borderColor: colors.primary.dark,
                      color: colors.text.primary
                    }}
                    onClick={() =>
                      router.push(`/products/item/${product.slug}`)
                    }
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}