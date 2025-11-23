import React from "react";
import type { EditingPrice } from "../../../interfaces/EditingPrice";
import styles from "./EditingPriceServices.module.css";
import EditableServiceItem from "../../EditableServiceItem/EditableServiceItem"; // Import the new component

export default function EditingPriceServices({ services, onClose, onSave }: EditingPrice) {
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
            <EditableServiceItem key={service.id} service={service} onSaveItem={onSave} />
          ))}
          <button onClick={onClose} className={styles["Button-Close"]}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}