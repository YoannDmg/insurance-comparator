import { useState, type ReactNode } from "react";
import { InsurersListPage } from "@/pages/insurers-list";
import { InsurerDetailPage } from "@/pages/insurer-detail";
import { ComparisonPage } from "@/pages/comparison";
import { Button } from "@/components/ui/button";

type Page = "list" | "detail" | "comparison";

export interface PageHeaderData {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AppLayout() {
  const [page, setPage] = useState<Page>("list");
  const [selectedInsurer, setSelectedInsurer] = useState<string | null>(null);
  const [pageHeader, setPageHeader] = useState<PageHeaderData>({ title: "" });

  const goToInsurer = (name: string) => {
    setSelectedInsurer(name);
    setPage("detail");
  };

  const goToList = () => {
    setSelectedInsurer(null);
    setPage("list");
  };

  const goToComparison = () => {
    setPage("comparison");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {page !== "list" && (
              <Button variant="outline" size="sm" onClick={goToList}>
                &larr; Retour
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold">{pageHeader.title}</h1>
              {pageHeader.subtitle && <p className="text-muted-foreground">{pageHeader.subtitle}</p>}
            </div>
          </div>
          {pageHeader.actions && <div className="flex items-center gap-2">{pageHeader.actions}</div>}
        </div>

        {/* Page Content */}
        {page === "comparison" ? (
          <ComparisonPage setPageHeader={setPageHeader} />
        ) : page === "detail" && selectedInsurer ? (
          <InsurerDetailPage insurerName={selectedInsurer} setPageHeader={setPageHeader} />
        ) : (
          <InsurersListPage onSelectInsurer={goToInsurer} onCompare={goToComparison} setPageHeader={setPageHeader} />
        )}
      </main>
    </div>
  );
}
