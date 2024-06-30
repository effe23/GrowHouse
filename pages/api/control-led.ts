import type { NextApiRequest, NextApiResponse } from 'next';

let ledStatus = {
  red: 0,
  green: 0,
  blue: 0,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { red, green, blue } = req.body;
    ledStatus = { red, green, blue };
    res.status(200).json({ message: 'LED status updated' });
  } else if (req.method === 'GET') {
    res.status(200).json(ledStatus);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
