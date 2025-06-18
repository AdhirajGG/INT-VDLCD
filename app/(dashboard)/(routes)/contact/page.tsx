// // app/contact/page.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { toast, Toaster } from "sonner";
// import dynamic from "next/dynamic";
// import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import { MapPin, Phone, Clock, Send, Mail } from "lucide-react";

// // Dynamically import Google Maps to avoid SSR issues
// const GoogleMap = dynamic(() => import("@/components/GoogleMap"), {
//   ssr: false,
//   loading: () => (
//     <div className="bg-slate-800/50 w-full h-full flex items-center justify-center rounded-xl border border-slate-700/50">
//       <div className="text-slate-400 animate-pulse">Loading Map...</div>
//     </div>
//   ),
// });

// export default function ContactPage() {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState<string | undefined>("");
//   const [message, setMessage] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const companyLocation = {
//     lat: 28.6932820,
//     lng: 77.1856029,
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Client-side validation
//     if (!name || !phone || !message) {
//       toast.error("Please fill in all required fields");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!/^[A-Za-z\s]+$/.test(name)) {
//       toast.error("Name must contain only letters and spaces");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!phone || !isValidPhoneNumber(phone)) {
//       toast.error("Please enter a valid phone number");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const response = await fetch("/api/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, phone, message }),
//       });

//       if (response.ok) {
//         // Reset form on success
//         setName("");
//         setPhone("");
//         setMessage("");
//         toast.success("Message sent successfully! We'll get back to you within 24 hours.");
//       } else {
//         const errorData = await response.json();
//         const errorMessage = errorData.error || "Failed to send message";
        
//         if (errorMessage.includes("phone")) {
//           toast.error("Phone error: " + errorMessage);
//         } else if (errorMessage.includes("Name")) {
//           toast.error("Name error: " + errorMessage);
//         } else {
//           toast.error(errorMessage);
//         }
//       }
//     } catch (error) {
//       toast.error("Network error. Please check your connection and try again");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//       <        Toaster 
//         richColors 
//         position="top-right" 
//         className="custom-toaster"
//       />
      
//       <div className="container mx-auto px-4 py-20">
//         <div className="max-w-6xl mx-auto">
//           {/* Header Section */}
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mb-6">
//               <Mail className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-5xl font-bold text-slate-50 mb-4">
//               Get in Touch
//             </h1>
//             <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
//               Ready to start your next project? We'd love to hear from you. 
//               Send us a message and we'll respond within 24 hours.
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             {/* Contact Information & Map */}
//             <div className="space-y-8">
//               <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
//                 <h2 className="text-2xl font-bold text-slate-50 mb-6 flex items-center">
//                   <MapPin className="w-6 h-6 text-indigo-400 mr-3" />
//                   Our Location
//                 </h2>
                
//                 <div className="h-80 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 mb-6">
//                   <GoogleMap center={companyLocation} />
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
//                     <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-slate-200">Address</p>
//                       <p className="text-slate-400 mt-1">
//                         B 35/6, GT Karnal Industrial Area<br />
//                         Delhi - 110033, India
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
//                     <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-slate-200">Phone</p>
//                       <p className="text-slate-400 mt-1">+91 8527973777</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
//                     <Clock className="w-5 h-5 text-teal-400 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-slate-200">Business Hours</p>
//                       <p className="text-slate-400 mt-1">Monday - Saturday: 9:00 AM - 6:00 PM</p>
//                       <p className="text-slate-500 text-sm">Sunday: Closed</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Contact Form */}
//             <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
//               <h2 className="text-2xl font-bold text-slate-50 mb-6 flex items-center">
//                 <Send className="w-6 h-6 text-indigo-400 mr-3" />
//                 Send Us a Message
//               </h2>
              
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <Label 
//                     htmlFor="name" 
//                     className="text-slate-200 font-medium text-sm mb-2 block"
//                   >
//                     Full Name *
//                   </Label>
//                   <Input
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                     pattern="[A-Za-z\s]+"
//                     title="Name must contain only letters and spaces"
//                     className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 
//                              focus:border-indigo-400 focus:ring-indigo-400/20 h-12 rounded-lg
//                              hover:bg-slate-700/70 transition-colors"
//                     placeholder="Enter your full name"
//                   />
//                 </div>
                
//                 <div>
//                   <Label 
//                     htmlFor="phone" 
//                     className="text-slate-200 font-medium text-sm mb-2 block"
//                   >
//                     Phone Number *
//                   </Label>
//                   <div className="phone-input-container">
//                     <PhoneInput
//                       international
//                       defaultCountry="IN"
//                       value={phone}
//                       onChange={setPhone}
//                       required
//                       className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 
//                                text-slate-100 focus-within:border-indigo-400 focus-within:ring-1 
//                                focus-within:ring-indigo-400/20 hover:bg-slate-700/70 transition-colors"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <Label 
//                     htmlFor="message" 
//                     className="text-slate-200 font-medium text-sm mb-2 block"
//                   >
//                     Message *
//                   </Label>
//                   <Textarea
//                     id="message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     required
//                     rows={6}
//                     className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 
//                              focus:border-indigo-400 focus:ring-indigo-400/20 rounded-lg resize-none
//                              hover:bg-slate-700/70 transition-colors"
//                     placeholder="Tell us about your project or inquiry..."
//                   />
//                 </div>
                
//                 <Button
//                   type="submit"
//                   size="lg"
//                   disabled={isSubmitting}
//                   className="w-full h-12 bg-gradient-to-r from-indigo-500 to-violet-500 
//                            hover:from-indigo-600 hover:to-violet-600 text-white font-medium 
//                            rounded-lg transition-all duration-200 transform hover:scale-[1.02] 
//                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
//                            shadow-lg hover:shadow-xl"
//                 >
//                   {isSubmitting ? (
//                     <div className="flex items-center space-x-2">
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       <span>Sending Message...</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center space-x-2">
//                       <Send className="w-4 h-4" />
//                       <span>Send Message</span>
//                     </div>
//                   )}
//                 </Button>
//               </form>
              
//               <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
//                 <p className="text-slate-300 text-sm text-center">
//                   <span className="font-medium">Response Time:</span> We typically respond within 
//                   <span className="text-teal-400 font-medium"> 2-4 hours</span> during business hours.
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           {/* Additional Contact Options */}
//           <div className="mt-16 text-center">
//             <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
//               <h3 className="text-xl font-semibold text-slate-200 mb-4">
//                 Prefer a different way to reach us?
//               </h3>
//               <p className="text-slate-400 mb-6">
//                 We're available through multiple channels to ensure you can reach us easily.
//               </p>
//               <div className="flex flex-wrap justify-center gap-4">
//                 <a 
//                   href="tel:+918527973777" 
//                   className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-500/20 
//                            text-teal-300 rounded-lg hover:bg-teal-500/30 transition-colors
//                            border border-teal-500/30 hover:border-teal-500/50"
//                 >
//                   <Phone className="w-4 h-4" />
//                   <span>Call Us</span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/contact/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import dynamic from "next/dynamic";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { MapPin, Phone, Clock, Send, Mail } from "lucide-react";

// Dynamically import Google Maps to avoid SSR issues
const GoogleMap = dynamic(() => import("@/components/GoogleMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-800/50 w-full h-full flex items-center justify-center rounded-xl border border-slate-700/50">
      <div className="text-slate-400 animate-pulse">Loading Map...</div>
    </div>
  ),
});

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const companyLocation = {
    lat: 28.6932820,
    lng: 77.1856029,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side validation
    if (!name || !phone || !message) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      toast.error("Name must contain only letters and spaces");
      setIsSubmitting(false);
      return;
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      toast.error("Please enter a valid phone number");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, message }),
      });

      if (response.ok) {
        // Reset form on success
        setName("");
        setPhone("");
        setMessage("");
        toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to send message";
        
        if (errorMessage.includes("phone")) {
          toast.error("Phone error: " + errorMessage);
        } else if (errorMessage.includes("Name")) {
          toast.error("Name error: " + errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      toast.error("Network error. Please check your connection and try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster 
        richColors 
        position="top-right" 
        className="custom-toaster"
      />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-50 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Ready to start your next project? We'd love to hear from you. 
              Send us a message and we'll respond within 24 hours.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information & Map */}
            <div className="space-y-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-slate-50 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 text-indigo-400 mr-3" />
                  Our Location
                </h2>
                
                <div className="h-80 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 mb-6">
                  <GoogleMap center={companyLocation} />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-200">Address</p>
                      <p className="text-slate-400 mt-1">
                        B 35/6, GT Karnal Industrial Area<br />
                        Delhi - 110033, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-200">Phone</p>
                      <p className="text-slate-400 mt-1">+91 8527973777</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <Clock className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-200">Business Hours</p>
                      <p className="text-slate-400 mt-1">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="text-slate-500 text-sm">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-slate-50 mb-6 flex items-center">
                <Send className="w-6 h-6 text-indigo-400 mr-3" />
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label 
                    htmlFor="name" 
                    className="text-slate-200 font-medium text-sm mb-2 block"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    pattern="[A-Za-z\s]+"
                    title="Name must contain only letters and spaces"
                    className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 
                             focus:border-indigo-400 focus:ring-indigo-400/20 h-12 rounded-lg
                             hover:bg-slate-700/70 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label 
                    htmlFor="phone" 
                    className="text-slate-200 font-medium text-sm mb-2 block"
                  >
                    Phone Number *
                  </Label>
                  <div className="phone-input-container bg-slate-700/50 border border-slate-600 rounded-lg p-3 hover:bg-slate-700/70 transition-colors focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400/20">
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={phone}
                      onChange={setPhone}
                      required
                      className="phone-input-custom"
                    />
                  </div>
                </div>
                
                <div>
                  <Label 
                    htmlFor="message" 
                    className="text-slate-200 font-medium text-sm mb-2 block"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 
                             focus:border-indigo-400 focus:ring-indigo-400/20 rounded-lg resize-none
                             hover:bg-slate-700/70 transition-colors"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>
                
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-violet-500 
                           hover:from-indigo-600 hover:to-violet-600 text-white font-medium 
                           rounded-lg transition-all duration-200 transform hover:scale-[1.02] 
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <p className="text-slate-300 text-sm text-center">
                  <span className="font-medium">Response Time:</span> We typically respond within 
                  <span className="text-teal-400 font-medium"> 2-4 hours</span> during business hours.
                </p>
              </div>
            </div>
          </div>
          
          {/* Additional Contact Options */}
          <div className="mt-16 text-center">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
              <h3 className="text-xl font-semibold text-slate-200 mb-4">
                Prefer a different way to reach us?
              </h3>
              <p className="text-slate-400 mb-6">
                We're available through multiple channels to ensure you can reach us easily.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="tel:+918527973777" 
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-500/20 
                           text-teal-300 rounded-lg hover:bg-teal-500/30 transition-colors
                           border border-teal-500/30 hover:border-teal-500/50"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}