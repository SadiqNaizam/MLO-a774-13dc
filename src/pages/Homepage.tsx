import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import ServiceCategorySelector from '@/components/ServiceCategorySelector';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Briefcase, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const placeholderCategories = [
  { id: '1', name: 'Plumbing' },
  { id: '2', name: 'Electrical' },
  { id: '3', name: 'Cleaning' },
  { id: '4', name: 'Gardening' },
  { id: '5', name: 'Appliance Repair' },
];

const placeholderProviders = [
  { id: 'p1', name: 'John Doe Plumbing', serviceName: 'Plumber', location: 'New York, NY', rating: 4.8, reviewCount: 120, avatarUrl: 'https://via.placeholder.com/150/007BFF/FFFFFF?text=JD', bioShort: 'Expert plumbing services for residential and commercial needs. 24/7 emergency support.', isVerified: true },
  { id: 'p2', name: 'Sparky Electrics', serviceName: 'Electrician', location: 'Brooklyn, NY', rating: 4.5, reviewCount: 85, avatarUrl: 'https://via.placeholder.com/150/28A745/FFFFFF?text=SE', bioShort: 'Certified electricians for all your wiring and installation projects.', isVerified: true },
  { id: 'p3', name: 'Clean Sweep Co.', serviceName: 'Home Cleaning', location: 'Queens, NY', rating: 4.9, reviewCount: 210, avatarUrl: 'https://via.placeholder.com/150/FFC107/000000?text=CS', bioShort: 'Professional and reliable home cleaning services. Eco-friendly options available.', isVerified: false },
];

const Homepage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  console.log('Homepage loaded');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm, 'in', locationTerm);
    navigate(`/service-listing?search=${searchTerm}&location=${locationTerm}${selectedCategory ? `&category=${selectedCategory}` : ''}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log('Category selected:', categoryId);
  };

  const handleViewProviderProfile = (id: string) => {
    navigate(`/provider-profile/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Find a Local Pro for Any Job</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with trusted service providers in your area. From plumbing to electrics, cleaning to gardening, we've got you covered.
            </p>
            <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  type="text"
                  placeholder="What service do you need? (e.g., plumber, electrician)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 text-base"
                />
                <Input
                  type="text"
                  placeholder="Enter your city or zip code"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
               <ServiceCategorySelector
                  categories={placeholderCategories}
                  selectedCategoryId={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  placeholder="Or select a service category"
                  label=""
                />
              <Button size="lg" className="w-full mt-4 h-12 text-base" onClick={handleSearch}>
                <Search className="mr-2 h-5 w-5" /> Search Providers
              </Button>
            </div>
          </div>
        </section>

        {/* Popular Categories Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Popular Service Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {placeholderCategories.map(category => (
                <Card key={category.id} className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/service-listing?category=${category.id}`)}>
                  <CardContent className="p-6">
                    <Briefcase className="h-10 w-10 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Providers Section */}
        <section className="py-12 md:py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Featured Service Providers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {placeholderProviders.map(provider => (
                <ServiceProviderCard
                  key={provider.id}
                  {...provider}
                  onViewProfile={handleViewProviderProfile}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Actions */}
        <section className="py-12 md:py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-3">Need a Service Done?</h2>
                <p className="text-lg mb-6">Post your job requirements and get quotes from qualified professionals.</p>
                <Button size="lg" variant="secondary" className="text-primary hover:bg-white/90" onClick={() => navigate('/job-posting')}>
                  <Briefcase className="mr-2 h-5 w-5" /> Post a Job
                </Button>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-3">Are You a Service Provider?</h2>
                <p className="text-lg mb-6">Join our platform to reach more clients and grow your business.</p>
                <Button size="lg" variant="secondary" className="text-primary hover:bg-white/90" onClick={() => navigate('/provider-signup')}> {/* Assuming a provider signup page */}
                  <UserPlus className="mr-2 h-5 w-5" /> Join as a Provider
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;