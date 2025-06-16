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

// Dynamically import Google Maps to avoid SSR issues
const GoogleMap = dynamic(() => import("@/components/GoogleMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
      Loading Map...
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
        toast.success("Message sent successfully! We'll contact you shortly");
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
    <div className="container mx-auto px-4 py-16">
      <Toaster richColors position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
            <div className="h-96 rounded-xl overflow-hidden shadow-lg border border-gray-300">
              <GoogleMap center={companyLocation} />
            </div>
            
            <div className="mt-6 space-y-3 text-gray-700">
              <p className="flex items-start">
                <span className="font-medium w-24">Address:</span>
                <span>B 35/6, GT Karnal Industrial area, Delhi-110033</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-24">Phone:</span>
                <span>+91 8527973777</span>
              </p>
              <p className="flex items-center">
                <span className="font-medium w-24">Hours:</span>
                <span>Mon-Sat: 9:00 AM - 6:00 PM</span>
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  pattern="[A-Za-z\s]+"
                  title="Name must contain only letters"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={phone}
                  onChange={setPhone}
                  required
                  className="mt-1 border rounded-md p-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="mt-1"
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}