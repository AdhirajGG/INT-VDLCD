// // app/api/upload/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import { isAdmin } from "@/lib/clerkAdmin";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req: NextRequest) {
//   try {
//     // Check if user is admin
//     if (!(await isAdmin())) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const formData = await req.formData();
//     const file = formData.get("file") as File;
    
//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     // Convert file to base64
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(base64, {
//       folder: "machines", // Optional: organize in folders
//       resource_type: "auto",
//     });

//     return NextResponse.json({
//       url: result.secure_url,
//       publicId: result.public_id,
//     });
//   } catch (error: any) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: "Failed to upload image" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE endpoint to remove images from Cloudinary
// export async function DELETE(req: NextRequest) {
//   try {
//     if (!(await isAdmin())) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { publicId } = await req.json();
    
//     if (!publicId) {
//       return NextResponse.json({ error: "No public ID provided" }, { status: 400 });
//     }

//     await cloudinary.uploader.destroy(publicId);
    
//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Delete error:", error);
//     return NextResponse.json(
//       { error: "Failed to delete image" },
//       { status: 500 }
//     );
//   }
// }

// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "@/lib/clerkAdmin";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large (max 10MB)" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "machines", // Optional: organize in folders
      resource_type: "auto",
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove images from Cloudinary
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { publicId } = await req.json();
    
    if (!publicId) {
      return NextResponse.json({ error: "No public ID provided" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'not found') {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}