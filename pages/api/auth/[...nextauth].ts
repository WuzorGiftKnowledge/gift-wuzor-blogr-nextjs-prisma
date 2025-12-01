import { NextApiHandler } from 'next';
import NextAuth, { User as NextAuthUser } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '../../../lib/prisma';

interface NextAuthUserWithStringId extends NextAuthUser {
  id: string;
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
export {authHandler, options};

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: `${baseUrl}/api/auth/callback/github`,
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as NextAuthUserWithStringId;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: `${baseUrl}/api/auth/callback/google`,
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        } as NextAuthUserWithStringId;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  debug: process.env.NODE_ENV === 'development',

  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle account linking when a user with the same email exists
      if (account && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        });
        
        // If user exists but doesn't have this provider account, link it
        if (existingUser) {
          const hasThisProvider = existingUser.accounts.some(
            (acc) => acc.provider === account.provider
          );
          
          if (!hasThisProvider) {
            // Link the account to existing user
            try {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at ? Math.floor(account.expires_at / 1000) : null,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                },
              });
            } catch (error) {
              console.error('Error linking account:', error);
            }
          }
        }
      }
      return true;
    },
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