// types/globals.d.ts
export type Roles = 'admin' | 'moderator' | 'user';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
      name?: string;
    };
    email?: string;
    iat?: number; // Issued at (Unix timestamp)
  }
}