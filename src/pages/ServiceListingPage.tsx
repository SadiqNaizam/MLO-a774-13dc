import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Sidebar from '@/components/layout/Sidebar';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import JobRequestCard from '@/components/JobRequestCard';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, ListRestart } from 'lucide-react';

// Placeholder data - in a real app, this would come from an API
const allProviders = [
  { id: 'p1', name: 'John Doe Plumbing', serviceName: 'Plumber', location: 'New York, NY', rating: 4.8, reviewCount: 120, avatarUrl: 'https://via.placeholder.com/150/007BFF/FFFFFF?text=JD', bioShort: 'Expert plumbing services.', isVerified: true, hourlyRate: 75, availableNow: true, serviceType: "plumbing" },
  { id: 'p2', name: 'Sparky Electrics', serviceName: 'Electrician', location: 'Brooklyn, NY', rating: 4.5, reviewCount: 85, avatarUrl: 'https://via.placeholder.com/150/28A745/FFFFFF?text=SE', bioShort: 'Certified electricians.', isVerified: true, hourlyRate: 90, availableNow: false, serviceType: "electrical" },
  { id: 'p3', name: 'Clean Sweep Co.', serviceName: 'Home Cleaning', location: 'Queens, NY', rating: 4.9, reviewCount: 210, avatarUrl: 'https://via.placeholder.com/150/FFC107/000000?text=CS', bioShort: 'Professional cleaning.', isVerified: false, hourlyRate: 50, availableNow: true, serviceType: "cleaning" },
  { id: 'p4', name: 'Green Thumb Gardeners', serviceName: 'Gardening', location: 'New York, NY', rating: 4.2, reviewCount: 50, avatarUrl: 'https://via.placeholder.com/150/17A2B8/FFFFFF?text=GT', bioShort: 'Lawn care and landscaping.', isVerified: true, hourlyRate: 60, availableNow: false, serviceType: "gardening" },
];

const allJobRequests = [
    { id: 'j1', serviceName: 'Fix Leaky Faucet', status: 'Pending' as const, dateRequested: new Date().toISOString(), descriptionSnippet: 'Kitchen faucet dripping constantly, need it fixed ASAP.', providerName: undefined },
    { id: 'j2', serviceName: 'Install Ceiling Fan', status: 'AwaitingResponse' as const, dateRequested: new Date(Date.now() - 86400000).toISOString(), descriptionSnippet: 'New ceiling fan needs installation in the living room.', providerName: undefined },
];

type ViewMode = 'providers' | 'jobs';

const ServiceListingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating_desc');
  const [maxRate, setMaxRate] = useState<number[]>([200]);
  const [availableNow, setAvailableNow] = useState(false);
  const [serviceType, setServiceType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('providers'); // or 'jobs'

  const itemsPerPage = 6;

  console.log('ServiceListingPage loaded');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
    setCurrentLocation(params.get('location') || '');
    setServiceType(params.get('category') || '');
    if (params.get('view') === 'jobs') {
      setViewMode('jobs');
    } else {
      setViewMode('providers');
    }
  }, [location.search]);

  const filteredItems = (viewMode === 'providers' ? allProviders : allJobRequests).filter(item => {
    if (viewMode === 'providers') {
        const provider = item as typeof allProviders[0];
        const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || provider.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = provider.location?.toLowerCase().includes(currentLocation.toLowerCase());
        const matchesRate = provider.hourlyRate <= maxRate[0];
        const matchesAvailability = availableNow ? provider.availableNow : true;
        const matchesServiceType = serviceType ? provider.serviceType === serviceType : true;
        return matchesSearch && matchesLocation && matchesRate && matchesAvailability && matchesServiceType;
    } else {
        const job = item as typeof allJobRequests[0];
        const matchesSearch = job.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) || job.descriptionSnippet.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesServiceType = serviceType ? job.serviceName.toLowerCase().includes(serviceType.toLowerCase()) : true; // simple match for jobs
        return matchesSearch && matchesServiceType;
    }
  });
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (viewMode === 'providers') {
        const provA = a as typeof allProviders[0];
        const provB = b as typeof allProviders[0];
        if (sortBy === 'rating_desc') return (provB.rating || 0) - (provA.rating || 0);
        if (sortBy === 'rating_asc') return (provA.rating || 0) - (provB.rating || 0);
        if (sortBy === 'rate_asc') return provA.hourlyRate - provB.hourlyRate;
        if (sortBy === 'rate_desc') return provB.hourlyRate - provA.hourlyRate;
    } else {
        // Basic sort for jobs by date
        const jobA = a as typeof allJobRequests[0];
        const jobB = b as typeof allJobRequests[0];
        if (sortBy === 'date_desc') return new Date(jobB.dateRequested).getTime() - new Date(jobA.dateRequested).getTime();
        if (sortBy === 'date_asc') return new Date(jobA.dateRequested).getTime() - new Date(jobB.dateRequested).getTime();
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewProfile = (id: string) => navigate(`/provider-profile/${id}`);
  const handleViewJobDetails = (id: string) => navigate(`/job-details/${id}`); // Assuming a job details page

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setCurrentLocation('');
    setSortBy(viewMode === 'providers' ? 'rating_desc' : 'date_desc');
    setMaxRate([200]);
    setAvailableNow(false);
    setServiceType('');
    setCurrentPage(1);
    navigate('/service-listing' + (viewMode === 'jobs' ? '?view=jobs' : ''));
  };


  const FilterControls = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Filters</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {viewMode === 'providers' && (
            <>
              <div>
                <Label htmlFor="maxRate">Max Hourly Rate: ${maxRate[0]}</Label>
                <Slider id="maxRate" defaultValue={[200]} max={300} step={10} onValueChange={(value) => setMaxRate(value)} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="availableNow" checked={availableNow} onCheckedChange={(checked) => setAvailableNow(!!checked)} />
                <Label htmlFor="availableNow">Available Now</Label>
              </div>
            </>
          )}
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="gardening">Gardening</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={resetFilters} variant="outline" className="w-full">
            <ListRestart className="mr-2 h-4 w-4"/> Reset Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );


  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <Sidebar title="Filter Options" className="md:sticky md:top-20 h-fit"> {/* Adjust top based on nav height */}
          <FilterControls />
        </Sidebar>
        <main className="flex-1">
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Search services or providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Input
                placeholder="Location (e.g., city, zip)"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2">
                    <Button variant={viewMode === 'providers' ? 'default' : 'outline'} onClick={() => {setViewMode('providers'); setCurrentPage(1); setSortBy('rating_desc');}}>Providers</Button>
                    <Button variant={viewMode === 'jobs' ? 'default' : 'outline'} onClick={() => {setViewMode('jobs'); setCurrentPage(1); setSortBy('date_desc');}}>Job Posts</Button>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                    {viewMode === 'providers' ? (
                        <>
                        <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
                        <SelectItem value="rating_asc">Rating: Low to High</SelectItem>
                        <SelectItem value="rate_asc">Rate: Low to High</SelectItem>
                        <SelectItem value="rate_desc">Rate: High to Low</SelectItem>
                        </>
                    ) : (
                        <>
                        <SelectItem value="date_desc">Date: Newest First</SelectItem>
                        <SelectItem value="date_asc">Date: Oldest First</SelectItem>
                        </>
                    )}
                    </SelectContent>
                </Select>
            </div>
          </div>

          {paginatedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedItems.map(item =>
                viewMode === 'providers' ? (
                  <ServiceProviderCard key={item.id} {...(item as typeof allProviders[0])} onViewProfile={handleViewProfile} />
                ) : (
                  <JobRequestCard key={item.id} {...(item as typeof allJobRequests[0])} onViewDetails={handleViewJobDetails} />
                )
              )}
            </div>
          ) : (
            <Card className="text-center p-10">
              <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No {viewMode === 'providers' ? 'Providers' : 'Jobs'} Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </Card>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage - 1);}} className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => {
                   // Basic pagination, can be improved with ellipsis for many pages
                   if (totalPages <= 5 || (i === 0 || i === totalPages -1 || Math.abs(i - (currentPage-1)) <=1 )) {
                    return (
                        <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => {e.preventDefault(); handlePageChange(i + 1)}}>
                            {i + 1}
                        </PaginationLink>
                        </PaginationItem>
                    );
                   } else if (Math.abs(i - (currentPage-1)) === 2) {
                     return <PaginationEllipsis key={`ellipsis-${i}`} />;
                   }
                   return null;
                })}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage + 1)}} className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceListingPage;