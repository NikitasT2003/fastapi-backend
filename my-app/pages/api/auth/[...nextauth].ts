import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Define baseUrl using the environment variable
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!baseUrl) {
        throw new Error('Base URL is not defined');
      }

      // Check if the user already exists in your database
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          provider: account?.provider,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful, you can return true to allow the sign-in
        return true;
      } else {
        // If login fails, attempt to sign up the user
        const signupResponse = await fetch(`${baseUrl}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider: account?.provider,
          }),
        });

        const signupData = await signupResponse.json();

        if (signupResponse.ok) {
          // If signup is successful, return true to allow the sign-in
          return true;
        } else {
          // Handle errors for both login and signup
          return false;
        }
      }
    },
  },
})