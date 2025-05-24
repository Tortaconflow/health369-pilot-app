import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expert } from "@/types/domain";
import { Search, Filter } from "lucide-react";
import ExpertCard from "@/components/experts/ExpertCard";

// Mock data - replace with actual data fetching
const mockExperts: Expert[] = [
  {
    id: "expert1",
    name: "Dr. Emily Carter",
    specialty: "Nutritionist",
    avatarUrl: "https://placehold.co/150x150.png",
    bio: "Dedicated nutritionist with 10+ years of experience in personalized diet plans and wellness coaching.",
    rating: 4.9,
    experienceYears: 10,
    certifications: ["Registered Dietitian Nutritionist (RDN)", "Certified Nutrition Specialist (CNS)"],
  },
  {
    id: "expert2",
    name: "John Davis",
    specialty: "Personal Trainer",
    avatarUrl: "https://placehold.co/150x150.png",
    bio: "Certified personal trainer focused on strength training and functional fitness. Helping clients achieve their peak physical condition.",
    rating: 4.7,
    experienceYears: 8,
    certifications: ["ACE Certified Personal Trainer", "NSCA Certified Strength and Conditioning Specialist (CSCS)"],
  },
  {
    id: "expert3",
    name: "Sophia Lee",
    specialty: "Yoga Instructor & Mindfulness Coach",
    avatarUrl: "https://placehold.co/150x150.png",
    bio: "Experienced yoga instructor integrating mindfulness practices for holistic well-being.",
    rating: 4.8,
    experienceYears: 7,
    certifications: ["RYT 500", "Certified Mindfulness Coach"],
  },
   {
    id: "expert4",
    name: "Marcus Chen",
    specialty: "Sports Performance Coach",
    avatarUrl: "https://placehold.co/150x150.png",
    bio: "Specializing in enhancing athletic performance through tailored training programs and nutritional advice.",
    rating: 4.9,
    experienceYears: 12,
    certifications: ["CSCS", "Certified Sports Nutritionist (CISSN)"],
  },
];

export default function ExpertsPage() {
  // TODO: Implement search and filter logic
  const experts = mockExperts;

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Connect with Experts</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find verified trainers, nutritionists, and wellness coaches to guide you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search experts by name or specialty..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="nutritionist">Nutritionist</SelectItem>
                <SelectItem value="trainer">Personal Trainer</SelectItem>
                <SelectItem value="yoga">Yoga Instructor</SelectItem>
                <SelectItem value="mindfulness">Mindfulness Coach</SelectItem>
                <SelectItem value="sports-performance">Sports Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {experts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No experts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
