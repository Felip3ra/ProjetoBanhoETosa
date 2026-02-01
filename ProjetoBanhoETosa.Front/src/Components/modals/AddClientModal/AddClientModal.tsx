import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useToast } from "../../common/ToastProvider";

export interface AddClientModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; phone: string; email?: string; petName: string }) => Promise<boolean>;
  isSubmitting: boolean;
  error?: string | null;
}

export function AddClientModal({
  show,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: AddClientModalProps) {
  const { pushToast } = useToast();
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    email: "",
    petName: "",
  });

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.petName) {
      pushToast({ message: "Preencha nome, telefone e nome do pet.", variant: "error" });
      return;
    }
    const success = await onSubmit({
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      petName: form.petName,
    });
    if (success) {
      setForm({ name: "", phone: "", email: "", petName: "" });
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <Card className="border-slate-200/80 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Cadastrar Cliente</CardTitle>
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="client-name">Nome do Cliente *</Label>
                  <Input
                    id="client-name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Maria Silva"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-phone">Telefone *</Label>
                  <Input
                    id="client-phone"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-email">Email (opcional)</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@email.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="client-pet">Nome do Pet *</Label>
                  <Input
                    id="client-pet"
                    value={form.petName}
                    onChange={(e) => setForm((prev) => ({ ...prev, petName: e.target.value }))}
                    placeholder="Rex"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={onClose} className="w-full">
                  Cancelar
                </Button>
                <Button type="submit" variant="brand" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Salvando..." : "Cadastrar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body
  );
}
