import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import ReviewStarsInput from '@/components/ReviewStarsInput';
import Carousel from '@/components/Carousel';
import Footer from '@/components/layout/Footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea'; // For review form

// Placeholder data - fetch based on `id` param in real app
const sampleProvider = {
  id: 'p1',
  name: 'John Doe Plumbing',
  serviceName: 'Plumbing Expert',
  avatarUrl: 'https://via.placeholder.com/200/007BFF/FFFFFF?text=JD',
  isVerified: true,
  memberSince: '2022-05-15',
  location: 'New York, NY',
  phone: '555-123-4567',
  email: 'john.doe@example.com',
  rating: 4.8,
  reviewCount: 120,
  bioLong: "With over 10 years of experience, John Doe Plumbing offers comprehensive plumbing solutions for residential and commercial clients. We specialize in emergency repairs, installations, and routine maintenance. Our team is committed to providing high-quality workmanship and excellent customer service. We are fully licensed, insured, and dedicated to solving your plumbing problems efficiently and effectively. Customer satisfaction is our top priority!",
  services: [
    { id: 's1', name: 'Emergency Leak Repair', description: '24/7 response for urgent water leaks.' },
    { id: 's2', name: 'Drain Unblocking', description: 'Clearing clogged drains and pipes.' },
    { id: 's3', name: 'Fixture Installation', description: 'Installation of faucets, toilets, showers, etc.' },
    { id: 's4', name: 'Water Heater Services', description: 'Repair and installation of water heaters.' },
  ],
  portfolioImages: [
    <img src="https://via.placeholder.com/600x400.png?text=Project+Alpha" alt="Project Alpha" className="object-cover w-full h-64 md:h-96" />,
    <img src="https://via.placeholder.com/600x400.png?text=Project+Beta" alt="Project Beta" className="object-cover w-full h-64 md:h-96" />,
    <img src="https://via.placeholder.com/600x400.png?text=Project+Gamma" alt="Project Gamma" className="object-cover w-full h-64 md:h-96" />,
  ],
  reviews: [
    { id: 'r1', userName: 'Alice B.', userAvatar: 'https://via.placeholder.com/40?text=AB', rating: 5, date: '2023-10-15', comment: 'John was fantastic! Fixed my leaky pipe in no time. Very professional and friendly.' },
    { id: 'r2', userName: 'Bob C.', userAvatar: 'https://via.placeholder.com/40?text=BC', rating: 4, date: '2023-09-20', comment: 'Good service, reasonably priced. Would recommend for drain issues.' },
    { id: 'r3', userName: 'Carol D.', userAvatar: 'https://via.placeholder.com/40?text=CD', rating: 5, date: '2023-08-01', comment: 'Excellent work installing our new water heater. Very tidy and efficient.' },
  ],
};

type Review = typeof sampleProvider.reviews[0];

const ProviderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(sampleProvider); // In real app, fetch by id
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');

  console.log('ProviderProfilePage loaded for ID:', id);
  // useEffect to fetch provider data if `id` changes or on initial load

  const handleRequestQuote = () => {
    console.log('Requesting quote from provider:', provider.id);
    // Navigate to a quote request page or open a dialog
    navigate(`/job-posting?providerId=${provider.id}`);
  };
  
  const handleNewReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewRating === 0 || !newReviewComment.trim()) {
        alert("Please provide a rating and a comment.");
        return;
    }
    const newReview: Review = {
        id: `r${Date.now()}`,
        userName: "Current User", // Placeholder
        userAvatar: `https://via.placeholder.com/40?text=CU`,
        rating: newReviewRating,
        date: new Date().toISOString().split('T')[0],
        comment: newReviewComment,
    };
    setProvider(prev => ({...prev!, reviews: [newReview, ...prev!.reviews]}));
    setNewReviewRating(0);
    setNewReviewComment('');
    console.log("New review submitted:", newReview);
  };

  if (!provider) return <div className="flex justify-center items-center h-screen">Loading provider profile...</div>;

  const getInitials = (nameStr: string) => {
    const names = nameStr.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/service-listing')}>Services</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{provider.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
                <AvatarImage src={provider.avatarUrl} alt={provider.name} />
                <AvatarFallback className="text-4xl">{getInitials(provider.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{provider.name}</h1>
                <p className="text-lg text-muted-foreground mb-2">{provider.serviceName}</p>
                <div className="flex items-center gap-4 mb-3">
                  <ReviewStarsInput rating={provider.rating} readOnly size="md" />
                  <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                </div>
                {provider.isVerified && <Badge variant="default" className="bg-green-600 hover:bg-green-700"><ShieldCheck className="mr-1 h-4 w-4" /> Verified Provider</Badge>}
              </div>
              <Button size="lg" onClick={handleRequestQuote} className="mt-4 md:mt-0 w-full md:w-auto">
                Request Quote
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 grid md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-primary"/>
                <span>{provider.location}</span>
            </div>
            <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-primary"/>
                <span>{provider.phone}</span>
            </div>
            <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-primary"/>
                <span>{provider.email}</span>
            </div>
             <div className="flex items-center col-span-1 md:col-span-3">
                <CalendarDays className="mr-3 h-5 w-5 text-primary"/>
                <span>Member since: {new Date(provider.memberSince).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="about">About & Services</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({provider.reviews.length})</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader><CardTitle>About {provider.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 whitespace-pre-line">{provider.bioLong}</p>
                <h3 className="text-xl font-semibold mb-3">Services Offered</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {provider.services.map(service => (
                    <li key={service.id}>
                      <span className="font-medium text-foreground">{service.name}:</span> {service.description}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader><CardTitle>Portfolio / Work Samples</CardTitle></CardHeader>
              <CardContent>
                {provider.portfolioImages.length > 0 ? (
                  <Carousel slides={provider.portfolioImages} options={{ loop: true }} showDots={true} showArrows={true} />
                ) : (
                  <p className="text-muted-foreground">No portfolio images available yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader><CardTitle>Client Reviews</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Leave a Review</h4>
                  <form onSubmit={handleNewReviewSubmit} className="space-y-4 p-4 border rounded-md bg-background">
                    <ReviewStarsInput
                        label="Your Rating:"
                        rating={newReviewRating}
                        onRatingChange={setNewReviewRating}
                        size="md"
                    />
                    <Textarea
                        placeholder="Share your experience with this provider..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        rows={4}
                    />
                    <Button type="submit">Submit Review</Button>
                  </form>
                </div>
                <hr/>
                {provider.reviews.length > 0 ? provider.reviews.map(review => (
                  <Card key={review.id} className="bg-background">
                    <CardHeader className="flex flex-row items-start gap-3 p-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <ReviewStarsInput rating={review.rating} readOnly size="sm" />
                      </div>
                      <p className="ml-auto text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                )) : <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                 <p className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary"/> Location: {provider.location}</p>
                 <p className="flex items-center"><Phone className="mr-2 h-5 w-5 text-primary"/> Phone: {provider.phone}</p>
                 <p className="flex items-center"><Mail className="mr-2 h-5 w-5 text-primary"/> Email: <a href={`mailto:${provider.email}`} className="text-blue-600 hover:underline">{provider.email}</a></p>
                 <Button onClick={handleRequestQuote} className="mt-4">
                    <Mail className="mr-2 h-4 w-4"/> Send a Message / Request Quote
                 </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default ProviderProfilePage;