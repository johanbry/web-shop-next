import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { LoginUserValidationSchema } from "@/interfaces/interfaces";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string,
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
        console.log("credentials", credentials);

        const validatedCredentials =
          LoginUserValidationSchema.safeParse(credentials);
        if (!validatedCredentials.success)
          throw new Error("Felaktiga inloggningsuppgifter!");

        const { email, password } = validatedCredentials.data;
        console.log("email", email);
        console.log("password", password);

        let user = await User.findOne({ email });
        console.log("user", user);

        if (!user) throw new Error("Felaktiga inloggningsuppgifter!");

        const isValid = await bcrypt.compare(password, user.password);
        user = { ...user.toObject(), id: user._id.toString() };
        console.log("user2", user);

        if (isValid) return user;
        else throw new Error("Felaktigt email/lösenord!");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("userjwt", user);

      if (user) {
        return { ...token, id: user.id, name: user.name };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
