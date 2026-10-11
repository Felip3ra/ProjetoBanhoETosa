import { useState } from "react";
import type { EditingPrice } from "../../../interfaces/EditingPrice";
import EditableServiceItem from "../../EditableServiceItem/EditableServiceItem";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useToast } from "../../common/ToastProvider";

export default function EditingPriceServices({ services, onClose, onSave, onCreate, onDelete }: EditingPrice) {
  const { pushToast } = useToast();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const handleCreate = () => {
    if (!name || duration <= 0 || price <= 0) {
      pushToast({ message: "Preencha nome, duração e preço válidos.", variant: "error" });
      return;
    }
    onCreate({
      name,
      durationInMinutes: duration,
      price,
    });
    setName("");
    setDuration(0);
    setPrice(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <Card className="border-slate-200/80 shadow-2xl">
          <CardHeader>
            <CardTitle>Editar Preços dos Serviços</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Nome</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Banho completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duração (min)</Label>
                  <Input
                    type="number"
                    value={duration || ""}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min={0}
                  />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={0}
                    step="0.01"
                  />
                </div>
              </div>
              <Button type="button" variant="brand" onClick={handleCreate} className="w-full">
                Cadastrar serviço
              </Button>
            </div>

            <div className="space-y-3">
              {services.map((service, index) => (
                <EditableServiceItem
                  key={service.id ?? service.name ?? index}
                  service={service}
                  onSaveItem={onSave}
                  onDelete={onDelete}
                />
              ))}
            </div>

            <Button type="button" variant="outline" onClick={onClose} className="w-full">
              Fechar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
