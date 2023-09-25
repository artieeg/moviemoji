import {populateMovies} from "@moviemoji/api";
import {NextRequest, NextResponse} from "next/server";

//export const runtime = "edge";

export async function POST(request: NextRequest) {
  /** Should've had a standalone app to populate stuff, but this works too */
  await populateMovies();

  return NextResponse.json(
    {},
    {
      status: 200,
    },
  );
}
