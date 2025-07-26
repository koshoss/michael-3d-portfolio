import { Button } from "./ui/button";

interface FilterButtonsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterButtons = ({ categories, activeCategory, onCategoryChange }: FilterButtonsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className="transition-all duration-300 hover:scale-105"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons;