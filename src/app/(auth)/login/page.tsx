import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LeafIcon } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <LeafIcon className="h-12 w-12 text-primary mx-auto" />
          </Link>
          <CardTitle className="text-3xl font-bold text-primary">Login to Health369</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* LoginForm component would go here */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
              <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-foreground">Password</label>
              <input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="••••••••" />
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Login</Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
