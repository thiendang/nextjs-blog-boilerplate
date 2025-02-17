import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { ClientSafeProvider, getProviders, signIn, useSession } from 'next-auth/react';
import React, { useRef } from 'react';

type Props = {
  providers: Record<string, ClientSafeProvider>;
};

const SignIn: React.FC<Props> = ({ providers }) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;

    if (!email || !password) {
      return;
    }

    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
    } catch (error) {
      console.error(error);
    }
  }

  console.log('providers', providers);

  if (session) {
    Router.push('/');
  }

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" ref={emailInputRef} required />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          ref={passwordInputRef}
          required
        />
        <button type="submit">Sign in</button>
      </form>

      {providers &&
        Object.values(providers).map((provider) => {
          return (
            provider.type !== 'credentials' && (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                  Sign in with {provider.name}
                </button>
              </div>
            )
          );
        })}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
