import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Challenge } from "@/types/domain";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import { PlusCircle, Search, Filter, Zap } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data fetching
const mockChallenges: Challenge[] = [
  {
    id: "challenge1",
    name: "30-Day Summer Shred",
    description: "Get ready for summer with this intense 30-day shredding challenge. Focus on fat loss and muscle definition.",
    duration: "30 days",
    objective: "Lose 3-5kg and improve definition",
    entryFee: 100,
    creatorId: "user123",
    participants: [{ id: "p1", userId: "u1", name: "Alice" }, { id: "p2", userId: "u2", name: "Bob" }],
    status: "active",
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    endDate: new Date(Date.now() + 86400000 * 20).toISOString(), // 20 days from now
    coverImageUrl: "https://placehold.co/600x300.png?text=Summer+Shred",
  },
  {
    id: "challenge2",
    name: "Muscle Gain Marathon",
    description: "A 12-week program designed to maximize muscle hypertrophy and strength.",
    duration: "12 weeks",
    objective: "Gain 2kg muscle mass",
    entryFee: 200,
    creatorId: "expert2",
    participants: [],
    status: "upcoming",
    startDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    endDate: new Date(Date.now() + 86400000 * (7 + 12 * 7)).toISOString(),
    coverImageUrl: "https://placehold.co/600x300.png?text=Muscle+Gain",
  },
  {
    id: "challenge3",
    name: "Waist Trimmer Challenge",
    description: "Reduce your waistline and improve core strength in just 4 weeks.",
    duration: "4 weeks",
    objective: "Reduce 5cm waist",
    entryFee: 50,
    creatorId: "user456",
    participants: Array(15).fill(null).map((_,i) => ({id: `p${i}`, userId: `u${i}`, name: `User ${i}`})),
    status: "completed",
    startDate: new Date(Date.now() - 86400000 * 40).toISOString(), 
    endDate: new Date(Date.now() - 86400000 * 12).toISOString(),
    winnerId: "userparticipant7",
    prizePool: 750,
    coverImageUrl: "https://placehold.co/600x300.png?text=Waist+Trimmer",
  },
];


export default function ChallengesPage() {
  // TODO: Implement search and filter logic
  const challenges = mockChallenges;

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="mb-8 shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
              <Zap className="h-8 w-8 mr-3 text-primary" /> Fitness Challenges
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Join existing challenges or create your own to compete and achieve your goals.
            </CardDescription>
          </div>
          <Link href="/challenges/create" passHref legacyBehavior>
            <Button size="lg" className="mt-4 md:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Challenge
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search challenges by name or objective..." className="pl-10" />
            </div>
            <Select defaultValue="active">
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Zap className="h-24 w-24 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-xl text-muted-foreground mb-2">No challenges found.</p>
          <p className="text-foreground/70">Why not create the first one?</p>
        </div>
      )}
    </div>
  );
}
