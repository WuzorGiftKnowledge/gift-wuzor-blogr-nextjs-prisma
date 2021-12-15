// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from 'next';
import NextAuth, { User as NextAuthUser } from 'next-auth';
import Providers from 'next-auth/providers/github';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
//import prisma from '../../../lib/prisma';
import { prisma} from '../../../lib/prisma';



interface NextAuthUserWithStringId extends NextAuthUser {
  id: string
}
//const prisma= new PrismaClient();
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    Providers({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as NextAuthUserWithStringId
      },
    }),
  ],
  adapter: PrismaAdapter( prisma ),
  secret: process.env.SECRET,
};