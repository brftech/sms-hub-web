import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { BaseModal, ModalButtonGroup, ModalButton } from "./BaseModal";

interface UserProfile {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  account_number: string;
  role?: string | null;
  is_active?: boolean | null;
  hub_id: number;
  mobile_phone_number?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permanent: boolean) => Promise<void>;
  user: UserProfile | null;
  isDeleting?: boolean;
}

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isDeleting = false,
}) => {
  const [deletePermanent, setDeletePermanent] = useState(false);

  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    await onConfirm(deletePermanent);
  };

  const handleClose = () => {
    setDeletePermanent(false);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete User"
      subtitle={`Remove ${user.first_name} ${user.last_name} from the system`}
      icon={<Trash2 className="w-5 h-5" />}
      variant="delete"
      size="md"
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
            {deletePermanent ? "Permanently Delete" : "Deactivate User"}
          </ModalButton>
        </ModalButtonGroup>
      }
    >
      <div className="space-y-6">
        {/* User Profile Card */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              {(user.first_name?.[0] || user.email[0]).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.first_name || ""} {user.last_name || ""}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                  {user.role?.toUpperCase() || "USER"}
                </span>
                <span className="text-xs text-gray-500">
                  Account: {user.account_number || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Deletion Mode Selection */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Choose Action
          </h4>
          
          {/* Deactivate Option */}
          <label className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
            !deletePermanent ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
          }`}>
            <input
              type="radio"
              name="deleteMode"
              checked={!deletePermanent}
              onChange={() => setDeletePermanent(false)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">Deactivate User</span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Temporarily disable access. User can be reactivated later and all data will be preserved.
              </p>
            </div>
          </label>

          {/* Permanent Delete Option */}
          <label className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
            deletePermanent ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
          }`}>
            <input
              type="radio"
              name="deleteMode"
              checked={deletePermanent}
              onChange={() => setDeletePermanent(true)}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">Permanently Delete</span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Irreversible
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Completely remove user from the system. This action cannot be undone.
              </p>
            </div>
          </label>
        </div>

        {/* Warning Message */}
        <div className={`rounded-lg p-4 ${
          deletePermanent 
            ? "bg-red-50 border border-red-200" 
            : "bg-amber-50 border border-amber-200"
        }`}>
          <div className="flex items-start space-x-3">
            <AlertTriangle className={`w-5 h-5 mt-0.5 ${
              deletePermanent ? "text-red-500" : "text-amber-500"
            }`} />
            <div className="flex-1">
              <h4 className={`text-sm font-semibold ${
                deletePermanent ? "text-red-900" : "text-amber-900"
              }`}>
                {deletePermanent ? "Permanent Deletion Warning" : "Deactivation Notice"}
              </h4>
              <p className={`text-sm mt-1 ${
                deletePermanent ? "text-red-700" : "text-amber-700"
              }`}>
                {deletePermanent 
                  ? "This will permanently delete all user data, including their profile, permissions, and activity history. This action cannot be reversed."
                  : "The user will lose access immediately but their account and data will remain in the system for future reactivation if needed."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
