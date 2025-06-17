import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // For conditional class names

interface SidebarProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, title, className }) => {
  console.log("Rendering Sidebar with title:", title);

  return (
    <aside className={cn("w-full md:w-64 lg:w-72 space-y-6 p-4 border-r hidden md:block h-full sticky top-16", className)}> {/* Adjust top based on nav height */}
      {title && (
        <>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          <Separator />
        </>
      )}
      <ScrollArea className="h-[calc(100vh-12rem)] pr-3"> {/* Adjust height as needed */}
        <div className="space-y-4">
          {children ? children : (
            <p className="text-sm text-muted-foreground">Sidebar content goes here. Typically filters or navigation links.</p>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};
export default Sidebar;