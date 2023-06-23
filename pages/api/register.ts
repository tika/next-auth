import prisma from "../../lib/prismadb";
import { NextResponse } from "next/server";
import argon from "argon2";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, name, password } = req.body;

      console.log(email, name, password);

      if (!email || !name || !password) {
        return new NextResponse("Missing info", { status: 400 });
      }

      const hashedPassword = await argon.hash(password);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          hashedPassword,
        },
      });

      return res.json(user);
    } catch (error: any) {
      console.log(error, "REGISTRATION_ERROR");
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
}
