// // app/api/blog/[slug]/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { isAdmin } from "@/lib/clerkAdmin";

// const prisma = new PrismaClient();

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Record<string, string | string[]> }
// ) {
//   const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
//   try {
//     const slugParam = Array.isArray(params.slug) ? params.slug[0] : params.slug;
//     const post = await prisma.blogPost.findUnique({
//       where: { slug: slugParam }
//     });

//     if (!post) {
//       return NextResponse.json(
//         { error: "Post not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(post);
//   } catch (error) {
//     console.error("Blog fetch error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch blog post" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Record<string, string | string[]> }
// ) {
//   try {
//     if (!(await isAdmin())) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { title, slug, image, imagePublicId, content, excerpt } = await req.json();

//     // If slug is being changed, check if new slug already exists
//     if (slug !== params.slug) {
//       const existingPost = await prisma.blogPost.findUnique({
//         where: { slug }
//       });

//       if (existingPost) {
//         return NextResponse.json(
//           { error: "A post with this slug already exists" },
//           { status: 400 }
//         );
//       }
//     }

//     const slugParam = Array.isArray(params.slug) ? params.slug[0] : params.slug;

//     const updatedPost = await prisma.blogPost.update({
//       where: { slug: slugParam },
//       data: {
//         title,
//         slug,
//         image: image || null,
//         imagePublicId: imagePublicId || null,
//         content,
//         excerpt: excerpt || null,
//         updatedAt: new Date(),
//       }
//     });

//     return NextResponse.json(updatedPost);
//   } catch (error: any) {
//     console.error("Blog update error:", error);
//     return NextResponse.json(
//       { error: "Failed to update blog post" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Record<string, string | string[]> }
// ) {
//   try {
//     if (!(await isAdmin())) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const slugParam = Array.isArray(params.slug) ? params.slug[0] : params.slug;

//     await prisma.blogPost.delete({
//       where: { slug: slugParam }
//     });

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Blog deletion error:", error);
//     return NextResponse.json(
//       { error: "Failed to delete blog post" },
//       { status: 500 }
//     );
//   }
// }

// app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { isAdmin } from "@/lib/clerkAdmin";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug: paramSlug } = await params;
    const { title, slug, image, imagePublicId, content, excerpt } = await req.json();

    // If slug is being changed, check if new slug already exists
    if (slug !== paramSlug) {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug }
      });

      if (existingPost) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { slug: paramSlug },
      data: {
        title,
        slug,
        image: image || null,
        imagePublicId: imagePublicId || null,
        content,
        excerpt: excerpt || null,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error("Blog update error:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    await prisma.blogPost.delete({
      where: { slug }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Blog deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}