import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // You can add custom logic here to save user to database
            return true
        },
        async session({ session, token }) {
            // Add custom session data
            return session
        },
        async jwt({ token, user, account }) {
            // Add custom JWT data
            return token
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
}

export default NextAuth(authOptions)

