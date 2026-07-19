import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

type ThreadClaims = {
  threadId: string;
  userId: string;
  siteId: string;
  expiresAt: number;
};

function getSecret() {
  const secret =
    process.env.SNOBALL_THREAD_SECRET ?? process.env.CLERK_SECRET_KEY;

  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "snoball-local-thread-secret";
  throw new Error("SNOBALL_THREAD_SECRET is required in production");
}

function signatureFor(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createThreadToken(
  claims: Omit<ThreadClaims, "expiresAt">
) {
  const payload = Buffer.from(
    JSON.stringify({
      ...claims,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    } satisfies ThreadClaims)
  ).toString("base64url");

  return `${payload}.${signatureFor(payload)}`;
}

export function verifyThreadToken(
  token: string,
  expected: Pick<ThreadClaims, "userId" | "siteId">
) {
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return null;

  const expectedSignature = signatureFor(payload);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const claims = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as ThreadClaims;

    if (
      claims.expiresAt < Date.now() ||
      claims.userId !== expected.userId ||
      claims.siteId !== expected.siteId
    ) {
      return null;
    }

    return claims;
  } catch {
    return null;
  }
}
