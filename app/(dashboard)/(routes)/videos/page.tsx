// // app/(dashboard)/(routes)/videos/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChevronDown, ChevronUp, Play } from "lucide-react";
// import { colors } from "@/lib/colors";
// import { Machine } from "@/components/machine";

// // Helper: extract a valid 11-character YouTube ID from a URL
// const getYouTubeId = (url: string): string | null => {
//   const regExp =
//     /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//   const match = url.match(regExp);
//   return match && match[2].length === 11 ? match[2] : null;
// };

// interface VideoItem {
//   id: string;        // example: machine.slug
//   title: string;     // example: machine.model
//   youtubeId: string; // extracted via getYouTubeId()
//   category: string;  // example: machine.category
// }

// interface CategoryGroup {
//   id: number;          // unique integer (we’ll use index+1)
//   name: string;        // category name
//   videos: VideoItem[]; // all videos in this category
// }

// export default function VideosPage() {
  
//   // 1. List of categories + their videos:
//   const [categories, setCategories] = useState<CategoryGroup[]>([]);

//   // 2. Which video (if any) is currently “in the modal”?
//   const [selectedVideo, setSelectedVideo] = useState<{
//     youtubeId: string;
//     title: string;
//   } | null>(null);

//   // 3. Which category ID is currently open? (null = none)
//   const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

//   // Toggle logic: clicking the same ID twice closes it; clicking a different ID opens that one
//   const toggleCategory = (id: number) => {
//     setOpenCategoryId((prev) => (prev === id ? null : id));
//   };

//   // Fetch machines → filter those with a videoUrl → group by category → build `categories` array
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const { data: machines } = await axios.get<Machine[]>("/api/machines");

//         // Keep only machines that actually have a non-empty videoUrl
//         const machinesWithVideos = machines.filter(
//           (m) => m.videoUrl && m.videoUrl.trim() !== ""
//         );

//         // Group them by `m.category`
//         const grouped: Record<string, Machine[]> = {};
//         machinesWithVideos.forEach((m) => {
//           if (!grouped[m.category]) grouped[m.category] = [];
//           grouped[m.category].push(m);
//         });

//         // Convert to an array of CategoryGroup objects
//         const result: CategoryGroup[] = Object.keys(grouped).map(
//           (categoryName, index) => ({
//             id: index + 1, // unique integer
//             name: categoryName,
//             videos: grouped[categoryName].map((machine) => ({
//               id: machine.slug,
//               title: machine.model,
//               youtubeId: getYouTubeId(machine.videoUrl!)!,
//               category: machine.category,
//             })),
//           })
//         );

//         setCategories(result);
//       } catch (error) {
//         console.error("Failed to fetch videos", error);
//       }
//     };

//     fetchVideos();
//   }, []);

//   return (
//     <div
//       className="p-6 min-h-screen"
//       style={{ background: colors.background.dark }}
//     >
//       <h1
//         className="text-3xl font-bold mb-8 text-center"
//         style={{ color: colors.primary.light }}
//       >
//         Product Videos
//       </h1>

//       {/*
//         If still loading categories, show a loading state.
//       */}
//       {categories.length === 0 ? (
//         <div className="text-center py-12">
//           <p style={{ color: colors.text.secondary }}>Loading videos…</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {categories.map((category) => {
//             // Only this one category is open if its ID matches openCategoryId
//             const isOpen = openCategoryId === category.id;

//             return (
//               <motion.div
//                 key={category.id}
//                 whileHover={{ y: -5 }}
//                 /* ← Notice: we removed `className="h-full"` here */
//               >
//                 <Card
//                   className="border rounded-xl overflow-hidden"
//                   style={{
//                     backgroundColor: colors.background.light,
//                     borderColor: colors.primary.dark,
//                   }}
//                 >
//                   <CardHeader>
//                     <CardTitle className="flex justify-between items-center">
//                       <span style={{ color: colors.text.primary }}>
//                         {category.name}
//                       </span>
//                       <button
//                         onClick={() => toggleCategory(category.id)}
//                         className="p-2 rounded-full"
//                         style={{ backgroundColor: colors.primary.dark }}
//                       >
//                         {isOpen ? (
//                           <ChevronUp className="h-5 w-5" />
//                         ) : (
//                           <ChevronDown className="h-5 w-5" />
//                         )}
//                       </button>
//                     </CardTitle>
//                   </CardHeader>

//                   {/*
//                     ONLY render <CardContent> when this category is open.
//                     Closed categories have no <CardContent> at all, so they collapse to just the header.
//                   */}
//                   {isOpen && (
//                     <CardContent>
//                       <div className="space-y-3">
//                         {category.videos.map((video) => (
//                           <div
//                             key={video.id}
//                             className="flex flex-col p-3 rounded-lg cursor-pointer transition-colors hover:bg-indigo-900/30"
//                             onClick={() =>
//                               setSelectedVideo({
//                                 youtubeId: video.youtubeId,
//                                 title: video.title,
//                               })
//                             }
//                             style={{ color: colors.text.secondary }}
//                           >
//                             <div className="flex items-center">
//                               <div
//                                 className="mr-3 p-2 rounded-full"
//                                 style={{ backgroundColor: colors.primary.dark }}
//                               >
//                                 <Play className="h-4 w-4" />
//                               </div>
//                               <span>{video.title}</span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   )}
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {/*
//         Video modal: only shown when selectedVideo !== null
//       */}
//       {selectedVideo && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
//             <button
//               className="float-right text-white bg-black rounded-full p-1 mb-2"
//               onClick={() => setSelectedVideo(null)}
//             >
//               &times;
//             </button>
//             <h3 className="text-lg font-semibold mb-2 text-black">
//               {selectedVideo.title}
//             </h3>
//             <div className="aspect-w-16 aspect-h-9">
//               <iframe
//                 src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 className="w-full h-96"
//               ></iframe>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// app/(dashboard)/(routes)/videos/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Play, Video, Loader2 } from "lucide-react";
import { colors } from "@/lib/colors";
import { Machine } from "@/components/machine";

// Helper: extract a valid 11-character YouTube ID from a URL
const getYouTubeId = (url: string): string | null => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

interface VideoItem {
  id: string;        // example: machine.slug
  title: string;     // example: machine.model
  youtubeId: string; // extracted via getYouTubeId()
  category: string;  // example: machine.category
}

interface CategoryGroup {
  id: number;          // unique integer (we'll use index+1)
  name: string;        // category name
  videos: VideoItem[]; // all videos in this category
}

export default function VideosPage() {
  
  // 1. List of categories + their videos:
  const [categories, setCategories] = useState<CategoryGroup[]>([]);

  // 2. Which video (if any) is currently "in the modal"?
  const [selectedVideo, setSelectedVideo] = useState<{
    youtubeId: string;
    title: string;
  } | null>(null);

  // 3. Which category ID is currently open? (null = none)
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

  // 4. Loading state
  const [isLoading, setIsLoading] = useState(true);

  // 5. Error state
  const [error, setError] = useState<string | null>(null);

  // Toggle logic: clicking the same ID twice closes it; clicking a different ID opens that one
  const toggleCategory = (id: number) => {
    setOpenCategoryId((prev) => (prev === id ? null : id));
  };

  // Fetch machines → filter those with a videoUrl → group by category → build `categories` array
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data: machines } = await axios.get<Machine[]>("/api/machines");

        // Keep only machines that actually have a non-empty videoUrl
        const machinesWithVideos = machines.filter(
          (m) => m.videoUrl && m.videoUrl.trim() !== ""
        );

        // Group them by `m.category`
        const grouped: Record<string, Machine[]> = {};
        machinesWithVideos.forEach((m) => {
          if (!grouped[m.category]) grouped[m.category] = [];
          grouped[m.category].push(m);
        });

        // Convert to an array of CategoryGroup objects
        const result: CategoryGroup[] = Object.keys(grouped).map(
          (categoryName, index) => ({
            id: index + 1, // unique integer
            name: categoryName,
            videos: grouped[categoryName].map((machine) => ({
              id: machine.slug,
              title: machine.model,
              youtubeId: getYouTubeId(machine.videoUrl!)!,
              category: machine.category,
            })),
          })
        );

        setCategories(result);
      } catch (error) {
        console.error("Failed to fetch videos", error);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card
          key={index}
          className="border rounded-xl overflow-hidden animate-pulse"
          style={{
            backgroundColor: colors.background.light,
            borderColor: colors.primary.dark,
          }}
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div 
                className="h-6 w-32 rounded"
                style={{ backgroundColor: colors.primary.dark + "30" }}
              />
              <div 
                className="h-9 w-9 rounded-full"
                style={{ backgroundColor: colors.primary.dark + "30" }}
              />
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  // No videos available component
  const NoVideosAvailable = () => (
    <div className="text-center py-16">
      <div className="flex flex-col items-center space-y-4">
        <div 
          className="p-4 rounded-full"
          style={{ backgroundColor: colors.primary.dark + "20" }}
        >
          <Video 
            className="h-12 w-12" 
            style={{ color: colors.primary.light }}
          />
        </div>
        <h3 
          className="text-xl font-semibold"
          style={{ color: colors.text.primary }}
        >
          No Videos Available
        </h3>
        <p 
          className="text-sm max-w-md"
          style={{ color: colors.text.secondary }}
        >
          There are currently no product videos available. Check back later for new content.
        </p>
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
          <Video 
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
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-80"
          style={{ 
            backgroundColor: colors.primary.dark,
            color: colors.text.primary 
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="p-6 min-h-screen"
      style={{ background: colors.background.dark }}
    >
      <h1
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: colors.primary.light }}
      >
        Product Videos
      </h1>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-6">
          <div className="flex justify-center items-center py-8">
            <Loader2 
              className="h-8 w-8 animate-spin mr-3" 
              style={{ color: colors.primary.light }}
            />
            <span style={{ color: colors.text.secondary }}>
              Loading videos...
            </span>
          </div>
          <LoadingSkeleton />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && <ErrorMessage />}

      {/* No videos available */}
      {!isLoading && !error && categories.length === 0 && <NoVideosAvailable />}

      {/* Videos content */}
      {!isLoading && !error && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            // Only this one category is open if its ID matches openCategoryId
            const isOpen = openCategoryId === category.id;

            return (
              <motion.div
                key={category.id}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="border rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: colors.background.light,
                    borderColor: colors.primary.dark,
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span style={{ color: colors.text.primary }}>
                        {category.name}
                      </span>
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-2 rounded-full transition-colors hover:opacity-80"
                        style={{ backgroundColor: colors.primary.dark }}
                      >
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </CardTitle>
                  </CardHeader>

                  {/*
                    ONLY render <CardContent> when this category is open.
                    Closed categories have no <CardContent> at all, so they collapse to just the header.
                  */}
                  {isOpen && (
                    <CardContent>
                      <div className="space-y-3">
                        {category.videos.map((video) => (
                          <motion.div
                            key={video.id}
                            className="flex flex-col p-3 rounded-lg cursor-pointer transition-colors hover:bg-indigo-900/30"
                            onClick={() =>
                              setSelectedVideo({
                                youtubeId: video.youtubeId,
                                title: video.title,
                              })
                            }
                            style={{ color: colors.text.secondary }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center">
                              <div
                                className="mr-3 p-2 rounded-full"
                                style={{ backgroundColor: colors.primary.dark }}
                              >
                                <Play className="h-4 w-4" />
                              </div>
                              <span>{video.title}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/*
        Video modal: only shown when selectedVideo !== null
      */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
            <button
              className="float-right text-white bg-black rounded-full p-1 mb-2"
              onClick={() => setSelectedVideo(null)}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2 text-black">
              {selectedVideo.title}
            </h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-96"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}