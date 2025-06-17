import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Sidebar from '@/components/layout/Sidebar';
import JobRequestCard from '@/components/JobRequestCard';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Edit, Mail, MessageSquare, Settings, UserCircle, PlusCircle } from 'lucide-react';

// Mock data for user
const mockUser = {
  name: "Alice Wonderland",
  email: "alice@example.com",
  avatarUrl: "https://via.placeholder.com/100?text=AW",
  isProvider: false, // or true
  bio: "Looking for reliable services for my home projects. Also a part-time gardener offering services.",
  location: "New York, NY",
  phone: "555-0101-0101"
};

const mockClientJobs = [
  { id: 'j1', serviceName: 'Fix Leaky Faucet', status: 'Pending' as const, dateRequested: '2023-11-01', descriptionSnippet: 'Kitchen faucet dripping constantly.', onViewDetails: () => {}, onEdit: () => {}, onCancel: () => {} },
  { id: 'j2', serviceName: 'Paint Living Room', status: 'Accepted' as const, providerName: 'Painter Pro', dateRequested: '2023-10-15', descriptionSnippet: 'Need living room (12x15ft) painted.', onViewDetails: () => {}, onChat: () => {} },
  { id: 'j3', serviceName: 'Garden Weeding', status: 'Completed' as const, providerName: 'Green Thumb', dateRequested: '2023-09-05', descriptionSnippet: 'Full garden weeding and cleanup.', onViewDetails: () => {} },
];

const mockProviderServices = [
  { id: 'ps1', name: 'Alice Wonderland', serviceName: 'Gardening Services', location: 'New York, NY', rating: 4.7, reviewCount: 15, avatarUrl: mockUser.avatarUrl, bioShort: 'Organic gardening and lawn care.', isVerified: true, onViewProfile: () => {} },
];

const mockProviderJobFeed = [
    { id: 'fj1', serviceName: 'Lawn Mowing Needed', status: 'Pending' as const, dateRequested: new Date().toISOString(), descriptionSnippet: 'Weekly lawn mowing for a medium-sized yard.', onViewDetails: () => {}, onChat: () => {} },
    { id: 'fj2', serviceName: 'Tree Trimming', status: 'AwaitingResponse' as const, dateRequested: new Date(Date.now() - 86400000 * 2).toISOString(), descriptionSnippet: 'Need several branches trimmed from a large oak tree.', onViewDetails: () => {} },
];


const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  // For providers:
  serviceName: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
});
type ProfileFormData = z.infer<typeof profileSchema>;


const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(mockUser); // In real app, fetch authenticated user
  const [activeTab, setActiveTab] = useState('my-jobs'); // Default tab

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/user-dashboard?tab=${value}`);
  }

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      serviceName: user.isProvider ? "My Awesome Service" : undefined, // Example
      hourlyRate: user.isProvider ? 50 : undefined, // Example
    },
  });
  
  const onProfileSubmit = (data: ProfileFormData) => {
    console.log('Profile Update:', data);
    setUser(prev => ({ ...prev, ...data }));
    alert('Profile updated successfully! (Placeholder)');
  };

  console.log('UserDashboardPage loaded, active tab:', activeTab);

  const getInitials = (nameStr: string) => {
    const names = nameStr.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const DashboardSidebar = () => (
     <div className="space-y-2">
        <Button variant={activeTab === 'my-profile' ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange('my-profile')}>
            <UserCircle className="mr-2 h-4 w-4" /> My Profile
        </Button>
        {user.isProvider ? (
            <>
                <Button variant={activeTab === 'my-services' ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange('my-services')}>
                    <Briefcase className="mr-2 h-4 w-4" /> My Services
                </Button>
                 <Button variant={activeTab === 'job-feed' ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange('job-feed')}>
                    <Briefcase className="mr-2 h-4 w-4" /> Job Feed
                </Button>
            </>
        ) : (
            <Button variant={activeTab === 'my-jobs' ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange('my-jobs')}>
                <Briefcase className="mr-2 h-4 w-4" /> My Job Requests
            </Button>
        )}
        <Button variant={activeTab === 'messages' ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange('messages')}>
            <MessageSquare className="mr-2 h-4 w-4" /> Messages <Badge variant="destructive" className="ml-auto">3</Badge>
        </Button>
        <Button variant={activeTab === 'settings' ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleTabChange('settings')}>
            <Settings className="mr-2 h-4 w-4" /> Account Settings
        </Button>
     </div>
  );


  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
          <Sidebar title="Dashboard Menu" className="md:sticky md:top-20 h-fit min-w-[250px]"> {/* Adjust top based on nav height */}
            <DashboardSidebar />
          </Sidebar>

        <main className="flex-1">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {/* TabsList can be hidden if sidebar controls tabs, or used for sub-navigation within a main section */}
            {/* <TabsList className="mb-4 grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
              <TabsTrigger value="my-profile">Profile</TabsTrigger>
              ...
            </TabsList> */}
            
            {/* Client Tabs */}
            {!user.isProvider && (
              <TabsContent value="my-jobs">
                <Card>
                  <CardHeader>
                    <CardTitle>My Job Requests</CardTitle>
                    <CardDescription>Track and manage jobs you've posted.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockClientJobs.length > 0 ? mockClientJobs.map(job => (
                      <JobRequestCard key={job.id} {...job} 
                        onViewDetails={(id) => navigate(`/job-details/${id}`)}
                        onEdit={(id) => navigate(`/job-posting/${id}/edit`)} // Example edit route
                        onCancel={(id) => alert(`Cancel job ${id}`)}
                        onChat={(id) => alert(`Chat about job ${id}`)}
                      />
                    )) : <p>You haven't posted any jobs yet. <Button variant="link" onClick={() => navigate('/job-posting')}>Post a Job</Button></p>}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => navigate('/job-posting')}><PlusCircle className="mr-2 h-4 w-4" /> Post New Job</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            )}

            {/* Provider Tabs */}
            {user.isProvider && (
              <>
                <TabsContent value="my-services">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Services</CardTitle>
                      <CardDescription>Manage the services you offer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockProviderServices.length > 0 ? mockProviderServices.map(service => (
                        <ServiceProviderCard key={service.id} {...service} onViewProfile={(id) => navigate(`/provider-profile/${id}`)} />
                      )) : <p>You haven't listed any services yet. <Button variant="link">Add a Service</Button></p>}
                    </CardContent>
                     <CardFooter>
                        <Button onClick={() => alert("Navigate to add/edit service form")}><PlusCircle className="mr-2 h-4 w-4" /> Add New Service</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="job-feed">
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Job Postings</CardTitle>
                            <CardDescription>Browse and bid on jobs relevant to your services.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockProviderJobFeed.length > 0 ? mockProviderJobFeed.map(job => (
                                <JobRequestCard key={job.id} {...job} 
                                    onViewDetails={(id) => navigate(`/job-details/${id}?mode=provider`)}
                                    // Providers might have a "Bid" button instead of Edit/Cancel
                                />
                            )) : <p>No new job postings matching your profile currently.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
              </>
            )}
            
            {/* Common Tabs */}
            <TabsContent value="my-profile">
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>Update your personal information and preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline"><Edit className="mr-2 h-4 w-4" /> Change Photo</Button>
                      </div>
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input type="tel" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location (City, State)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="bio" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio / About Me</FormLabel>
                          <FormControl><Textarea {...field} rows={4} placeholder="Tell us a bit about yourself or your services..." /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      {user.isProvider && (
                        <>
                           <FormField control={form.control} name="serviceName" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Main Service Offered (Providers)</FormLabel>
                              <FormControl><Input {...field} placeholder="e.g., Professional Plumbing Services" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                           <FormField control={form.control} name="hourlyRate" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Standard Hourly Rate (Providers, optional)</FormLabel>
                              <FormControl><Input type="number" {...field} placeholder="e.g., 60" onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}/></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </>
                      )}
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
                <Card>
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                        <CardDescription>Your conversations with clients or providers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Message interface would go here. (Coming Soon)</p>
                        {/* Placeholder for message list and chat interface */}
                        <div className="mt-4 border rounded-md p-4 h-64 flex items-center justify-center bg-muted/50">
                            <Mail className="h-12 w-12 text-muted-foreground"/>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

             <TabsContent value="settings">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your notification preferences, password, and payment methods.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Account settings form would go here. (Coming Soon)</p>
                        <div className="mt-4 border rounded-md p-4 h-64 flex items-center justify-center bg-muted/50">
                            <Settings className="h-12 w-12 text-muted-foreground"/>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboardPage;