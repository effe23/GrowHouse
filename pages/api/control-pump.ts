import type { NextApiRequest, NextApiResponse } from 'next';

let pumpStatus = 'OFF';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { status } = req.body;
    pumpStatus = status;
    res.status(200).json({ message: 'Pump status updated' });
  } else if (req.method === 'GET') {
    res.status(200).json({ pumpStatus });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
