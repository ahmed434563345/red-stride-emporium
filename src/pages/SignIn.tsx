
import Navigation from '@/components/Navigation';
import AuthComponent from '@/components/AuthComponent';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <AuthComponent mode="login" />
      </div>
    </div>
  );
};

export default SignIn;
