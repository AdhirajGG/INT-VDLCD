// components/machine.tsx
import { useState, useEffect } from "react";
import axios from "axios";

export interface Machine {
   slug: string;
  model: string; 
  image: string;
  description: string;
  category: string;
  specs: Record<string, string>;
  videoUrl?: string; //
}

export interface Category {
  name: string;
}
export interface BlogPost {

id: number;

title: string;

slug: string;

image?: string;

content: string;

excerpt?: string;

createdAt: string; // or Date if we convert

}

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const fetchMachines = async (category?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = category 
        ? `/api/machines?category=${encodeURIComponent(category)}`
        : '/api/machines';
      
      const response = await axios.get(url);
      setMachines(response.data);
    } catch (error) {
      console.error("Fetch machines error:", error);
      setError("Failed to fetch machines. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blog');
      setBlogs(response.data);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };  

  const addMachine = async (machineData: any) => {
    setError(null);
    try {
      const response = await axios.post("/api/machines", machineData);
      setMachines(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Add machine error:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to add machine");
      } else {
        setError("Failed to add machine. Please try again.");
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchMachines();
    fetchCategories();
    fetchBlogs();
  }, []);

  return {
    machines,
    categories,
    loading,
    error,
    blogs,
    addMachine,
    refresh: fetchMachines,
    refreshCategories: fetchCategories,
    refreshBlog: fetchBlogs
  };
};