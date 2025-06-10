
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

type AuthStep = 'welcome' | 'email' | 'verify-email' | 'password' | 'personal-info' | 'security' | 'complete' | 'login' | 'forgot-password';

interface AuthData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  verificationCode: string;
  securityQuestion: string;
  securityAnswer: string;
}

const ConversationalAuth = ({ mode = 'register' }: { mode?: 'register' | 'login' }) => {
  const [step, setStep] = useState<AuthStep>(mode === 'login' ? 'login' : 'welcome');
  const [authData, setAuthData] = useState<AuthData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    verificationCode: '',
    securityQuestion: '',
    securityAnswer: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendEmailNotification = async (type: 'registration' | 'login', userEmail: string) => {
    try {
      // Simulate email sending - in real app, connect to backend service
      console.log(`Sending ${type} notification to athletic.website99@gmail.com for user: ${userEmail}`);
      
      const emailData = {
        to: 'athletic.website99@gmail.com',
        subject: type === 'registration' ? 'New User Registration' : 'User Login',
        message: `User ${userEmail} has ${type === 'registration' ? 'registered' : 'logged in'} to the platform at ${new Date().toLocaleString()}`
      };
      
      // Store notification for admin viewing
      const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      notifications.unshift({
        id: Date.now(),
        type,
        userEmail,
        timestamp: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('adminNotifications', JSON.stringify(notifications));
      
      toast.success('Admin notified successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleStepSubmit = async () => {
    setIsLoading(true);
    
    switch (step) {
      case 'welcome':
        setStep('email');
        break;
        
      case 'email':
        if (!authData.email || !authData.email.includes('@')) {
          toast.error('Please enter a valid email address');
          setIsLoading(false);
          return;
        }
        
        // Simulate email verification
        toast.success('Verification code sent to your email!');
        setStep('verify-email');
        break;
        
      case 'verify-email':
        if (authData.verificationCode !== '123456') {
          toast.error('Invalid verification code. Use 123456 for demo');
          setIsLoading(false);
          return;
        }
        setStep('password');
        break;
        
      case 'password':
        if (authData.password.length < 8) {
          toast.error('Password must be at least 8 characters long');
          setIsLoading(false);
          return;
        }
        if (authData.password !== authData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        setStep('personal-info');
        break;
        
      case 'personal-info':
        if (!authData.fullName) {
          toast.error('Please enter your full name');
          setIsLoading(false);
          return;
        }
        setStep('security');
        break;
        
      case 'security':
        if (!authData.securityQuestion || !authData.securityAnswer) {
          toast.error('Please complete security settings');
          setIsLoading(false);
          return;
        }
        
        // Complete registration
        const user = {
          id: Date.now().toString(),
          email: authData.email,
          name: authData.fullName,
          phone: authData.phone,
          isAdmin: false,
          registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        await sendEmailNotification('registration', authData.email);
        setStep('complete');
        break;
        
      case 'login':
        if (!authData.email || !authData.password) {
          toast.error('Please enter email and password');
          setIsLoading(false);
          return;
        }
        
        // Simulate login
        const loginUser = {
          id: Date.now().toString(),
          email: authData.email,
          name: authData.email.split('@')[0],
          isAdmin: authData.email === 'admin@admin.com'
        };
        
        localStorage.setItem('user', JSON.stringify(loginUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        await sendEmailNotification('login', authData.email);
        toast.success('Welcome back!');
        window.location.href = loginUser.isAdmin ? '/admin' : '/';
        break;
    }
    
    setIsLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Welcome! Let's get you started</h2>
            <p className="text-muted-foreground">I'll guide you through creating your account step by step. It only takes a few minutes!</p>
            <div className="flex items-center gap-2 justify-center">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm">Your data is secure and encrypted</span>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">What's your email address?</h2>
            <p className="text-muted-foreground">We'll use this to send you important updates and verify your account.</p>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={authData.email}
                onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>We'll never share your email with third parties</span>
            </div>
          </div>
        );

      case 'verify-email':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Check your email!</h2>
            <p className="text-muted-foreground">I've sent a 6-digit verification code to <strong>{authData.email}</strong></p>
            <Input
              type="text"
              placeholder="Enter 6-digit code (use 123456 for demo)"
              value={authData.verificationCode}
              onChange={(e) => setAuthData(prev => ({ ...prev, verificationCode: e.target.value }))}
              maxLength={6}
            />
            <div className="text-sm text-muted-foreground">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              Didn't receive it? Check your spam folder or we can resend it.
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Create a secure password</h2>
            <p className="text-muted-foreground">Make it strong to keep your account safe!</p>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={authData.password}
                onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            <Input
              type="password"
              placeholder="Confirm password"
              value={authData.confirmPassword}
              onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${authData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${/[A-Z]/.test(authData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                <span>One uppercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${/[0-9]/.test(authData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                <span>One number</span>
              </div>
            </div>
          </div>
        );

      case 'personal-info':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Tell me a bit about yourself</h2>
            <p className="text-muted-foreground">This helps us personalize your experience.</p>
            
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Your full name"
                value={authData.fullName}
                onChange={(e) => setAuthData(prev => ({ ...prev, fullName: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Input
              type="tel"
              placeholder="Phone number (optional)"
              value={authData.phone}
              onChange={(e) => setAuthData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">One last security step</h2>
            <p className="text-muted-foreground">This helps us verify your identity if you ever forget your password.</p>
            
            <select
              value={authData.securityQuestion}
              onChange={(e) => setAuthData(prev => ({ ...prev, securityQuestion: e.target.value }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Choose a security question</option>
              <option value="pet">What was your first pet's name?</option>
              <option value="school">What elementary school did you attend?</option>
              <option value="city">In what city were you born?</option>
              <option value="mother">What is your mother's maiden name?</option>
            </select>

            <Input
              type="text"
              placeholder="Your answer"
              value={authData.securityAnswer}
              onChange={(e) => setAuthData(prev => ({ ...prev, securityAnswer: e.target.value }))}
            />
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Welcome aboard! 🎉</h2>
            <p className="text-muted-foreground">Your account has been created successfully. You can now start shopping!</p>
            <Button onClick={() => window.location.href = '/'} className="athletic-gradient">
              Start Shopping
            </Button>
          </div>
        );

      case 'login':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Welcome back!</h2>
            <p className="text-muted-foreground">Please sign in to your account.</p>
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="email"
                placeholder="Your email"
                value={authData.email}
                onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={authData.password}
                onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            <div className="text-center">
              <Button variant="link" onClick={() => setStep('forgot-password')}>
                Forgot your password?
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground">
              <p>Demo: Use admin@admin.com for admin access</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Account Setup</CardTitle>
          {step !== 'welcome' && step !== 'complete' && step !== 'login' && (
            <Badge variant="outline">{step.replace('-', ' ')}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}
        
        {step !== 'complete' && (
          <Button
            onClick={handleStepSubmit}
            disabled={isLoading}
            className="w-full athletic-gradient"
          >
            {isLoading ? 'Processing...' : 
             step === 'login' ? 'Sign In' :
             step === 'welcome' ? 'Get Started' : 'Continue'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationalAuth;
