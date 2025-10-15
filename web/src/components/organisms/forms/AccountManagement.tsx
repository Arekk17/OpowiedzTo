"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/buttons/button";
import { FormSection } from "@/components/atoms/forms/FormSection";

interface AccountManagementProps {
  onDeactivate: () => void;
  onDelete: () => void;
}

export const AccountManagement: React.FC<AccountManagementProps> = ({
  onDeactivate,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="font-jakarta font-semibold text-lg text-content-primary mb-4">
          Zarządzanie kontem
        </h2>

        <div className="space-y-4">
          <FormSection className="border-l-4 border-accent-warning">
            <h3 className="font-medium text-content-primary mb-2">
              Dezaktywuj konto
            </h3>
            <p className="text-sm text-content-secondary mb-4">
              Twoje konto zostanie ukryte, ale dane pozostaną bezpieczne. Możesz
              je reaktywować w każdej chwili.
            </p>
            <Button
              variant="secondary"
              onClick={onDeactivate}
              className="w-fit"
            >
              Dezaktywuj konto
            </Button>
          </FormSection>

          <FormSection className="border-l-4 border-accent-error">
            <h3 className="font-medium text-content-primary mb-2">
              Usuń konto
            </h3>
            <p className="text-sm text-content-secondary mb-4">
              To działanie jest nieodwracalne. Wszystkie Twoje dane, posty i
              komentarze zostaną trwale usunięte.
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-fit"
              >
                Usuń konto
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-accent-error">
                  Czy na pewno chcesz usunąć konto? Wpisz &quot;USUŃ&quot; aby
                  potwierdzić.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    onClick={onDelete}
                    className="flex-1"
                  >
                    Potwierdź usunięcie
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Anuluj
                  </Button>
                </div>
              </div>
            )}
          </FormSection>
        </div>
      </div>
    </div>
  );
};
