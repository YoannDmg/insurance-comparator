import { useEffect, useState } from "react";
import { getInsurer, type Insurer, type Category } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/context/comparison-context";
import { GuaranteeCard } from "@/components/guarantee-card";
import type { PageHeaderData } from "@/layouts/app-layout";

interface InsurerDetailPageProps {
  insurerName: string;
  setPageHeader: (header: PageHeaderData) => void;
}

export function InsurerDetailPage({ insurerName, setPageHeader }: InsurerDetailPageProps) {
  const [insurer, setInsurer] = useState<Insurer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanLevel, setSelectedPlanLevel] = useState<number | null>(null);
  const { isSelected, addInsurer } = useComparison();

  useEffect(() => {
    setLoading(true);
    getInsurer(insurerName)
      .then((data) => {
        setInsurer(data);
        setPageHeader({
          title: data.brand,
          subtitle: data.name,
        });
        if (data.plans.length > 0) {
          setSelectedPlanLevel(data.plans[0].level);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [insurerName, setPageHeader]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (error || !insurer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive">Erreur: {error || "Assureur non trouvé"}</div>
      </div>
    );
  }

  const selectedPlan = insurer.plans.find((p) => p.level === selectedPlanLevel);

  const guaranteesByCategory = selectedPlan?.guarantees.reduce((acc, guarantee) => {
    if (!acc[guarantee.category]) {
      acc[guarantee.category] = [];
    }
    acc[guarantee.category].push(guarantee);
    return acc;
  }, {} as Record<Category, typeof selectedPlan.guarantees>);

  const isInComparison = isSelected(insurer.name);

  return (
    <div className="space-y-6">
      {/* Plan selector + compare button */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {insurer.plans.map((plan) => (
            <Button
              key={plan.level}
              variant={selectedPlanLevel === plan.level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlanLevel(plan.level)}
            >
              {plan.name}
            </Button>
          ))}
        </div>
        {!isInComparison && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => addInsurer({ name: insurer.name, brand: insurer.brand })}
          >
            Ajouter à la comparaison
          </Button>
        )}
      </div>

      {/* Guarantees */}
      {selectedPlan && guaranteesByCategory && (
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.entries(guaranteesByCategory) as [Category, typeof selectedPlan.guarantees][]).map(
            ([category, guarantees]) => (
              <GuaranteeCard key={category} category={category} guarantees={guarantees} />
            )
          )}
        </div>
      )}
    </div>
  );
}
