'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';

import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const categories = [
  'All',
  'Technology',
  'Business',
  'Science',
  'Health',
  'Entertainment',
  'Sports',
  'Politics',
];

interface CategoryFilterProps {
  onFilterChange: (filters: { date: Date | undefined; category: string }) => void;
}

export default function CategoryFilter({ onFilterChange }: CategoryFilterProps) {
  const [date, setDate] = useState<Date>();
  const [category, setCategory] = useState('All');

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onFilterChange({ date: newDate, category });
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    onFilterChange({ date, category: newCategory });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Category:</span>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Date:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[180px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 