import React, { useState } from "react";
import { Plus, Building2, Mail, User, Phone, Lock, CreditCard } from "lucide-react";
import { BaseModal, ModalFormLayout, ModalFormColumn } from "./BaseModal";
import { HubType } from "@sms-hub/types";

export interface AccountAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (accountData: any) => Promise<void>;
  hubId: number;
  hubName: string;
}

export const AccountAddModal: React.FC<AccountAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  hubId,
  hubName,
}) => {
  const [formData, setFormData] = useState({
    // Company fields
    companyName: "",
    legalName: "",
    
    // Customer fields
    billingEmail: "",
    subscriptionTier: "FREE",
    paymentStatus: "PENDING",
    
    // Initial user fields
    createUser: false,
    userEmail: "",
    userPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "MEMBER",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.companyName || !formData.billingEmail) {
        throw new Error("Company name and billing email are required");
      }

      if (formData.createUser && !formData.userEmail) {
        throw new Error("User email is required when creating a user");
      }

      // Prepare data for submission
      const accountData = {
        hub_id: hubId,
        companyName: formData.companyName,
        legalName: formData.legalName || formData.companyName,
        billingEmail: formData.billingEmail,
        subscriptionTier: formData.subscriptionTier,
        paymentStatus: formData.paymentStatus,
        ...(formData.createUser && {
          userEmail: formData.userEmail,
          userPassword: formData.userPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
        }),
      };

      await onAdd(accountData);
      
      // Reset form and close modal on success
      setFormData({
        companyName: "",
        legalName: "",
        billingEmail: "",
        subscriptionTier: "FREE",
        paymentStatus: "PENDING",
        createUser: false,
        userEmail: "",
        userPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "MEMBER",
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Account"
      subtitle={`Create a new account for ${hubName}`}
      icon={<Plus className="w-5 h-5" />}
      variant="create"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Company Information Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company Information
          </h3>
          <ModalFormLayout>
            <ModalFormColumn>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </ModalFormColumn>
            <ModalFormColumn>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Name
                </label>
                <input
                  type="text"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleInputChange}
                  placeholder="Legal entity name (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                />
              </div>
            </ModalFormColumn>
          </ModalFormLayout>
        </div>

        {/* Billing Information Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing Information
          </h3>
          <ModalFormLayout>
            <ModalFormColumn span={2}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Email *
                </label>
                <input
                  type="email"
                  name="billingEmail"
                  value={formData.billingEmail}
                  onChange={handleInputChange}
                  placeholder="billing@company.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </ModalFormColumn>
            <ModalFormColumn>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Tier
                </label>
                <select
                  name="subscriptionTier"
                  value={formData.subscriptionTier}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                >
                  <option value="FREE">Free</option>
                  <option value="STARTER">Starter</option>
                  <option value="PRO">Pro</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
            </ModalFormColumn>
            <ModalFormColumn>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PAST_DUE">Past Due</option>
                  <option value="CANCELED">Canceled</option>
                </select>
              </div>
            </ModalFormColumn>
          </ModalFormLayout>
        </div>

        {/* Initial User Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4" />
            Initial User (Optional)
          </h3>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="createUser"
                checked={formData.createUser}
                onChange={handleInputChange}
                className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">Create an initial user for this account</span>
            </label>
          </div>

          {formData.createUser && (
            <ModalFormLayout>
              <ModalFormColumn>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Email *
                  </label>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    placeholder="user@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                    required={formData.createUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  />
                </div>
              </ModalFormColumn>
              <ModalFormColumn>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="userPassword"
                    value={formData.userPassword}
                    onChange={handleInputChange}
                    placeholder="Leave blank to send invite"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="VIEWER">Viewer</option>
                    <option value="SUPPORT">Support</option>
                    <option value="ADMIN">Admin</option>
                    <option value="OWNER">Owner</option>
                  </select>
                </div>
              </ModalFormColumn>
            </ModalFormLayout>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <Plus className="w-4 h-4" />
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};