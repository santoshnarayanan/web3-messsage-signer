import type { FormEvent } from 'react';
import { useConnectWithOtp, useDynamicContext } from '@dynamic-labs/sdk-react-core';

export default function AuthEmail() {
  const { user } = useDynamicContext();
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();

  const onEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as any;
    const email = form.email.value as string;
    await connectWithEmail(email);
    form.reset();
  };
  const onOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as any;
    const otp = form.otp.value as string;
    await verifyOneTimePassword(otp);
    form.reset();
  };

  return (
    <div>
      <form className="row" onSubmit={onEmail}>
        <input name="email" type="email" placeholder="you@domain.com" required />
        <button type="submit">Send OTP</button>
      </form>
      <form className="row" onSubmit={onOtp} style={{ marginTop: 8 }}>
        <input name="otp" type="text" placeholder="Enter OTP" required />
        <button type="submit">Verify</button>
      </form>
      {user && (
        <>
          <hr />
          <small>Authenticated user:</small>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
