import React from "react";
import {
  Eye,
  Building2,
  Mail,
  Calendar,
  CreditCard,
  Users,
} from "lucide-react";
import { BaseModal } from "./BaseModal";
import type { UnifiedAccount } from "../../types";

interface AccountViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (account: UnifiedAccount) => void;
  account: UnifiedAccount | null;
}

export const AccountViewModal: React.FC<AccountViewModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  account,
}) => {
  if (!isOpen || !account) return null;

  const getHubName = (hubId: number) => {
    switch (hubId) {
      case 0:
        return "PercyTech";
      case 1:
        return "Gnymble";
      case 2:
        return "PercyMD";
      case 3:
        return "PercyText";
      default:
        return `Hub ${hubId}`;
    }
  };

  const getEntityTypeLabel = (type: string) => {
    switch (type) {
      case "company_customer":
        return "Texting Platform Customer";
      case "company":
        return "Company (Other Services)";
      case "customer":
        return "Individual Customer";
      default:
        return type;
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={account.name || 'Unknown Account'}
      subtitle={getEntityTypeLabel(account.type || 'account')}
      icon={<Eye className="w-5 h-5" />}
      variant="view"
      size="sm"
      footer={
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(account)}
              className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Edit
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-4 p-2">
        {/* Compact info grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {/* Left column */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Hub</p>
                <p className="font-medium text-gray-900">
                  {getHubName(account.hub_id)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900 text-xs">
                  {account.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Users</p>
                <p className="font-medium text-gray-900">
                  {account.user_count || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  account.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {account.status}
              </span>
            </div>

            {account.payment_type && account.payment_type !== "none" && (
              <div>
                <p className="text-xs text-gray-500">Payment</p>
                <div className="flex items-center space-x-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {account.payment_type}
                  </span>
                  {account.payment_status && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        account.payment_status === "active" ||
                        account.payment_status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {account.payment_status}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500">Services</p>
              <div className="flex items-center space-x-1">
                {account.has_texting && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    SMS
                  </span>
                )}
                {account.has_other_services && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Other
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Company info if exists */}
        {account.company && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Company Details
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <span className="text-gray-500">Account #:</span>
                <span className="ml-1 font-mono font-medium">
                  {account.company.company_account_number}
                </span>
              </div>
              {account.company.legal_name && (
                <div>
                  <span className="text-gray-500">Legal:</span>
                  <span className="ml-1 font-medium">
                    {account.company.legal_name}
                  </span>
                </div>
              )}
              {account.company.ein && (
                <div>
                  <span className="text-gray-500">Tax ID:</span>
                  <span className="ml-1 font-medium">
                    {account.company.ein}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>
              Created{" "}
              {account.created_at
                ? new Date(account.created_at).toLocaleDateString()
                : "Unknown"}
            </span>
          </div>
          {account.customer?.stripe_customer_id && (
            <div className="flex items-center space-x-1">
              <CreditCard className="w-3 h-3" />
              <span className="font-mono text-xs">
                {account.customer.stripe_customer_id.slice(0, 10)}...
              </span>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};
