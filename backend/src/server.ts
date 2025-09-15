import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { verifyMessage, getAddress } from 'ethers';

const app = express();
// Allow only your dev + prod frontends
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://web3-message-signer.vercel.app'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Simple health
app.get('/health', (_req, res) => res.json({ ok: true }));

const VerifyBody = z.object({
  message: z.string().min(1),
  signature: z.string().regex(/^0x[0-9a-fA-F]+$/),
});

app.post('/verify-signature', async (req, res) => {
  const parsed = VerifyBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }
  const { message, signature } = parsed.data;

  try {
    // ethers v6: verifyMessage returns recovered address (EIP-191 personal sign)
    const recovered = verifyMessage(message, signature);
    // If verifyMessage succeeded, signature is structurally valid.
    const signer = getAddress(recovered); // checksums the address
    return res.json({ isValid: true, signer, originalMessage: message });
  } catch (err) {
    return res.json({ isValid: false, signer: null, originalMessage: message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app; // for tests
