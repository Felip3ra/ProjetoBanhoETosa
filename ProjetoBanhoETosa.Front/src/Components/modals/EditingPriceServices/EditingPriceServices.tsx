import React, { useState } from "react";
import type { EditingPrice } from "../../../interfaces/EditingPrice";
import styles from "./EditingPriceServices.module.css";
import EditableServiceItem from "../../EditableServiceItem/EditableServiceItem";

export default function EditingPriceServices({ services, onClose, onSave, onCreate, onDelete }: EditingPrice) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const handleCreate = () => {
    if (!name || duration <= 0 || price <= 0) {
      alert("Preencha nome, duração e preço válidos.");
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
    <div className={styles.Container} onClick={onClose}>
      <div className={styles["Container-Background"]} />
      <div
        className={styles["Container-Modal-EditingPrice"]}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3 className={styles["Label-EditingPrice"]}>Editar Preços dos Serviços</h3>

        <div className={styles["Form-New-Service"]}>
          <div className={styles["Form-Row"]}>
            <label className={styles["Label"]}>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles["Input"]}
              placeholder="Banho completo"
            />
          </div>
          <div className={styles["Form-Row"]}>
            <label className={styles["Label"]}>Duração (min)</label>
            <input
              type="number"
              value={duration || ""}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={styles["Input"]}
              min={0}
            />
          </div>
          <div className={styles["Form-Row"]}>
            <label className={styles["Label"]}>Preço (R$)</label>
            <input
              type="number"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              className={styles["Input"]}
              min={0}
              step="0.01"
            />
          </div>
          <button onClick={handleCreate} className={styles["Button-Create"]}>
            Cadastrar serviço
          </button>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <EditableServiceItem key={service.id} service={service} onSaveItem={onSave} onDelete={onDelete} />
          ))}
          <button onClick={onClose} className={styles["Button-Close"]}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
