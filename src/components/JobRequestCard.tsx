import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Tag, MessageSquare, Edit3, Trash2 } from 'lucide-react'; // Example icons

type JobStatus = 'Pending' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled' | 'AwaitingResponse';

interface JobRequestCardProps {
  id: string;
  serviceName: string;
  providerName?: string; // Optional, if assigned
  status: JobStatus;
  dateRequested: string; // Or Date object, format as needed
  descriptionSnippet: string;
  onViewDetails: (id: string) => void;
  onEdit?: (id: string) => void; // Optional edit action
  onCancel?: (id: string) => void; // Optional cancel action
  onChat?: (id: string) => void; // Optional chat action
}

const getStatusBadgeVariant = (status: JobStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Accepted':
    case 'InProgress':
    case 'Completed':
      return "default"; // Typically green or blue via custom CSS
    case 'Pending':
    case 'AwaitingResponse':
      return "secondary"; // Yellow or orange
    case 'Cancelled':
      return "destructive"; // Red
    default:
      return "outline";
  }
};

const JobRequestCard: React.FC<JobRequestCardProps> = ({
  id,
  serviceName,
  providerName,
  status,
  dateRequested,
  descriptionSnippet,
  onViewDetails,
  onEdit,
  onCancel,
  onChat,
}) => {
  console.log("Rendering JobRequestCard for:", serviceName, "status:", status);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{serviceName}</CardTitle>
          <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
        </div>
        <CardDescription className="text-sm">
          Requested on: {new Date(dateRequested).toLocaleDateString()}
          {providerName && ` | Provider: ${providerName}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{descriptionSnippet}</p>
        <div className="flex items-center text-xs text-muted-foreground pt-1">
          <Tag className="mr-1 h-3 w-3" /> Job ID: {id}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end">
        {onChat && <Button variant="outline" size="sm" onClick={() => onChat(id)}><MessageSquare className="mr-1 h-4 w-4"/> Chat</Button>}
        {onEdit && <Button variant="outline" size="sm" onClick={() => onEdit(id)}><Edit3 className="mr-1 h-4 w-4"/> Edit</Button>}
        {onCancel && <Button variant="destructive" size="sm" onClick={() => onCancel(id)}><Trash2 className="mr-1 h-4 w-4"/> Cancel</Button>}
        <Button size="sm" onClick={() => onViewDetails(id)}>View Details</Button>
      </CardFooter>
    </Card>
  );
};
export default JobRequestCard;