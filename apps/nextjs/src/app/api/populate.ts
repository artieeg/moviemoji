import {populateMovies} from "@moviemoji/api";
import {NextRequest, NextResponse} from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  await populateMovies();

  return NextResponse.json(
    {
      body: request.body,
      query: request.nextUrl.search,
      cookies: request.cookies.getAll(),
    },
    {
      status: 200,
    },
  );
}
