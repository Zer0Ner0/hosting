import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const { plan_id } = router.query;

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(plan_id ? `/checkout?plan_id=${plan_id}` : '/checkout');
    }
  }, [status, plan_id, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => signIn('google')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
      >
        Sign in with Google
      </button>
    </div>
  );
}