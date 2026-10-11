import { useState } from "react";
import { Check, Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../common/ToastProvider";

interface Service {
  id: number;
  name: string;
  price: number;
  durationInMinutes: number;
}

interface EditableServiceItemProps {
  service: Service;
  onSaveItem: (serviceId: number, newPrice: number) => void;
  onDelete?: (serviceId: number) => void;
}

export default function EditableServiceItem({ service, onSaveItem, onDelete }: EditableServiceItemProps) {
  const { pushToast } = useToast();
  const safePrice = typeof service?.price === "number" && !Number.isNaN(service.price) ? service.price : 0;
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrice, setTempPrice] = useState(safePrice.toString());

  const startEdit = () => {
    setIsEditing(true);
    setTempPrice(safePrice.toString());
  };

  const handleSave = () => {
    if (!tempPrice) {
      pushToast({ message: "Por favor, insira um preço válido.", variant: "error" });
      return;
    }

    const price = Number(tempPrice.replace(",", "."));
    if (Number.isNaN(price) || price <= 0) {
      pushToast({ message: "Por favor, insira um preço válido.", variant: "error" });
      return;
    }

    onSaveItem(service.id, price);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempPrice(safePrice.toString());
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">{service.name}</h4>
          <span className="text-sm text-slate-500">{service.durationInMinutes} min</span>
        </div>

        {isEditing ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">R$</span>
              <Input
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(e.target.value)}
                className="w-28 pl-8"
                step="0.01"
                min="0"
                autoFocus
              />
            </div>
            <Button type="button" variant="brand" size="sm" onClick={handleSave}>
              <Check className="h-4 w-4" />
              Salvar
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-semibold text-slate-900">R$ {safePrice.toFixed(2)}</span>
            <Button type="button" variant="ghost" size="sm" onClick={startEdit}>
              <Edit2 className="h-4 w-4" />
              Editar
            </Button>
            {onDelete && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(service.id)}>
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
