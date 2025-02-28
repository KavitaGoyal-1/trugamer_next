import { CategoryData } from "@/types/categories";

const CategoriesCard = ({
  categories,
}: {
  categories: CategoryData[] | undefined;
}) => {
  return (
    <div className="bg-[#1A2947] p-4 rounded-xl max-w-[350px]">
      <h3 className="font-semibold text-base mb-4">Categories</h3>
      <div className="flex flex-wrap gap-[10px]">
        {categories !== undefined &&
          categories !== null &&
          categories.length > 0 &&
          categories.map((category: CategoryData) => (
            <a
              key={category.id}
              className="py-1 px-3 text-sm font-medium	bg-cPurple-light bg-opacity-40 rounded-2xl capitalize text-white"
            >
              {category.attributes.title}
            </a>
          ))}
      </div>
    </div>
  );
};

export default CategoriesCard;
