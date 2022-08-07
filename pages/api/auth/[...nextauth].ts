import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { RELATIVE_PICTURES_URL } from "@constants";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    redirect: () => RELATIVE_PICTURES_URL,
  },
});
