import React from "react";
import { Edit, User } from "lucide-react";
import { BaseModal, ModalSection, ModalField, ModalButtonGroup, ModalButton, ModalFormLayout, ModalFormColumn } from "./BaseModal";

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
  company_id?: string | null;
  companies?: {
    id: string;
    public_name: string;
  } | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: UserProfile) => void;
  user: UserProfile | null;
}

export const UserViewModal: React.FC<UserViewModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  user,
}) => {
  if (!isOpen || !user) return null;

  const getHubName = (hubId: number | null | undefined) => {
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
        return "Unknown";
    }
  };

  const getRoleColor = (role: string | null | undefined) => {
    const roleLower = role?.toLowerCase();
    switch (roleLower) {
      case "superadmin":
        return "bg-purple-100 text-purple-800 ring-1 ring-purple-200";
      case "admin":
        return "bg-red-100 text-red-800 ring-1 ring-red-200";
      case "support":
        return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-200";
    }
  };

  const getAccountAge = (createdAt: string | null | undefined) => {
    if (!createdAt) return 0;
    return Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const getRoleDisplayName = (role: string | null | undefined) => {
    switch (role) {
      case "superadmin":
        return "Super Administrator";
      case "admin":
        return "Administrator";
      case "support":
        return "Support";
      case "viewer":
        return "Viewer";
      case "member":
        return "Member";
      default:
        return role?.toUpperCase() || "USER";
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${user.first_name} ${user.last_name}`}
      subtitle={getRoleDisplayName(user.role)}
      icon={<User className="w-5 h-5" />}
      variant="info"
      size="md"
      footer={
        <ModalButtonGroup>
          <ModalButton onClick={onClose} variant="secondary">
            Close
          </ModalButton>
          <ModalButton
            onClick={() => {
              onClose();
              onEdit(user);
            }}
            variant="primary"
          >
            <Edit className="w-4 h-4" />
            Edit User
          </ModalButton>
        </ModalButtonGroup>
      }
    >
      <ModalFormLayout>
        {/* Left Column */}
        <ModalFormColumn>
          <ModalSection title="Basic Information">
            <ModalField label="Full Name" value={`${user.first_name || ""} ${user.last_name || ""}`} />
            <ModalField label="Email Address" value={user.email} />
            <ModalField label="Account Number" value={user.account_number || "N/A"} />
            {user.mobile_phone_number && (
              <ModalField label="Phone Number" value={user.mobile_phone_number} />
            )}
            <ModalField label="Company">
              {user.companies ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {user.companies.public_name}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                  No Company
                </span>
              )}
            </ModalField>
          </ModalSection>
        </ModalFormColumn>

        {/* Right Column */}
        <ModalFormColumn>
          <ModalSection title="Status & Permissions">
            <ModalField label="Account Status">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  user.is_active
                    ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                    : "bg-red-100 text-red-800 ring-1 ring-red-200"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    user.is_active ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </ModalField>

            <ModalField label="Hub Assignment">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 ring-1 ring-blue-200">
                {getHubName(user.hub_id)}
              </span>
            </ModalField>

            <ModalField label="Role Level">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}
              >
                {getRoleDisplayName(user.role)}
              </span>
            </ModalField>
          </ModalSection>
        </ModalFormColumn>

        {/* Full Width Section */}
        <ModalFormColumn span={2}>
          <ModalSection title="Account Timeline">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm text-gray-900">
                Account created on{" "}
                <span className="font-semibold">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown date"}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Account has been active for {getAccountAge(user.created_at)} days
              </p>
            </div>
          </div>

          {user.updated_at && user.updated_at !== user.created_at && (
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-900">
                  Last updated on{" "}
                  <span className="font-semibold">
                    {new Date(user.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
          </ModalSection>
        </ModalFormColumn>
      </ModalFormLayout>
    </BaseModal>
  );
};
