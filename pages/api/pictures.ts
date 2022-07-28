// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  pictures: string[]
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let pictures: string[] = [];

  for (let i = 0; i < 2; i++) {
    const width = Math.floor(Math.random() * 200 + 50);
    const height = Math.floor(Math.random() * 100 + 20);
    const response = await fetch(`https://random.imagecdn.app/${width}/${height}`);
    pictures = [...pictures, response.url];
  }


  res.status(200).json({ pictures })
}
