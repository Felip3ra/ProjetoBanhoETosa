import React, { useState } from "react";
import { Edit2, Check, Trash2 } from "lucide-react";
import styles from "./EditableServiceItem.module.css";

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
  const safePrice = typeof service?.price === "number" && !Number.isNaN(service.price) ? service.price : 0;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempPrice, setTempPrice] = useState<string>(safePrice.toString());

  const startEdit = () => {
    setIsEditing(true);
    setTempPrice(safePrice.toString());
  };

  const handleSave = () => {
    if (!tempPrice) {
      alert("Por favor, insira um preço válido!");
      return;
    }

    const price = Number(tempPrice.replace(",", "."));
    if (isNaN(price) || price <= 0) {
      alert("Por favor, insira um preço válido!");
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
    <div className={styles["Container-Service-Item"]}>
      <div className={styles["Container-Service-Item-Box"]}>
        <div>
          <h4 className={styles["Label-Service-Name"]}>{service.name}</h4>
          <span className={styles["Label-Service-Duration"]}>{service.durationInMinutes} min</span>
        </div>
        {isEditing ? (
          <div className={styles["Container-Input"]}>
            <div className="relative">
              <span className={styles["Label-Price-Prefix"]}>R$</span>
              <input
                type="number"
                value={tempPrice || ""}
                onChange={(e) => setTempPrice(e.target.value)}
                className={styles["Input-Price"]}
                step="0.01"
                min="0"
                autoFocus
              />
            </div>
            <button
              onClick={handleSave}
              className={styles["Button-Save"]}
              aria-label={`Salvar preço de ${service.name}`}
            >
              <Check className={styles["Icon-Check"]} />
              Salvar
            </button>
            <button onClick={handleCancel} className={styles["Button-Cancel"]}>
              Cancelar
            </button>
          </div>
        ) : (
          <div className={styles["Container-Button-Edit"]}>
            <span className={styles["Label-Price"]}>R$ {safePrice.toFixed(2)}</span>
            <div className={styles["Container-Actions"]}>
              <button
                onClick={startEdit}
                className={styles["Button-Edit"]}
                aria-label={`Editar preço de ${service.name}`}
              >
                <Edit2 className={styles["Icon-Edit"]} />
                Editar
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(service.id)}
                  className={styles["Button-Delete"]}
                  aria-label={`Excluir ${service.name}`}
                >
                  <Trash2 className={styles["Icon-Delete"]} />
                  Excluir
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
