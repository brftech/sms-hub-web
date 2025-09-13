import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Delete User</h3>
                <p className="text-red-100 text-sm">
                  Remove {user.first_name} {user.last_name} from the system
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-800">Warning</h4>
                <p className="text-sm text-red-700 mt-1">
                  This action will{" "}
                  {deletePermanent ? "permanently remove" : "deactivate"} the
                  user account.
                  {deletePermanent
                    ? " This cannot be undone."
                    : " The user can be reactivated later."}
                </p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              User Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-mono text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account #:</span>
                <span className="font-mono text-gray-900">
                  {user.account_number || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="text-gray-900 capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          {/* Deletion Options */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="permanentDelete"
                checked={deletePermanent}
                onChange={(e) => setDeletePermanent(e.target.checked)}
                className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <div>
                <label
                  htmlFor="permanentDelete"
                  className="text-sm font-medium text-gray-700"
                >
                  Permanently delete this user
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  This will completely remove the user from the database and
                  authentication system. This action cannot be undone.
                </p>
              </div>
            </div>

            {!deletePermanent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-4 h-4 text-blue-400 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Deactivation Mode
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      The user will be deactivated but can be reactivated later.
                      Their data will be preserved.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className={`px-6 py-3 text-white rounded-lg transition-colors font-medium flex items-center space-x-2 ${
              deletePermanent
                ? "bg-red-600 hover:bg-red-700 disabled:opacity-50"
                : "bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            }`}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>
                  {deletePermanent ? "Permanently Delete" : "Deactivate User"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
