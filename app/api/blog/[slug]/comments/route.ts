// // app/api/blog/[slug]/comments/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { clerkClient } from "@clerk/clerk-sdk-node";
// import { prisma } from "@/lib/prisma";

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const { userId } = await auth();
    
//     if (!userId) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }

//     const { slug } = params;
//     const { content } = await request.json();

//     if (!content?.trim()) {
//       return NextResponse.json(
//         { error: "Comment content is required" },
//         { status: 400 }
//       );
//     }

//     // Get the post
//     const post = await prisma.blogPost.findUnique({
//       where: { slug }
//     });

//     if (!post) {
//       return NextResponse.json(
//         { error: "Post not found" },
//         { status: 404 }
//       );
//     }

//     // Get user details from Clerk to ensure we have the correct email
//     const clerkUser = await clerkClient.users.getUser(userId);
//     const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

//     if (!userEmail) {
//       return NextResponse.json(
//         { error: "User email not found" },
//         { status: 400 }
//       );
//     }

//     // Find or create user in database
//     const user = await prisma.user.upsert({
//       where: { id: userId },
//       update: { 
//         email: userEmail // Update email in case it changed
//       },
//       create: {
//   id: userId,
//   email: userEmail,
//   clerkId: userId
// }
//     });

//     // Create the comment
//     const comment = await prisma.comment.create({
//       data: {
//         content: content.trim(),
//         authorId: user.id,
//         postId: post.id,
//         isApproved: false // Comments need approval
//       },
//       include: {
//         author: {
//           select: {
//             id: true,
//             email: true
//           }
//         },
//         post: {
//           select: {
//             id: true,
//             title: true,
//             slug: true
//           }
//         }
//       }
//     });

//     return NextResponse.json(comment, { status: 201 });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     return NextResponse.json(
//       { error: "Failed to create comment" },
//       { status: 500 }
//     );
//   }
// }

// // GET route for fetching approved comments (for public display)
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const { slug } = params;

//     // Get approved comments
//     const comments = await prisma.comment.findMany({
//       where: {
//         post: { slug },
//         isApproved: true
//       },
//       include: {
//         author: {
//           select: {
//             id: true,
//             email: true
//           }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     // Fetch user details from Clerk for each comment
//     const commentsWithUserDetails = await Promise.all(
//       comments.map(async (comment) => {
//         try {
//           const clerkUser = await clerkClient.users.getUser(comment.author.id);
//           return {
//             ...comment,
//             author: {
//               id: comment.author.id,
//               email: clerkUser.emailAddresses[0]?.emailAddress || comment.author.email,
//               name: clerkUser.firstName && clerkUser.lastName 
//                 ? `${clerkUser.firstName} ${clerkUser.lastName}`
//                 : clerkUser.firstName || clerkUser.lastName || clerkUser.username || comment.author.email.split('@')[0],
//               imageUrl: clerkUser.imageUrl,
//               username: clerkUser.username || comment.author.email.split('@')[0]
//             }
//           };
//         } catch (error) {
//           console.error(`Error fetching user details for ${comment.author.id}:`, error);
//           // Fallback to email-based data if Clerk lookup fails
//           return {
//             ...comment,
//             author: {
//               id: comment.author.id,
//               email: comment.author.email,
//               name: comment.author.email.split('@')[0],
//               imageUrl: null,
//               username: comment.author.email.split('@')[0]
//             }
//           };
//         }
//       })
//     );

//     return NextResponse.json(commentsWithUserDetails);
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch comments" },
//       { status: 500 }
//     );
//   }
// }

// app/api/blog/[slug]/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { slug } = params;
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Get the post
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Get user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Create the comment directly with userId (no user table management)
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: userId, // Use userId directly
        postId: post.id,
        isApproved: false // Comments need approval
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    // Return comment with user details from Clerk
    const commentWithUserDetails = {
      ...comment,
      author: {
        id: userId,
        email: userEmail,
        name: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || clerkUser.lastName || clerkUser.username || userEmail.split('@')[0],
        imageUrl: clerkUser.imageUrl,
        username: clerkUser.username || userEmail.split('@')[0]
      }
    };

    return NextResponse.json(commentWithUserDetails, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// GET route for fetching approved comments (for public display)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get approved comments
    const comments = await prisma.comment.findMany({
      where: {
        post: { slug },
        isApproved: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch user details from Clerk for each comment
    const commentsWithUserDetails = await Promise.all(
      comments.map(async (comment) => {
        try {
          const clerkUser = await clerkClient.users.getUser(comment.authorId);
          const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
          
          return {
            ...comment,
            author: {
              id: comment.authorId,
              email: userEmail,
              name: clerkUser.firstName && clerkUser.lastName 
                ? `${clerkUser.firstName} ${clerkUser.lastName}`
                : clerkUser.firstName || clerkUser.lastName || clerkUser.username || userEmail?.split('@')[0] || 'Anonymous',
              imageUrl: clerkUser.imageUrl,
              username: clerkUser.username || userEmail?.split('@')[0] || 'anonymous'
            }
          };
        } catch (error) {
          console.error(`Error fetching user details for ${comment.authorId}:`, error);
          // Fallback for deleted/invalid users
          return {
            ...comment,
            author: {
              id: comment.authorId,
              email: 'deleted@user.com',
              name: 'Deleted User',
              imageUrl: null,
              username: 'deleted_user'
            }
          };
        }
      })
    );

    return NextResponse.json(commentsWithUserDetails);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
