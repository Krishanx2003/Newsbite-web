"use client"
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Define categories for feed preferences
const CATEGORIES = [
  "Technology",
  "Business",
  "Politics",
  "Science",
  "Health",
  "Entertainment",
  "Sports",
  "Environment",
];

interface PersonalizationCardProps {
  user: any;
  onPreferencesUpdate?: (preferences: string[]) => void;
}

export function PersonalizationCard({ user, onPreferencesUpdate }: PersonalizationCardProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSavePreferences = () => {
    if (onPreferencesUpdate) {
      onPreferencesUpdate(selectedCategories);
    }
  };

  return (
    <section className="mb-16">
      <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-blue-600/20 max-w-md mx-auto transition-opacity duration-300">
        <div className="h-16 w-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-montserrat font-bold text-gray-800 dark:text-gray-200 mb-2">
          {user ? "Personalize your feed" : "Sign in to personalize your feed"}
        </h3>
        <p className="text-base font-inter text-gray-700 dark:text-gray-300 text-center mb-6">
          Get news tailored to your interests and never miss the stories that matter to you.
        </p>
        {user ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white font-fredoka rounded-md px-4 py-2 transition-transform duration-200 hover:scale-105"
              >
                Pick Your Vibes
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Your Interests</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={category}>{category}</Label>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSavePreferences}
                  className="w-full bg-blue-600 hover:bg-blue-600/80 text-white font-fredoka rounded-md px-4 py-2 transition-transform duration-200 hover:scale-105"
                >
                  Save Preferences
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            asChild
            className="w-full bg-blue-600 hover:bg-blue-600/80 text-white font-fredoka rounded-md px-4 py-2 mb-2 transition-transform duration-200 hover:scale-105"
          >
            <a href="/login">Sign In</a>
          </Button>
        )}
      </div>
    </section>
  );
} 