import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import ServiceCategorySelector from '@/components/ServiceCategorySelector';
import Footer from '@/components/layout/Footer';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"; // Using shadcn form components
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';


const placeholderCategories = [
  { id: '1', name: 'Plumbing' },
  { id: '2', name: 'Electrical' },
  { id: '3', name: 'Cleaning' },
  { id: '4', name: 'Appliance Repair' },
  { id: '5', name: 'Painting' },
  { id: '6', name: 'Other' },
];

const jobPostingSchema = z.object({
  jobTitle: z.string().min(5, "Job title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  categoryId: z.string().min(1, "Please select a service category"),
  location: z.string().min(3, "Location is required"),
  preferredDate: z.date().optional(),
  contactPhone: z.string().min(10, "A valid phone number is required").optional(),
  phoneOtp: z.string().length(6, "OTP must be 6 digits").optional(),
  budget: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Budget must be a number"}).min(0, "Budget cannot be negative").optional()
  ),
  // files: typeof window !== 'undefined' ? z.instanceof(FileList).optional() : z.any().optional(),
});

type JobPostingFormData = z.infer<typeof jobPostingSchema>;

const JobPostingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const providerId = queryParams.get('providerId');

  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  console.log('JobPostingPage loaded');
  if (providerId) {
    console.log('Targeting provider ID:', providerId);
  }

  const form = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      jobTitle: '',
      description: '',
      categoryId: '',
      location: '',
      preferredDate: undefined,
      contactPhone: '',
      phoneOtp: '',
      budget: undefined,
    },
  });

  const onSubmit = (data: JobPostingFormData) => {
    console.log('Job Posting Submitted:', {...data, files: selectedFiles, providerId});
    // Handle form submission, e.g., API call
    // If OTP was part of flow, it should be verified server-side
    alert('Job posting submitted successfully! (Placeholder)');
    navigate('/user-dashboard?tab=my-jobs'); // Redirect to dashboard
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const requestOtp = () => {
    const phone = form.getValues("contactPhone");
    if(phone && phone.length >= 10) {
        console.log("Requesting OTP for phone:", phone);
        setIsOtpRequested(true);
        // In a real app, call API to send OTP
        alert("OTP sent to your phone (mock)");
    } else {
        form.setError("contactPhone", { type: "manual", message: "Please enter a valid phone number to receive OTP." });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Post a New Job</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Describe Your Service Need</CardTitle>
            <CardDescription>
              Provide as much detail as possible to get accurate quotes from service providers.
              {providerId && <span className="block mt-1 text-primary">This request will be sent directly to a specific provider.</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl><Input placeholder="e.g., Fix Leaky Kitchen Faucet, Install Ceiling Fan" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl><Textarea placeholder="Describe the issue, what needs to be done, any specific requirements..." {...field} rows={5} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Controller
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <ServiceCategorySelector
                            categories={placeholderCategories}
                            selectedCategoryId={field.value}
                            onCategoryChange={field.onChange}
                            placeholder="Select the type of service needed"
                        />
                        <FormMessage>{form.formState.errors.categoryId?.message}</FormMessage>
                        </FormItem>
                    )}
                />


                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Address or Zip Code)</FormLabel>
                      <FormControl><Input placeholder="e.g., 123 Main St, Anytown or 90210" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Budget (Optional)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 150" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl>
                      <FormDescription>Enter an amount if you have a budget in mind.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Preferred Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel htmlFor="file-upload">Upload Images (Optional)</FormLabel>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="file-upload" className="flex items-center gap-2 cursor-pointer text-sm text-primary hover:underline">
                        <Upload className="h-4 w-4" />
                        <span>{selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Choose files"}</span>
                    </Label>
                    <Input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />
                  </div>
                  {selectedFiles.length > 0 && (
                    <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside">
                      {selectedFiles.map(file => <li key={file.name}>{file.name} ({(file.size / 1024).toFixed(1)}KB)</li>)}
                    </ul>
                  )}
                  <FormDescription>Attach photos or videos related to the job (max 5MB each).</FormDescription>
                </FormItem>

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone (Optional, for updates)</FormLabel>
                      <div className="flex gap-2">
                        <FormControl><Input type="tel" placeholder="Your phone number" {...field} /></FormControl>
                        {!isOtpRequested && 
                            <Button type="button" variant="outline" onClick={requestOtp} disabled={!field.value || field.value.length < 10}>
                                Send OTP
                            </Button>
                        }
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isOtpRequested && (
                  <FormField
                    control={form.control}
                    name="phoneOtp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter OTP</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>Enter the 6-digit code sent to your phone.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Submitting..." : "Submit Job Request"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default JobPostingPage;