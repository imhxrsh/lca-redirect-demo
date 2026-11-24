import { randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

const unauthorized = () =>
  new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Build Console", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });

export function proxy(request: NextRequest) {
  if (process.env.BUILD_AUTH_ENABLED === "true") {
    const username = process.env.BUILD_AUTH_USERNAME;
    const password = process.env.BUILD_AUTH_PASSWORD;

    if (!username || !password || username.includes(":")) {
      return new NextResponse(
        "Build authentication is enabled but its server credentials are invalid.",
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }

    const authorization = request.headers.get("authorization");
    const token = authorization?.match(/^Basic\s+(.+)$/i)?.[1];
    const expectedToken = Buffer.from(`${username}:${password}`, "utf8").toString(
      "base64",
    );

    if (!token) {
      return unauthorized();
    }

    const actual = Buffer.from(token);
    const expected = Buffer.from(expectedToken);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return unauthorized();
    }
  }

  if (
    request.nextUrl.pathname === "/" &&
    process.env.REDIRECT_TO_RANDOM_BUILD === "true"
  ) {
    const buildId = randomBytes(16).toString("hex");
    return NextResponse.redirect(new URL(`/builds/${buildId}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
