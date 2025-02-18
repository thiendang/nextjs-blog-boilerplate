import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import FacebookProvider, { FacebookProfile } from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from 'lib/prisma';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { uniqueString } from '@/utils/index';

// import FacebookProvider from 'next-auth/providers/facebook';
// import GoogleProvider from 'next-auth/providers/google';

const checkUniqueEmail = async (profile: FacebookProfile | GoogleProfile) => {
  const { email } = profile;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  if (user) {
    throw new Error('Email already exists.');
  }
};

const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@gmail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
          // return { error: `User with email: ${email} does not exist.` };
        }
        // You can also Reject this callback with an Error or with a URL:
        // throw new Error('error message') // Redirect to error page
        // throw '/path/to/redirect'        // Redirect to a URL
        const isValid =
          password && user.password && (await compare(password, user.password));
        if (!isValid) {
          return null;
          // return { error: 'Invalid password.' };
        }

        return user;
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profile: async (profile: FacebookProfile) => {
        const username = `facebook_user__${uniqueString(6)}`;

        // handle non existing email
        if (!profile.email) {
          profile.email = `${username}@non-existing-facebook-email.com`;
        }

        await checkUniqueEmail(profile);
        return { ...profile, username };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: async (profile: FacebookProfile) => {
        await checkUniqueEmail(profile);
        const username = `google_user__${uniqueString(6)}`;
        return { ...profile, username };
      },
    }),
  ],
  session: {
    jwt: true, // doesnt work without this...
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: { secret: process.env.SECRET },
  pages: { signIn: '/signin' },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  debug: false,
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
