import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LeafIcon } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
           <Link href="/" className="inline-block">
            <LeafIcon className="h-12 w-12 text-primary mx-auto" />
          </Link>
          <CardTitle className="text-3xl font-bold text-primary">Create Health369 Account</CardTitle>
          <CardDescription>Join our community and start your wellness journey.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SignupForm component would go here */}
           <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">Full Name</label>
              <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Your Name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
              <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-foreground">Password</label>
              <input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="••••••••" />
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
