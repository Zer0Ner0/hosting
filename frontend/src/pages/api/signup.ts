// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

//   // In real life: forward to Django, e.g.:
//   // await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/register/`, { ... })

//   // naive delay to simulate network
//   await new Promise((r) => setTimeout(r, 500));
//   return res.status(200).json({ ok: true });
// }
