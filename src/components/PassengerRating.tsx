import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Star, 
  StarHalf, 
  Heart, 
  ThumbsUp, 
  MessageCircle, 
  Send,
  User
} from "@phosphor-icons/react";

interface PassengerRatingProps {
  passenger: {
    id: string;
    name: string;
    rating: number;
    tripCount: number;
  };
  tripDetails: {
    fare: number;
    distance: number;
    duration: number;
  };
  onSubmitRating: (rating: number, feedback?: string, tip?: number) => void;
  onClose: () => void;
}

export function PassengerRating({ passenger, tripDetails, onSubmitRating, onClose }: PassengerRatingProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tip, setTip] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const positiveTagOptions = [
    "Friendly", "Polite", "On time", "Clean", "Easy pickup", 
    "Great conversation", "Respectful", "Patient", "Tipped well"
  ];

  const negativeTagOptions = [
    "Late", "Rude", "Messy", "Wrong location", "Difficult to find",
    "Inappropriate behavior", "No show", "Payment issues"
  ];

  const tagOptions = rating >= 4 ? positiveTagOptions : negativeTagOptions;

  const tipOptions = [
    { label: "No tip", value: undefined },
    { label: "$2", value: 2 },
    { label: "$5", value: 5 },
    { label: "$10", value: 10 },
    { label: "Custom", value: "custom" }
  ];

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starRating = index + 1;
      const isHovered = hoveredRating >= starRating;
      const isSelected = rating >= starRating;
      
      return (
        <button
          key={index}
          className="p-1 transition-transform hover:scale-110"
          onMouseEnter={() => setHoveredRating(starRating)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starRating)}
        >
          <Star 
            size={32} 
            weight={isHovered || isSelected ? "fill" : "regular"}
            className={`transition-colors ${
              isHovered || isSelected 
                ? starRating <= 2 ? "text-red-500" 
                  : starRating <= 3 ? "text-yellow-500"
                  : "text-green-500"
                : "text-muted-foreground"
            }`}
          />
        </button>
      );
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmitRating(rating, feedback, tip);
      toast.success("Rating submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingMessage = () => {
    switch (rating) {
      case 1: return "What went wrong?";
      case 2: return "How could it be better?";
      case 3: return "It was okay";
      case 4: return "Good experience!";
      case 5: return "Excellent passenger!";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
            <Star size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Rate Your Passenger</h2>
            <p className="text-sm text-muted-foreground">Help improve the community</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Skip
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {passenger.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{passenger.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star size={14} weight="fill" className="text-yellow-500" />
                  <span>{passenger.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{passenger.tripCount} trips</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Trip Summary */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-3">Trip Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">${tripDetails.fare.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Fare</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{tripDetails.distance.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Miles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{tripDetails.duration}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="text-center space-y-3">
            <h4 className="font-medium">How was your experience?</h4>
            <div className="flex justify-center gap-1">
              {renderStars()}
            </div>
            <p className="text-sm text-muted-foreground">{getRatingMessage()}</p>
          </div>

          {/* Quick Tags */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Quick feedback (optional)</h4>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer transition-colors hover:bg-primary/10"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Written Feedback */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Additional comments (optional)</h4>
            <Textarea
              placeholder="Share more details about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Tip Section */}
          {rating >= 4 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Heart size={16} className="text-red-500" />
                Say thanks with a tip (optional)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {tipOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={tip === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTip(option.value)}
                    className="justify-center"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              {tip === "custom" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="flex-1 px-3 py-2 border rounded-md"
                    onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                  />
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Submit Rating
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}