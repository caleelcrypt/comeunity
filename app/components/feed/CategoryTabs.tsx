import React from 'react';
import { CATEGORIES } from '../../utils/constants';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="category-tabs">
      {CATEGORIES.map(category => (
        <div
          key={category.id}
          className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
          data-category={category.id}
          onClick={() => onCategoryChange(category.id)}
        >
          <i className={category.icon}></i> {category.name}
        </div>
      ))}
    </div>
  );
};