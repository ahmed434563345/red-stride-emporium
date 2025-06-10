
import Navigation from '@/components/Navigation';
import ConversationalAuth from '@/components/ConversationalAuth';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <ConversationalAuth mode="register" />
      </div>
    </div>
  );
};

export default SignUp;
