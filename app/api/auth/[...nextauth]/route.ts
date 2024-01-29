import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { LoginUserValidationSchema } from "@/interfaces/interfaces";
import connectToDB from "@/utils/db";
import { redirect } from "next/navigation";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        name: { label: "Namn", type: "text" },
        email: { label: "E-post", type: "email" },
        password: { label: "Lösenord", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const validatedCredentials =
          LoginUserValidationSchema.safeParse(credentials);
        if (!validatedCredentials.success)
          throw new Error("Felaktiga inloggningsuppgifter.");

        const { email, password } = validatedCredentials.data;
        let user = await User.findOne({ email });

        if (!user) throw new Error("Felaktiga inloggningsuppgifter.");

        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) return user;
        else throw new Error("Felaktigt email/lösenord.");
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      //If user is logging in with google, create account if new customer. But if email is already used with other type of account (credentials) deny login.
      if (account?.provider === "google") {
        await connectToDB();
        const dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          const newUser = new User({
            name: user.name,
            email: user.email,
            role: "customer",
            account: "google",
          });
          const newDbUser = await User.create(newUser);
          user.id = newDbUser._id.toString();
        } else if (dbUser.account !== "google") {
          throw new Error(
            "Det finns redan ett konto med den h%C3%A4r e-postadressen. Logga in med det konto du anv%C3%A4nt tidigare."
          );
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      //User is logging in, add extra fields to token
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        return {
          ...token,
          id: dbUser._id.toString(),
          name: user.name,
          role: dbUser.role ?? "customer",
        };
      }
      return token;
    },
    async session({ session, token }) {
      //Pass info from token to make it available in session
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          role: token.role,
        },
      };
    },
  },
  pages: {
    signIn: "/loggain",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
