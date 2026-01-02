import { Button } from "./button";

interface Item {
  id: string;
  label: string;
}

interface Props {
  items: Item[];
  handleClick: (item: Item) => void;
  value?: string;
}

export const SimpleScrollMenu = ({ items, handleClick, value }: Props) => {
  const activeIndex = items.findIndex((item) => item.id === value);

  return (
    <div className="flex w-[calc(100vw-36px)] max-w-[463px] space-x-0.5 overflow-x-auto pb-4">
      {items.map((item, index) => {
        return (
          <SimpleScrollMenuItem
            handleClick={handleClick}
            isActive={activeIndex === index}
            item={item}
            key={index}
          />
        );
      })}
    </div>
  );
};

export const SimpleScrollMenuItem = ({
  item,
  handleClick,
  isActive,
}: {
  item: Item;
  handleClick: (item: Item) => void;
  isActive?: boolean;
}) => {
  return (
    <Button
      onClick={() => handleClick(item)}
      size="xs"
      type="button"
      variant={isActive ? "default" : "secondary"}
    >
      {item.label}
    </Button>
  );
};
