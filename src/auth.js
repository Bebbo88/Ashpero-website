import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";

function normalizeAbsoluteUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  const trimmedValue = value.trim();

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue.replace(/\/$/, "");
  }

  return `https://${trimmedValue}`.replace(/\/$/, "");
}

function resolveAuthBaseUrl() {
  const candidates = [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.NEXTAUTH_URL,
    process.env.AUTH_URL,
  ];

  for (const candidate of candidates) {
    const normalizedUrl = normalizeAbsoluteUrl(candidate);
    if (normalizedUrl) {
      return normalizedUrl;
    }
  }

  return "";
}

const deploymentAuthBaseUrl = resolveAuthBaseUrl();

if (deploymentAuthBaseUrl && process.env.NODE_ENV === "production") {
  process.env.NEXTAUTH_URL = deploymentAuthBaseUrl;
  process.env.AUTH_URL = deploymentAuthBaseUrl;
}

const providers = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  );
}

if (process.env.AUTH_TWITTER_ID && process.env.AUTH_TWITTER_SECRET) {
  providers.push(
    TwitterProvider({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
      version: "2.0",
    }),
  );
}

export const authOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      const safeBaseUrl =
        normalizeAbsoluteUrl(baseUrl) ||
        deploymentAuthBaseUrl ||
        "http://localhost:3000";

      if (typeof url === "string" && url.startsWith("/")) {
        return `${safeBaseUrl}${url}`;
      }

      try {
        const parsedTargetUrl = new URL(url);
        const parsedBaseUrl = new URL(safeBaseUrl);

        if (parsedTargetUrl.origin === parsedBaseUrl.origin) {
          return parsedTargetUrl.toString();
        }
      } catch (_error) {
        return safeBaseUrl;
      }

      return safeBaseUrl;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider) {
        token.provider = account.provider;
      }

      if (profile?.picture) {
        token.picture = profile.picture;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.provider = token.provider;
        session.user.image = token.picture || session.user.image;
      }

      return session;
    },
  },
};
