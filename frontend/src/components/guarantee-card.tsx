import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatReimbursement, CATEGORY_LABELS, type Guarantee, type Category } from "@/lib/api";

interface GuaranteeCardProps {
  category: Category;
  guarantees: Guarantee[];
}

export function GuaranteeCard({ category, guarantees }: GuaranteeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">{CATEGORY_LABELS[category]}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {guarantees.map((guarantee) => (
            <div key={guarantee.key} className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <div className="font-medium text-sm">{guarantee.label}</div>
                {guarantee.details && (
                  <div className="text-xs text-muted-foreground">{guarantee.details}</div>
                )}
                {guarantee.limit && (
                  <div className="text-xs text-muted-foreground">Limite: {guarantee.limit}</div>
                )}
              </div>
              <Badge variant="outline" className="shrink-0">
                {formatReimbursement(guarantee.reimbursement)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
