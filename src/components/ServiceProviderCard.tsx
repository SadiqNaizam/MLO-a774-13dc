import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Briefcase } from 'lucide-react'; // Example icons
// Import ReviewStarsInput if it's ready and needed for display within this card
// import ReviewStarsInput from './ReviewStarsInput'; 

interface ServiceProviderCardProps {
  id: string;
  name: string;
  serviceName: string;
  location?: string;
  rating?: number; // e.g., 4.5
  reviewCount?: number;
  avatarUrl?: string;
  bioShort?: string;
  isVerified?: boolean;
  onViewProfile: (id: string) => void;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  id,
  name,
  serviceName,
  location,
  rating,
  reviewCount,
  avatarUrl,
  bioShort,
  isVerified,
  onViewProfile,
}) => {
  console.log("Rendering ServiceProviderCard for:", name);

  const getInitials = (nameStr: string) => {
    const names = nameStr.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <Card className="w-full overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl">{name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="mr-1 h-4 w-4" /> {serviceName}
          </div>
          {isVerified && <Badge variant="secondary" className="mt-1 w-fit">Verified</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        {bioShort && <CardDescription className="line-clamp-2 text-sm">{bioShort}</CardDescription>}
        <div className="flex flex-col space-y-1 text-sm">
          {location && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{location}</span>
            </div>
          )}
          {rating !== undefined && (
            <div className="flex items-center text-muted-foreground">
              <Star className="mr-2 h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              <span>{rating.toFixed(1)} {reviewCount && `(${reviewCount} reviews)`}</span>
              {/* Alternatively, use ReviewStarsInput for display: 
              <ReviewStarsInput rating={rating} readOnly={true} size="sm" />
              */}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => onViewProfile(id)}>
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};
export default ServiceProviderCard;