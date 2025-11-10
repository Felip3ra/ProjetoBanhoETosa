import React, { useState } from "react";
import { Edit2, Check } from "lucide-react";
import type { EditingPrice, Service } from "../../../interfaces/EditingPrice";
import styles from "./EditingPriceServices.module.css";
export default function EditingPriceServices({ services, onClose, onSave }: EditingPrice) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setTempPrice(s.price.toString());
  };

  const handleSave = (serviceId: number) => {
    console.log(tempPrice)
  if (!tempPrice) {
    alert("Por favor, insira um preço válido!");
    return;
  }

  const price = Number(tempPrice.replace(",", "."));
  if (isNaN(price) || price <= 0) {
    alert("Por favor, insira um preço válido!");
    return;
  }

  onSave(serviceId, price);
  setEditingId(null);
  setTempPrice("");
};


  return (
    <div className={styles.Container} onClick={onClose}>
      <div className={styles["Container-Background"]} />
      <div
        className={styles["Container-Modal-EditingPrice"]}
        onClick={(e) => e.stopPropagation()} // Impede que o clique no modal feche o fundo
        role="dialog"
        aria-modal="true"
      >
        <h3 className={styles["Label-EditingPrice"]}>Editar Preços dos Serviços</h3>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className={styles["Container-Service-Item"]}>
              <div className={styles["Container-Service-Item-Box"]}>
                <div>
                  <h4 className={styles["Label-Service-Name"]}>{service.name}</h4>
                  <span className={styles["Label-Service-Duration"]}>{service.duration} min</span>
                </div>
                {editingId === service.id ? (
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
                      onClick={() => handleSave(service.id)}
                      className={styles["Button-Save"]}
                      aria-label={`Salvar preço de ${service.name}`}
                    >
                      <Check className={styles["Icon-Check"]} />
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setTempPrice("");
                      }}
                      className={styles["Button-Cancel"]}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className={styles["Container-Button-Edit"]}>
                    <span className={styles["Label-Price"]}>R$ {service.price.toFixed(2)}</span>
                    <button
                      onClick={() => startEdit(service)}
                      className={styles["Button-Edit"]}
                      aria-label={`Editar preço de ${service.name}`}
                    >
                      <Edit2 className={styles["Icon-Edit"]} />
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button onClick={onClose} className={styles["Button-Close"]}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}