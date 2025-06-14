
import Navigation from '@/components/Navigation';
import AuthComponent from '@/components/AuthComponent';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <AuthComponent mode="register" />
      </div>
    </div>
  );
};

export default SignUp;
