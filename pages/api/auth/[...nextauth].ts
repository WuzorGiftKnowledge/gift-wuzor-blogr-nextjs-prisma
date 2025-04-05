import { NextApiHandler } from 'next';
import NextAuth, { User as NextAuthUser } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '../../../lib/prisma';

interface NextAuthUserWithStringId extends NextAuthUser {
  id: string;
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
export {authHandler, options};

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
    
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as NextAuthUserWithStringId;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,

  callbacks: {
    async session({ session, user }) {
      // Include user email and id in the session
      if (session.user) {
        session.user.id = user.id;
        session.user.email = user.email;
      }
      return session;
    },
  },
};