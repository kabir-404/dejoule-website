import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return Response.json({ error: "A valid name is required." }, { status: 400 });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) {
      return Response.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return Response.json({ error: "Please include a message (at least 10 characters)." }, { status: 400 });
    }

    const entry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      receivedAt: new Date().toISOString(),
    };

    const filePath = path.join(process.cwd(), "data", "contacts.json");
    let contacts = [];
    if (fs.existsSync(filePath)) {
      contacts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    contacts.push(entry);
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2), "utf-8");

    console.log("[DeJoule Contact]", entry);

    return Response.json(
      { success: true, message: "Thanks for reaching out — we'll be in touch within 24 hours." },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: "Unable to process your request. Please try again." }, { status: 500 });
  }
}
