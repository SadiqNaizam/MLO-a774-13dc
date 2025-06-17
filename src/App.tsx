import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import ServiceListingPage from "./pages/ServiceListingPage";
import ProviderProfilePage from "./pages/ProviderProfilePage";
import JobPostingPage from "./pages/JobPostingPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/service-listing" element={<ServiceListingPage />} />
          <Route path="/provider-profile/:id" element={<ProviderProfilePage />} />
          <Route path="/job-posting" element={<JobPostingPage />} />
          {/* Example route for editing a job post */}
          <Route path="/job-posting/:jobId/edit" element={<JobPostingPage />} /> 
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
          
          {/* Placeholder for other potential routes based on user journey like /login, /signup, /job-details/:id */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="/signup" element={<SignupPage />} /> */}
          {/* <Route path="/job-details/:id" element={<JobDetailsPage />} /> */}


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;