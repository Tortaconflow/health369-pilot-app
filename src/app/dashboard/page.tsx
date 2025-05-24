import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile, AISuggestions as AISuggestionsType } from "@/types/domain";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, Zap, Target, UserCircle, Sparkles, CookingPot, Dumbbell } from "lucide-react";
import AISuggestionCard from "@/components/ai/AISuggestionCard";
import { generateAISuggestions } from "@/app/actions/suggestionActions";

// Mock data - replace with actual data fetching
const mockUserProfile: UserProfile = {
  id: "user123",
  name: "Alex Johnson",
  email: "alex.j@example.com",
  avatarUrl: "https://placehold.co/100x100.png",
  level: 5,
  experiencePoints: 450,
  badges: ["Early Adopter", "Challenge Starter"],
  virtualCurrency: 1500,
  currentChallengeIds: ["challenge001"],
  healthGoals: ["Lose 5kg", "Improve stamina"],
  progress: {
    weight: 75, // kg
    waist: 80, // cm
    muscleMassPercentage: 20,
    lastUpdated: new Date().toISOString(),
  }
};

export default async function DashboardPage() {
  // In a real app, user data would be fetched or passed
  const userDataForAISuggestions = `User health goals: ${mockUserProfile.healthGoals?.join(', ') || 'Not specified'}. Current weight: ${mockUserProfile.progress?.weight || 'N/A'} kg. Recent activity: Participated in 1 challenge.`;
  
  let aiSuggestions: AISuggestionsType | null = null;
  try {
    const suggestionResult = await generateAISuggestions({ userData: userDataForAISuggestions });
    if (suggestionResult.success && suggestionResult.data) {
      aiSuggestions = {
        recipe: { name: suggestionResult.data.recipeSuggestion, description: "AI recommended recipe", ingredients: [], instructions: ""},
        routine: { name: suggestionResult.data.routineSuggestion, description: "AI recommended routine", exercises: []}
      }
    }
  } catch (error) {
    console.error("Failed to fetch AI suggestions:", error);
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary">Welcome back, {mockUserProfile.name}!</h1>
        <p className="text-lg text-muted-foreground">Here's your health and fitness overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Target className="h-8 w-8" />} title="Level" value={mockUserProfile.level.toString()} description="Keep it up!" />
        <StatCard icon={<Zap className="h-8 w-8" />} title="XP" value={mockUserProfile.experiencePoints.toString()} description="Towards next level" />
        <StatCard icon={<BarChart3 className="h-8 w-8" />} title="Coins" value={`🪙 ${mockUserProfile.virtualCurrency}`} description="Earn more in challenges" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Active Challenges</CardTitle>
              <CardDescription>Stay on track and crush your goals.</CardDescription>
            </CardHeader>
            <CardContent>
              {mockUserProfile.currentChallengeIds && mockUserProfile.currentChallengeIds.length > 0 ? (
                mockUserProfile.currentChallengeIds.map(challengeId => (
                  <ChallengeTeaserCard key={challengeId} challengeId={challengeId} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You're not currently in any challenges.</p>
                  <Link href="/challenges" passHref legacyBehavior>
                    <Button>
                      Explore Challenges <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg" id="ai-suggestions">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-accent" />
              AI Suggestions
            </CardTitle>
            <CardDescription>Personalized tips for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiSuggestions ? (
              <>
                <AISuggestionCard 
                  icon={<CookingPot className="h-8 w-8 text-primary"/>} 
                  title="Recipe Idea" 
                  suggestion={aiSuggestions.recipe.name} 
                  description="A healthy and delicious meal to fuel your day."
                />
                <AISuggestionCard 
                  icon={<Dumbbell className="h-8 w-8 text-primary"/>} 
                  title="Workout Tip" 
                  suggestion={aiSuggestions.routine.name} 
                  description="Try this routine to boost your progress."
                />
              </>
            ) : (
              <p className="text-muted-foreground">AI suggestions are being generated or are unavailable at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

function StatCard({ icon, title, value, description }: StatCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-accent">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Mock Challenge Teaser Card
function ChallengeTeaserCard({ challengeId }: { challengeId: string }) {
  // In a real app, fetch challenge details by ID
  const mockChallenge = {
    id: challengeId,
    name: "30-Day Fitness Blast",
    coverImageUrl: "https://placehold.co/600x300.png?text=Challenge+Cover"
  };

  return (
    <Card className="mb-4 overflow-hidden transition-all hover:scale-[1.02] duration-300 ease-in-out">
      <Link href={`/challenges/${mockChallenge.id}`} className="block">
        <div className="relative">
          <Image 
            src={mockChallenge.coverImageUrl} 
            alt={mockChallenge.name} 
            width={600} 
            height={200} 
            className="w-full h-40 object-cover"
            data-ai-hint="fitness challenge" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
            {mockChallenge.name}
          </h3>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
             <p className="text-sm text-muted-foreground">View progress and details</p>
             <Button variant="outline" size="sm">
                View Challenge <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
