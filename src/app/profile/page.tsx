import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile as UserProfileType } from "@/types/domain";
import { Award, BarChart3, Edit3, Shield, Star, User, Zap } from "lucide-react";
import Image from "next/image";

// Mock data - replace with actual data fetching
const mockUserProfile: UserProfileType = {
  id: "user123",
  name: "Alex Johnson",
  email: "alex.j@example.com",
  avatarUrl: "https://placehold.co/200x200.png",
  level: 5,
  experiencePoints: 450,
  badges: ["Early Adopter", "Challenge Starter", "Streak Master"],
  virtualCurrency: 1500,
  healthGoals: ["Lose 5kg by July", "Run 5k thrice a week", "Eat more vegetables"],
  preferences: {
    notifications: "enabled",
    theme: "light",
  },
  progress: {
    weight: 75,
    waist: 80,
    muscleMassPercentage: 20,
    lastUpdated: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  }
};


export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-md">
              <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.name} data-ai-hint="profile picture" />
              <AvatarFallback className="text-4xl">{mockUserProfile.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-primary">{mockUserProfile.name}</h1>
              <p className="text-lg text-muted-foreground">{mockUserProfile.email}</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center text-yellow-500">
                  <Star className="h-5 w-5 mr-1" /> Level {mockUserProfile.level}
                </div>
                <div className="flex items-center text-accent">
                  <Zap className="h-5 w-5 mr-1" /> {mockUserProfile.experiencePoints} XP
                </div>
                <div className="flex items-center text-green-500">
                  🪙 {mockUserProfile.virtualCurrency} Coins
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Section title="Health Goals">
                <ul className="list-disc list-inside space-y-1 text-foreground/90">
                  {mockUserProfile.healthGoals?.map(goal => <li key={goal}>{goal}</li>)}
                </ul>
              </Section>
              <Separator className="my-6" />
              <Section title="Recent Activity">
                <p className="text-muted-foreground">Joined "Summer Shred Challenge".</p>
                <p className="text-muted-foreground">Completed "Morning Run" 3 times this week.</p>
              </Section>
            </TabsContent>

            <TabsContent value="progress">
              <Section title="Current Stats">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <StatDisplay label="Weight" value={`${mockUserProfile.progress?.weight || 'N/A'} kg`} />
                    <StatDisplay label="Waist" value={`${mockUserProfile.progress?.waist || 'N/A'} cm`} />
                    <StatDisplay label="Muscle Mass" value={`${mockUserProfile.progress?.muscleMassPercentage || 'N/A'} %`} />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                    Last updated: {new Date(mockUserProfile.progress?.lastUpdated || Date.now()).toLocaleDateString()}
                </p>
              </Section>
              <Separator className="my-6" />
              <Section title="Progress Photos">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Before</h4>
                        <Image src="https://placehold.co/300x400.png?text=Before" alt="Before photo" width={300} height={400} className="rounded-lg shadow-md" data-ai-hint="progress photo" />
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">After (Example)</h4>
                        <Image src="https://placehold.co/300x400.png?text=After" alt="After photo example" width={300} height={400} className="rounded-lg shadow-md" data-ai-hint="progress photo" />
                    </div>
                 </div>
              </Section>
            </TabsContent>
            
            <TabsContent value="badges">
              <Section title="Earned Badges">
                <div className="flex flex-wrap gap-3">
                  {mockUserProfile.badges.map(badge => (
                    <Badge key={badge} variant="secondary" className="px-3 py-1 text-sm bg-accent/20 text-accent-foreground border-accent">
                      <Award className="h-4 w-4 mr-1.5" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </Section>
            </TabsContent>

            <TabsContent value="settings">
              <Section title="Account Information">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={mockUserProfile.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={mockUserProfile.email} disabled />
                  </div>
                  <Button><Edit3 className="h-4 w-4 mr-2" />Save Changes</Button>
                </div>
              </Section>
              <Separator className="my-6" />
              <Section title="Security">
                 <Button variant="outline"><Shield className="h-4 w-4 mr-2" />Change Password</Button>
              </Section>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 text-primary">{title}</h3>
      {children}
    </div>
  );
}

function StatDisplay({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-background p-4 rounded-lg shadow">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-accent">{value}</p>
        </div>
    );
}
