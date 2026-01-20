import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatReimbursement, CATEGORY_LABELS, type Plan, type Category } from "@/lib/api";

interface SelectedPlan {
  insurerName: string;
  insurerBrand: string;
  plan: Plan;
  allPlans: Plan[];
  selectedLevel: number;
}

interface ComparisonTableProps {
  selectedPlans: SelectedPlan[];
  categoryFilter: Category | "all";
  onChangePlanLevel: (insurerName: string, level: number) => void;
}

export function ComparisonTable({
  selectedPlans,
  categoryFilter,
  onChangePlanLevel,
}: ComparisonTableProps) {
  // Get all unique guarantee keys across all selected plans
  const allGuaranteeKeys = new Map<string, { key: string; label: string; category: Category }>();
  selectedPlans.forEach((item) => {
    item.plan?.guarantees.forEach((g) => {
      if (!allGuaranteeKeys.has(g.key)) {
        allGuaranteeKeys.set(g.key, { key: g.key, label: g.label, category: g.category });
      }
    });
  });

  // Filter by category
  const filteredKeys = Array.from(allGuaranteeKeys.values()).filter(
    (g) => categoryFilter === "all" || g.category === categoryFilter
  );

  // Group by category for display
  const keysByCategory = filteredKeys.reduce((acc, g) => {
    if (!acc[g.category]) acc[g.category] = [];
    acc[g.category].push(g);
    return acc;
  }, {} as Record<Category, typeof filteredKeys>);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border bg-muted">
            <th className="text-left p-4 min-w-[200px] font-semibold">Garantie</th>
            {selectedPlans.map((item, index) => (
              <th
                key={item.insurerName}
                className={`text-left p-4 min-w-[200px] ${index > 0 ? 'border-l-2 border-border' : ''}`}
              >
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-base">{item.insurerBrand}</span>
                  <div className="flex flex-wrap gap-1">
                    {item.allPlans.map((plan) => (
                      <Button
                        key={plan.level}
                        variant={item.selectedLevel === plan.level ? "default" : "outline"}
                        size="xs"
                        onClick={() => onChangePlanLevel(item.insurerName, plan.level)}
                      >
                        {plan.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(Object.entries(keysByCategory) as [Category, typeof filteredKeys][]).map(([category, guarantees]) => (
            <>
              <tr key={category} className="bg-primary/10 border-y-2 border-primary/30">
                <td colSpan={selectedPlans.length + 1} className="p-3">
                  <span className="font-semibold text-primary">{CATEGORY_LABELS[category]}</span>
                </td>
              </tr>
              {guarantees.map((g) => (
                <tr key={g.key} className="border-b border-border hover:bg-muted/40">
                  <td className="p-3 font-medium text-sm bg-muted/20">{g.label}</td>
                  {selectedPlans.map((item, index) => {
                    const guarantee = item.plan?.guarantees.find((gg) => gg.key === g.key);
                    return (
                      <td
                        key={`${item.insurerName}-${g.key}`}
                        className={`p-3 ${index > 0 ? 'border-l-2 border-border' : ''}`}
                      >
                        {guarantee ? (
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="bg-background font-semibold">
                              {formatReimbursement(guarantee.reimbursement)}
                            </Badge>
                            {guarantee.limit && (
                              <span className="text-xs text-muted-foreground">{guarantee.limit}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
