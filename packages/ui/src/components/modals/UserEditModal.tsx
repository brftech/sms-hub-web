import React from "react";
import { Edit } from "lucide-react";
import { BaseModal, ModalSection, ModalButtonGroup, ModalButton, ModalFormLayout, ModalFormColumn, ModalField } from "./BaseModal";


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

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
  user: UserProfile | null;
  isUpdating?: boolean;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  isUpdating = false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updates = {
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      is_active: formData.get("isActive") === "true",
    } as Partial<UserProfile>;
    await onSave(updates);
  };

  const handleFormSubmit = () => {
    const form = document.querySelector('form');
    if (form) {
      const formData = new FormData(form);
      const updates = {
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as string,
        is_active: formData.get("isActive") === "true",
      } as Partial<UserProfile>;
      onSave(updates);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      subtitle={`Update ${user.first_name} ${user.last_name}'s information`}
      icon={<Edit className="w-5 h-5" />}
      variant="edit"
      size="md"
      footer={
        <ModalButtonGroup>
          <ModalButton onClick={onClose} variant="secondary">
            Cancel
          </ModalButton>
          <ModalButton
            onClick={handleFormSubmit}
            variant="primary"
            loading={isUpdating}
            disabled={isUpdating}
          >
            <Edit className="w-4 h-4" />
            Update User
          </ModalButton>
        </ModalButtonGroup>
      }
    >
      <form onSubmit={handleSubmit}>
        <ModalFormLayout>
          {/* Left Column */}
          <ModalFormColumn>
            <ModalSection title="Personal Information">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={user.first_name || ""}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={user.last_name || ""}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  placeholder="Enter email address"
                />
              </div>
            </ModalSection>
          </ModalFormColumn>

          {/* Right Column */}
          <ModalFormColumn>
            <ModalSection title="Account Settings">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue={
                    user.role === "superadmin"
                      ? "SUPERADMIN"
                      : user.role === "admin"
                        ? "ADMIN"
                        : user.role === "support"
                          ? "SUPPORT"
                          : user.role === "viewer"
                            ? "VIEWER"
                            : user.role === "member"
                              ? "MEMBER"
                              : user.role?.toUpperCase() || "USER"
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                >
                  <option value="SUPERADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPPORT">Support</option>
                  <option value="VIEWER">Viewer</option>
                  <option value="MEMBER">Member</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="isActive"
                  defaultValue={user.is_active ? "true" : "false"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <ModalField label="Account Number" value={user.account_number || "N/A"} />
              <ModalField label="Hub Assignment" value={getHubName(user.hub_id)} />
            </ModalSection>
          </ModalFormColumn>
        </ModalFormLayout>
      </form>
    </BaseModal>
  );
};
