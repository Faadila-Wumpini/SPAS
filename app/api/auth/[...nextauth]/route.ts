import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    // Temporarily disabled Google OAuth until credentials are set up
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/signup',
  },
})

export { handler as GET, handler as POST } 