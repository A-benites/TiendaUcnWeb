import NextAuth, { NextAuthOptions, DefaultSession, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string; // Add id if available/needed, otherwise optional
      rut: string;
      role?: string; // Add role if you have it
    } & DefaultSession["user"];
  }

  interface User {
    token: string;
    rut: string;
    firstName: string;
    lastName: string;
    // Add other fields from your API user response
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: NextAuthUser & { token: string; rut: string; firstName: string; lastName: string; role?: string };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 1. Call your existing backend login
          const loginResponse = await authService.login(credentials.email, credentials.password);
          const token = loginResponse.data;

          // 2. Fetch user profile with the token
          const profileResponse = await authService.getProfile(token);
          const userData = profileResponse.data;

          // 3. Return the object that will be saved in the JWT
          // Note: The object returned here is passed to the jwt callback as `user`
          return {
            id: userData.rut, // Using RUT as ID or map a real ID if available
            email: userData.email,
            name: `${userData.firstName} ${userData.lastName}`,
            firstName: userData.firstName,
            lastName: userData.lastName,
            rut: userData.rut,
            token: token, // IMPORTANT: Pass the token to the JWT
          };
        } catch (error) {
          // Log error or handle specific status codes
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.token;
        
        // Decode the token to get the role
        try {
            const decoded = jwtDecode<{ [key: string]: string | undefined }>(user.token);
            // The claim name might be "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" or just "role"
            // Adjust based on your backend's JWT structure
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
            
            token.user = {
                ...user,
                role: role
            };
        } catch (error) {
            console.error("Error decoding token:", error);
            token.user = user;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        ...token.user, // Spread user data into session.user
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-me", // Ensure this is set in .env
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
