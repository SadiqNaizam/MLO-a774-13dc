import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
}

interface ServiceCategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategoryChange: (categoryId: string) => void;
  label?: string;
  placeholder?: string;
}

const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  label = "Service Category",
  placeholder = "Select a category",
}) => {
  console.log("Rendering ServiceCategorySelector, selected:", selectedCategoryId);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor="service-category-select">{label}</Label>}
      <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
        <SelectTrigger id="service-category-select" className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
          {categories.length === 0 && <SelectItem value="no-category" disabled>No categories available</SelectItem>}
        </SelectContent>
      </Select>
    </div>
  );
};
export default ServiceCategorySelector;