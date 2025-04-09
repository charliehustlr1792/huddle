import type { NextAuthConfig, DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/types/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"


 declare module "next-auth" {
     interface User{
        role?: string
    }
     interface JWT{
        role: string
    }
     interface Session {
       user: {
        role: string
      } & DefaultSession["user"]
    }
   }

export default {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials);
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await prisma.team.findFirst({ where: { email } });

                    if (!user || !user.password) {
                        console.log("User not found or password not set");
                        return null;
                    }
                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (passwordMatch) return user;
                }
                return null;
            }
        })
    ],
    callbacks: {
        async session({token,session}){
            if (token?.email && session.user) {
                session.user.email = token.email as string;
            }
            return session;
        },
         async jwt({token,user}){
            if(user?.id)
                token.id = user.id;
         if(user?.role)
                token.role = user.role;
             return token;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"}
} satisfies NextAuthConfig