import { SignIn } from '@clerk/react-router'

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded">
            <header>
              {/* <SignedOut>
                <SignInButton />
              </SignedOut> */}
              {/* <SignedIn> */}
                {/* <UserButton />
              </SignedIn> */}
              <SignIn path='/login' forceRedirectUrl='/'/>
            </header>
      </div>
    </div>
  );
};

export default LoginPage;
