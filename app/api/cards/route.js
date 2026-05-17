import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "cards.json");
  const cards = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return Response.json(cards);
}
