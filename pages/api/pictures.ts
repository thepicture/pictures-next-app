// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  pictures: string[]
}
const IMAGE_WIDTH_IN_PIXELS = 640;
const IMAGE_HEIGHT_IN_PIXELS = 320;

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let pictures: string[] = [];

  for (let i = 0; i < 2; i++) {
    const response = await fetch(`https://random.imagecdn.app/${IMAGE_WIDTH_IN_PIXELS}/${IMAGE_HEIGHT_IN_PIXELS}`);
    pictures = [...pictures, response.url];
  }


  res.status(200).json({ pictures })
}
