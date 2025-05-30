// // app/(dashboard)/(routes)/videos/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChevronDown, ChevronUp, Play } from "lucide-react";
// import { colors } from "@/lib/colors";
// import { Machine } from "@/components/machine"; // Import Machine type

// // Helper function to extract YouTube ID
// const getYouTubeId = (url: string): string | null => {
//   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//   const match = url.match(regExp);
//   return (match && match[2].length === 11) ? match[2] : null;
// };

// export default function VideosPage() {
//   const [categories, setCategories] = useState<any[]>([]);
//   const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
//   const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         // Fetch all machines
//         const { data: machines } = await axios.get("/api/machines");
        
//         // Filter machines that have videos
//         const machinesWithVideos = machines.filter(
//           (machine: Machine) => machine.videoUrl && machine.videoUrl.trim() !== ""
//         );
        
//         // Group by category
//         const grouped: Record<string, any[]> = {};
        
//         machinesWithVideos.forEach((machine: Machine) => {
//           if (!grouped[machine.category]) {
//             grouped[machine.category] = [];
//           }
//           grouped[machine.category].push({
//             id: machine.slug,
//             title: machine.model,
//             youtubeId: getYouTubeId(machine.videoUrl!),
//             category: machine.category,
//             productName: machine.model
//           });
//         });
        
//         // Convert to array format
//         const result = Object.keys(grouped).map((category, index) => ({
//           id: index + 1,
//           name: category,
//           videos: grouped[category]
//         }));
        
//         setCategories(result);
//       } catch (error) {
//         console.error("Failed to fetch videos", error);
//       }
//     };
    
//     fetchVideos();
//   }, []);

//   return (
//     <div className="p-6 min-h-screen" style={{ background: colors.background.dark }}>
//       <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.primary.light }}>
//         Product Videos
//       </h1>
      
//       {categories.length === 0 ? (
//         <div className="text-center py-12">
//           <p style={{ color: colors.text.secondary }}>Loading videos...</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {categories.map(category => (
//             <motion.div
//               key={category.id}
//               whileHover={{ y: -5 }}
//               className="h-full"
//             >
//               <Card 
//                 className="h-full border rounded-xl overflow-hidden"
//                 style={{ 
//                   backgroundColor: colors.background.light,
//                   borderColor: colors.primary.dark
//                 }}
//               >
//                 <CardHeader>
//                   <CardTitle className="flex justify-between items-center">
//                     <span style={{ color: colors.text.primary }}>{category.name}</span>
//                     <button 
//                       onClick={() => setExpandedCategory(
//                         expandedCategory === category.name ? null : category.name
//                       )}
//                       className="p-2 rounded-full"
//                       style={{ backgroundColor: colors.primary.dark }}
//                     >
//                       {expandedCategory === category.name ? 
//                         <ChevronUp className="h-5 w-5" /> : 
//                         <ChevronDown className="h-5 w-5" />
//                       }
//                     </button>
//                   </CardTitle>
//                 </CardHeader>
                
//                 <CardContent>
//                   {expandedCategory === category.name && (
//                     <div className="space-y-3">
//                       {category.videos.map((video: any) => (
//                         <div
//                           key={video.id}
//                           className="flex flex-col p-3 rounded-lg cursor-pointer transition-colors hover:bg-indigo-900/30"
//                           onClick={() => setSelectedVideo(video)}
//                           style={{ color: colors.text.secondary }}
//                         >
//                           <div className="flex items-center">
//                             <div className="mr-3 p-2 rounded-full" style={{ backgroundColor: colors.primary.dark }}>
//                               <Play className="h-4 w-4" />
//                             </div>
//                             <span>{video.title}</span>
//                           </div>
//                           <div className="text-xs mt-1 pl-8" style={{ color: colors.text.tertiary }}>
//                             Product: {video.productName}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {selectedVideo && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
//             <button
//               className="float-right text-white bg-black rounded-full p-1"
//               onClick={() => setSelectedVideo(null)}
//             >
//               &times;
//             </button>
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
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { colors } from "@/lib/colors";
import { Machine } from "@/components/machine"; // Import Machine type

// Helper function to extract YouTube ID
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function VideosPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{youtubeId: string, title: string} | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetch all machines that have video URLs
        const { data: machines } = await axios.get<Machine[]>("/api/machines");
        
        // Filter machines with video URLs
        const machinesWithVideos = machines.filter(machine => 
          machine.videoUrl && machine.videoUrl.trim() !== ""
        );
        
        // Group by category
        const grouped: Record<string, Machine[]> = {};
        
        machinesWithVideos.forEach(machine => {
          if (!grouped[machine.category]) {
            grouped[machine.category] = [];
          }
          grouped[machine.category].push(machine);
        });
        
        // Convert to categories array
        const result = Object.keys(grouped).map((category, index) => ({
          id: index + 1,
          name: category,
          videos: grouped[category].map(machine => ({
            id: machine.slug,
            title: machine.model,
            youtubeId: getYouTubeId(machine.videoUrl!),
            category: machine.category
          }))
        }));
        
        setCategories(result);
      } catch (error) {
        console.error("Failed to fetch videos", error);
      }
    };
    
    fetchVideos();
  }, []);

  return (
    <div className="p-6 min-h-screen" style={{ background: colors.background.dark }}>
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.primary.light }}>
        Product Videos
      </h1>
      
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: colors.text.secondary }}>Loading videos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <motion.div
              key={category.id}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card 
                className="h-full border rounded-xl overflow-hidden"
                style={{ 
                  backgroundColor: colors.background.light,
                  borderColor: colors.primary.dark
                }}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span style={{ color: colors.text.primary }}>{category.name}</span>
                    <button 
                      onClick={() => setExpandedCategory(
                        expandedCategory === category.name ? null : category.name
                      )}
                      className="p-2 rounded-full"
                      style={{ backgroundColor: colors.primary.dark }}
                    >
                      {expandedCategory === category.name ? 
                        <ChevronUp className="h-5 w-5" /> : 
                        <ChevronDown className="h-5 w-5" />
                      }
                    </button>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {expandedCategory === category.name && (
                    <div className="space-y-3">
                      {category.videos.map((video: any) => (
                        <div
                          key={video.id}
                          className="flex flex-col p-3 rounded-lg cursor-pointer transition-colors hover:bg-indigo-900/30"
                          onClick={() => setSelectedVideo({
                            youtubeId: video.youtubeId,
                            title: video.title
                          })}
                          style={{ color: colors.text.secondary }}
                        >
                          <div className="flex items-center">
                            <div className="mr-3 p-2 rounded-full" style={{ backgroundColor: colors.primary.dark }}>
                              <Play className="h-4 w-4" />
                            </div>
                            <span>{video.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
            <button
              className="float-right text-white bg-black rounded-full p-1 mb-2"
              onClick={() => setSelectedVideo(null)}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2 text-black">{selectedVideo.title}</h3>
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