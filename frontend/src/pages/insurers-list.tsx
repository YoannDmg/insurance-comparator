import { useEffect, useState } from "react";
import { getInsurers, type InsurerListItem } from "@/lib/api";
import { InsurerCard } from "@/components/insurer-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useComparison } from "@/context/comparison-context";
import type { PageHeaderData } from "@/layouts/app-layout";

interface InsurersListPageProps {
  onSelectInsurer: (name: string) => void;
  onCompare: () => void;
  setPageHeader: (header: PageHeaderData) => void;
}

export function InsurersListPage({ onSelectInsurer, onCompare, setPageHeader }: InsurersListPageProps) {
  const [insurers, setInsurers] = useState<InsurerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { insurers: selectedInsurers } = useComparison();

  useEffect(() => {
    getInsurers()
      .then((data) => {
        setInsurers(data);
        setPageHeader({
          title: "Comparateur de mutuelles",
          subtitle: `Comparez les offres de ${data.length} assureurs`,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setPageHeader]);

  const filteredInsurers = insurers.filter(
    (insurer) =>
      insurer.name.toLowerCase().includes(search.toLowerCase()) ||
      insurer.brand.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Chargement des assureurs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-destructive">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Rechercher un assureur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {selectedInsurers.length > 0 && (
          <Button onClick={onCompare} className="gap-2">
            Comparer
            <Badge variant="secondary" className="ml-1">{selectedInsurers.length}</Badge>
          </Button>
        )}
      </div>

      {filteredInsurers.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          Aucun assureur trouvé pour "{search}"
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInsurers.map((insurer) => (
            <InsurerCard
              key={insurer.name}
              insurer={insurer}
              onSelect={onSelectInsurer}
            />
          ))}
        </div>
      )}
    </div>
  );
}
