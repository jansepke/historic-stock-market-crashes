import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await import(`../../../../index-data/chart-${req.query.index}.json`);

  res.status(200).json(data.data);
}
