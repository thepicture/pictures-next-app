import type { NextApiRequest, NextApiResponse, NextConfig } from "next";

import { Picture } from "@interfaces";

import { pictures } from "@persistency";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Picture[]>
) {
  if (req.method === "POST") {
    const newPictures = req.body as Picture[];
    pictures.push(...newPictures);
    return res.status(201).json(pictures);
  } else if (req.method === "GET") {
    return res.status(200).json(pictures);
  } else {
    return res.status(405);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
