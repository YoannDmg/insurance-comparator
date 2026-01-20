import { useEffect, useState } from "react";
import { useComparison } from "@/context/comparison-context";
import { getInsurer, CATEGORY_LABELS, CATEGORIES, type Insurer, type Category } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ComparisonTable } from "@/components/comparison-table";
import type { PageHeaderData } from "@/layouts/app-layout";

interface ComparisonPageProps {
  setPageHeader: (header: PageHeaderData) => void;
}

interface InsurerWithPlan {
  insurer: Insurer;
  selectedLevel: number;
}

export function ComparisonPage({ setPageHeader }: ComparisonPageProps) {
  const { insurers } = useComparison();
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [insurersData, setInsurersData] = useState<Map<string, InsurerWithPlan>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageHeader({
      title: "Comparaison",
      subtitle: `${insurers.length} assureur${insurers.length > 1 ? "s" : ""}`,
    });
  }, [insurers.length, setPageHeader]);

  useEffect(() => {
    if (insurers.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(insurers.map((i) => getInsurer(i.name)))
      .then((results) => {
        const newData = new Map<string, InsurerWithPlan>();
        results.forEach((insurer) => {
          newData.set(insurer.name, {
            insurer,
            selectedLevel: insurer.plans[0]?.level ?? 1,
          });
        });
        setInsurersData(newData);
      })
      .finally(() => setLoading(false));
  }, [insurers]);

  const setSelectedLevel = (insurerName: string, level: number) => {
    setInsurersData((prev) => {
      const newMap = new Map(prev);
      const data = newMap.get(insurerName);
      if (data) {
        newMap.set(insurerName, { ...data, selectedLevel: level });
      }
      return newMap;
    });
  };

  if (insurers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-muted-foreground">Aucun assureur sélectionné pour la comparaison</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Chargement des données...</div>
      </div>
    );
  }

  const selectedPlans = Array.from(insurersData.entries()).map(([name, data]) => ({
    insurerName: name,
    insurerBrand: data.insurer.brand,
    plan: data.insurer.plans.find((p) => p.level === data.selectedLevel) ?? data.insurer.plans[0],
    allPlans: data.insurer.plans,
    selectedLevel: data.selectedLevel,
  }));

  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          Toutes
        </Button>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </Button>
        ))}
      </div>

      <ComparisonTable
        selectedPlans={selectedPlans}
        categoryFilter={selectedCategory}
        onChangePlanLevel={setSelectedLevel}
      />
    </div>
  );
}
