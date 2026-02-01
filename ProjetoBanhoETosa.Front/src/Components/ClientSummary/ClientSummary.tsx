import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ClientSummaryProps {
  totalClients: number;
  totalPets: number;
  loading?: boolean;
  error?: string | null;
}

export default function ClientSummary({ totalClients, totalPets, loading, error }: ClientSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes & Pets</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-slate-500">Carregando...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-sm text-slate-500">Clientes</span>
              <div className="text-2xl font-semibold text-slate-900">{totalClients}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="text-sm text-slate-500">Pets</span>
              <div className="text-2xl font-semibold text-slate-900">{totalPets}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
