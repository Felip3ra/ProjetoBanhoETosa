import React from "react";
import ReactDOM from "react-dom";
import styles from "./AddClientModal.module.css";

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
      alert("Preencha nome, telefone e nome do pet");
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
    <div className={styles.Container} onClick={onClose}>
      <div className={styles["Container-Background"]} />
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.Header}>
          <h3 className={styles.Title}>Cadastrar Cliente</h3>
          <button className={styles.Close} onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <form className={styles.Form} onSubmit={handleSubmit}>
          <label className={styles.Field}>
            <span className={styles.Label}>Nome do Cliente *</span>
            <input
              className={styles.Input}
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Maria Silva"
            />
          </label>

          <label className={styles.Field}>
            <span className={styles.Label}>Telefone *</span>
            <input
              className={styles.Input}
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
          </label>

          <label className={styles.Field}>
            <span className={styles.Label}>Email (opcional)</span>
            <input
              className={styles.Input}
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="contato@email.com"
            />
          </label>

          <label className={styles.Field}>
            <span className={styles.Label}>Nome do Pet *</span>
            <input
              className={styles.Input}
              value={form.petName}
              onChange={(e) => setForm((prev) => ({ ...prev, petName: e.target.value }))}
              placeholder="Rex"
            />
          </label>

          {error && <p className={styles.Error}>{error}</p>}

          <div className={styles.Actions}>
            <button type="button" onClick={onClose} className={styles.SecondaryButton}>
              Cancelar
            </button>
            <button type="submit" className={styles.PrimaryButton} disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
