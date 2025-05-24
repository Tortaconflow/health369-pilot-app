import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Users, ShieldCheck, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl">
          Welcome to <span className="text-accent">Health369 Pilot</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-foreground/80">
          Your personalized journey to peak health and fitness starts here. Connect with experts, join exciting challenges, and achieve your goals like never before.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <FeatureCard
          icon={<Zap className="h-10 w-10 text-primary" />}
          title="Engaging Challenges"
          description="Participate in transformative fitness challenges, track your progress with authenticated photos, and win rewards."
          href="/challenges"
        />
        <FeatureCard
          icon={<Users className="h-10 w-10 text-primary" />}
          title="Expert Connections"
          description="Access a directory of certified trainers and nutritionists. Get personalized guidance through chat and video consultations."
          href="/experts"
        />
        <FeatureCard
          icon={<ShieldCheck className="h-10 w-10 text-primary" />}
          title="AI-Powered Insights"
          description="Benefit from AI-driven suggestions for recipes and routines, plus fair challenge evaluations and photo authentication."
          href="/dashboard#ai-suggestions"
        />
      </div>

      <Card className="w-full max-w-4xl mx-auto shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:shrink-0">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Fitness journey" 
              width={600} 
              height={400}
              className="h-64 w-full object-cover md:h-full md:w-72"
              data-ai-hint="fitness journey"
            />
          </div>
          <div className="p-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">Ready to Transform?</CardTitle>
              <CardDescription className="text-lg text-foreground/70 mt-2">
                Health369 Pilot provides the tools, community, and expert support you need to succeed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-foreground/90">
                <li className="flex items-center">
                  <Target className="h-5 w-5 text-accent mr-3" />
                  Set and achieve measurable health goals.
                </li>
                <li className="flex items-center">
                  <Zap className="h-5 w-5 text-accent mr-3" />
                  Experience the thrill of gamified challenges.
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-accent mr-3" />
                  Connect with a supportive community and professionals.
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-6">
              <Link href="/dashboard" passHref legacyBehavior>
                <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="items-center text-center">
        <div className="p-4 bg-accent/20 rounded-full mb-4">
          {icon}
        </div>
        <CardTitle className="text-2xl font-semibold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-foreground/80">{description}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href={href} passHref legacyBehavior>
          <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
