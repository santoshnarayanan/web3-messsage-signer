import request from 'supertest';
import { Wallet } from 'ethers';
import app from '../src/server.js';

describe('POST /verify-signature', () => {
  const message = 'Hello from the test suite 👋';

  it('valid signature returns signer and isValid=true', async () => {
    const wallet = Wallet.createRandom();
    const signature = await wallet.signMessage(message);

    const res = await request(app).post('/verify-signature').send({ message, signature });
    expect(res.status).toBe(200);
    expect(res.body.isValid).toBe(true);
    expect(res.body.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
    expect(res.body.originalMessage).toBe(message);
  });

  it('tampered signature returns isValid=false', async () => {
    const wallet = Wallet.createRandom();
    const signature = await wallet.signMessage(message);
    const badSig = signature.slice(0, -1) + (signature.slice(-1) === '0' ? '1' : '0');

    const res = await request(app).post('/verify-signature').send({ message, signature: badSig });
    expect(res.status).toBe(200);
    expect(res.body.isValid).toBe(false);
    expect(res.body.signer).toBe(null);
  });
});
