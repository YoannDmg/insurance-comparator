import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InsurerListItem } from "@/lib/api";
import { useComparison } from "@/context/comparison-context";

interface InsurerCardProps {
  insurer: InsurerListItem;
  onSelect?: (name: string) => void;
}

export function InsurerCard({ insurer, onSelect }: InsurerCardProps) {
  const { isSelected, toggleInsurer } = useComparison();
  const selected = isSelected(insurer.name);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleInsurer({ name: insurer.name, brand: insurer.brand });
  };

  return (
    <Card
      className={`hover:ring-primary/30 transition-all cursor-pointer ${selected ? "ring-2 ring-primary" : ""}`}
      onClick={() => onSelect?.(insurer.name)}
    >
      <CardHeader>
        <CardTitle>{insurer.brand}</CardTitle>
        <CardDescription>{insurer.name}</CardDescription>
        <CardAction>
          <Button
            variant={selected ? "default" : "outline"}
            size="sm"
            onClick={handleToggleCompare}
          >
            {selected ? "Sélectionné" : "Comparer"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardFooter className="justify-between">
        <Badge variant="secondary">
          {insurer.planCount} formule{insurer.planCount > 1 ? 's' : ''}
        </Badge>
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.stopPropagation();
          onSelect?.(insurer.name);
        }}>
          Voir détails
        </Button>
      </CardFooter>
    </Card>
  );
}
