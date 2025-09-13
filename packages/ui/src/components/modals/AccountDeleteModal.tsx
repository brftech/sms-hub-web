import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { BaseModal, ModalButtonGroup, ModalButton } from "./BaseModal";

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

interface AccountDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permanent: boolean) => Promise<void>;
  account: UnifiedAccount | null;
  isDeleting?: boolean;
}

export const AccountDeleteModal: React.FC<AccountDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  account,
  isDeleting = false,
}) => {
  const [deletePermanent, setDeletePermanent] = useState(false);

  if (!isOpen || !account) return null;

  const handleConfirm = async () => {
    await onConfirm(deletePermanent);
  };

  const handleClose = () => {
    setDeletePermanent(false);
    onClose();
  };

  const getEntityTypeLabel = () => {
    switch (account.type) {
      case 'company_customer': return 'platform account';
      case 'company': return 'company';
      case 'customer': return 'customer';
      default: return 'account';
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Account"
      subtitle={`Remove ${account.name} from the system`}
      icon={<Trash2 className="w-5 h-5" />}
      variant="delete"
      size="sm"
      footer={
        <ModalButtonGroup>
          <ModalButton onClick={handleClose} variant="secondary">
            Cancel
          </ModalButton>
          <ModalButton
            onClick={handleConfirm}
            variant={deletePermanent ? "danger" : "warning"}
            loading={isDeleting}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            {deletePermanent ? "Permanently Delete" : "Deactivate Account"}
          </ModalButton>
        </ModalButtonGroup>
      }
    >
      <div className="space-y-4">
        {/* Account Info Card - Compact */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {account.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {account.name}
              </h3>
              <p className="text-xs text-gray-600 truncate">{account.email}</p>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                {getEntityTypeLabel().toUpperCase()}
              </span>
              {account.user_count > 0 && (
                <span className="text-xs text-gray-500">
                  {account.user_count} users
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Deletion Mode Selection */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
            Choose Action
          </h4>
          
          {/* Deactivate Option */}
          <label className={`relative flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
            !deletePermanent ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
          }`}>
            <input
              type="radio"
              name="deleteMode"
              checked={!deletePermanent}
              onChange={() => setDeletePermanent(false)}
              className="mt-0.5 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-2 flex-1">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-900">Deactivate Account</span>
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Temporarily disable access. Data preserved for reactivation.
              </p>
            </div>
          </label>

          {/* Permanent Delete Option */}
          <label className={`relative flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
            deletePermanent ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
          }`}>
            <input
              type="radio"
              name="deleteMode"
              checked={deletePermanent}
              onChange={() => setDeletePermanent(true)}
              className="mt-0.5 h-3 w-3 text-red-600 focus:ring-red-500 border-gray-300"
            />
            <div className="ml-2 flex-1">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-900">Permanently Delete</span>
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Irreversible
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Completely remove from system. Cannot be undone.
              </p>
            </div>
          </label>
        </div>

        {/* Warning Message - Compact */}
        <div className={`rounded-lg p-3 ${
          deletePermanent 
            ? "bg-red-50 border border-red-200" 
            : "bg-amber-50 border border-amber-200"
        }`}>
          <div className="flex items-start space-x-2">
            <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              deletePermanent ? "text-red-500" : "text-amber-500"
            }`} />
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-semibold ${
                deletePermanent ? "text-red-900" : "text-amber-900"
              }`}>
                {deletePermanent ? "Permanent Deletion Warning" : "Deactivation Notice"}
              </h4>
              <p className={`text-xs mt-0.5 ${
                deletePermanent ? "text-red-700" : "text-amber-700"
              }`}>
                {deletePermanent 
                  ? `This will permanently delete all data for this ${getEntityTypeLabel()}. This cannot be reversed.`
                  : `The ${getEntityTypeLabel()} will lose access immediately but all data will remain in the system for future reactivation if needed.`
                }
              </p>
              {account.user_count > 0 && (
                <p className={`text-xs mt-1 font-medium ${
                  deletePermanent ? "text-red-800" : "text-amber-800"
                }`}>
                  ⚠️ This will affect {account.user_count} user{account.user_count > 1 ? 's' : ''}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};