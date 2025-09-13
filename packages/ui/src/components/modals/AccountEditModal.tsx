import React, { useState, useEffect } from "react";
import { Edit, Save } from "lucide-react";
import { BaseModal, ModalFormLayout, ModalFormColumn } from "./BaseModal";

interface UnifiedAccount {
  id: string;
  type: 'company' | 'customer' | 'company_customer';
  name: string;
  email: string;
  status: string;
  payment_status?: string;
  payment_type?: string;
  service_type?: string;
  hub_id: number;
  created_at: string;
  company?: any;
  customer?: any;
  user_count?: number;
  has_texting?: boolean;
  has_other_services?: boolean;
}

interface AccountEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAccount: Partial<UnifiedAccount>) => Promise<void>;
  account: UnifiedAccount | null;
  isUpdating?: boolean;
}

export const AccountEditModal: React.FC<AccountEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  account,
  isUpdating = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active",
    payment_type: "none",
    payment_status: "pending",
    contact_email: "",
    contact_phone: "",
    legal_name: "",
    tax_id: "",
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || "",
        email: account.email || "",
        status: account.status || "active",
        payment_type: account.payment_type || "none",
        payment_status: account.payment_status || "pending",
        contact_email: account.company?.contact_email || "",
        contact_phone: account.company?.contact_phone || "",
        legal_name: account.company?.legal_name || "",
        tax_id: account.company?.tax_id || "",
      });
    }
  }, [account]);

  if (!isOpen || !account) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: any = {
      // Update based on entity type
    };

    if (account.type === 'company' || account.type === 'company_customer') {
      // Update company fields
      updates.company = {
        public_name: formData.name,  // Add the name field here
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        legal_name: formData.legal_name,
        tax_id: formData.tax_id,
        is_active: formData.status === 'active',
      };
    }

    if (account.type === 'customer' || account.type === 'company_customer') {
      // Update customer fields
      // For customers, we need to split the name into first and last
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      updates.customer = {
        first_name: firstName,
        last_name: lastName,
        billing_email: formData.email,
        payment_type: formData.payment_type,
        payment_status: formData.payment_status,
        is_active: formData.status === 'active',
      };
    }

    await onSave(updates);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Account"
      subtitle={`Update information for ${account.name}`}
      icon={<Edit className="w-5 h-5" />}
      variant="edit"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ModalFormLayout>
          <ModalFormColumn>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </ModalFormColumn>

          <ModalFormColumn>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <select
                value={formData.payment_type}
                onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
              >
                <option value="none">None</option>
                <option value="stripe">Stripe</option>
                <option value="barter">Barter</option>
                <option value="courtesy">Courtesy</option>
              </select>
            </div>
          </ModalFormColumn>
        </ModalFormLayout>

        {(account.type === 'company' || account.type === 'company_customer') && (
          <ModalFormLayout>
            <ModalFormColumn>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Name
                </label>
                <input
                  type="text"
                  value={formData.legal_name}
                  onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                />
              </div>
            </ModalFormColumn>

            <ModalFormColumn>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID
                </label>
                <input
                  type="text"
                  value={formData.tax_id}
                  onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                />
              </div>
            </ModalFormColumn>
          </ModalFormLayout>
        )}

        {(account.type === 'customer' || account.type === 'company_customer') && (
          <ModalFormLayout>
            <ModalFormColumn span={2}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </ModalFormColumn>
          </ModalFormLayout>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <Save className="w-4 h-4" />
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};