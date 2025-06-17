import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from "@/components/ui/card"; // Optional: to wrap content
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  slides: React.ReactNode[]; // Array of JSX elements or components for slides
  options?: Parameters<typeof useEmblaCarousel>[0];
  autoplayOptions?: Parameters<typeof Autoplay>[0];
  showArrows?: boolean;
  showDots?: boolean;
  slideClassName?: string; // Custom class for each slide container
  containerClassName?: string; // Custom class for the embla__container
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  options = { loop: true },
  autoplayOptions = { delay: 4000, stopOnInteraction: false },
  showArrows = true,
  showDots = true,
  slideClassName,
  containerClassName,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay(autoplayOptions)]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  console.log("Rendering Carousel with", slides.length, "slides.");

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect(); // Set initial selected index
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = React.useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  if (!slides || slides.length === 0) {
    return <div className="text-center text-muted-foreground p-4">No items to display in carousel.</div>;
  }

  return (
    <div className="embla relative" ref={emblaRef}>
      <div className={cn("embla__container flex", containerClassName)}>
        {slides.map((slide, index) => (
          <div className={cn("embla__slide flex-[0_0_100%] min-w-0", slideClassName)} key={index}>
            {/* Example: Wrap slide content in shadcn Card for consistent styling, or user provides styled content directly */}
            {/* <Card className="m-1 h-full">
                <CardContent className="flex aspect-video items-center justify-center p-2 h-full">
                   {slide}
                </CardContent>
            </Card> */}
            {slide}
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="embla__prev absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-80 hover:opacity-100"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="embla__next absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-80 hover:opacity-100"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="embla__dots absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "embla__dot h-2 w-2 rounded-full transition-all duration-300",
                index === selectedIndex ? 'bg-primary w-4' : 'bg-muted-foreground/50 hover:bg-muted-foreground'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Carousel;