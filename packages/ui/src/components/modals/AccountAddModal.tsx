import React, { useState } from "react";
import { Plus, Building2, User, CreditCard } from "lucide-react";
import { BaseModal, ModalFormLayout, ModalFormColumn } from "./BaseModal";
// import { HubType } from "../types"; // Not currently used

interface AccountAddData {
  hub_id: number;
  accountType: 'business' | 'individual';
  subscriptionTier: string;
  paymentStatus: string;
  // B2B fields
  companyName?: string;
  legalName?: string;
  billingEmail: string;
  // User fields (optional)
  userEmail?: string;
  userPassword?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
}

export interface AccountAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (accountData: AccountAddData) => Promise<void>;
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
  const [accountType, setAccountType] = useState<'business' | 'individual'>('business');
  const [formData, setFormData] = useState({
    // Company fields (B2B)
    companyName: "",
    legalName: "",
    
    // Individual fields (B2C)
    firstName: "",
    lastName: "",
    phoneNumber: "",
    
    // Common customer fields
    billingEmail: "",
    subscriptionTier: "FREE",
    paymentStatus: "PENDING",
    
    // Initial user fields (for B2B)
    createUser: false,
    userEmail: "",
    userPassword: "",
    userFirstName: "",
    userLastName: "",
    userPhoneNumber: "",
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

  const handleAccountTypeChange = (type: 'business' | 'individual') => {
    setAccountType(type);
    // Reset form when switching types
    setFormData({
      companyName: "",
      legalName: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      billingEmail: "",
      subscriptionTier: "FREE",
      paymentStatus: "PENDING",
      createUser: false,
      userEmail: "",
      userPassword: "",
      userFirstName: "",
      userLastName: "",
      userPhoneNumber: "",
      role: "MEMBER",
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let accountData: AccountAddData = {
        hub_id: hubId,
        accountType: accountType,
        subscriptionTier: formData.subscriptionTier,
        paymentStatus: formData.paymentStatus,
        billingEmail: formData.billingEmail,
      };

      if (accountType === 'business') {
        // B2B Account
        if (!formData.companyName || !formData.billingEmail) {
          throw new Error("Company name and billing email are required");
        }

        if (formData.createUser && !formData.userEmail) {
          throw new Error("User email is required when creating a user");
        }

        accountData = {
          ...accountData,
          companyName: formData.companyName,
          legalName: formData.legalName || formData.companyName,
          billingEmail: formData.billingEmail,
          ...(formData.createUser && {
            userEmail: formData.userEmail,
            userPassword: formData.userPassword,
            firstName: formData.userFirstName,
            lastName: formData.userLastName,
            phoneNumber: formData.userPhoneNumber,
            role: formData.role,
          }),
        };
      } else {
        // B2C Individual Account
        if (!formData.firstName || !formData.lastName || !formData.billingEmail) {
          throw new Error("Name and email are required for individual accounts");
        }

        accountData = {
          ...accountData,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          billingEmail: formData.billingEmail,
          // For B2C, we create both customer and user with same info
          userEmail: formData.billingEmail,
          userPassword: formData.userPassword,
        };
      }

      await onAdd(accountData);
      
      // Reset form and close modal on success
      handleAccountTypeChange('business'); // Reset to default
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
      variant="edit"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Account Type Toggle */}
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => handleAccountTypeChange('business')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              accountType === 'business'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Business Account
          </button>
          <button
            type="button"
            onClick={() => handleAccountTypeChange('individual')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              accountType === 'individual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            Individual Account
          </button>
        </div>

        {accountType === 'business' ? (
          <>
            {/* Business Account Fields */}
            <ModalFormLayout>
              <ModalFormColumn span={2}>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
                    required
                  />
                </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
                  />
                </div>
              </ModalFormColumn>
            </ModalFormLayout>

            {/* Billing Information */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
                    required
                  />
                </div>
              </ModalFormColumn>
            </ModalFormLayout>

            {/* Optional Initial User for B2B */}
            <div className="border-t pt-4">
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  name="createUser"
                  checked={formData.createUser}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <span className="text-sm font-medium text-gray-700">Create an initial user (optional)</span>
              </label>

              {formData.createUser && (
                <ModalFormLayout>
                  <ModalFormColumn>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="userFirstName"
                        value={formData.userFirstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
                        required={formData.createUser}
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
                        name="userLastName"
                        value={formData.userLastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
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
          </>
        ) : (
          <>
            {/* Individual Account Fields */}
            <ModalFormLayout>
              <ModalFormColumn>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
                    required
                  />
                </div>
              </ModalFormColumn>
              <ModalFormColumn>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
                    required
                  />
                </div>
              </ModalFormColumn>
            </ModalFormLayout>

            <ModalFormLayout>
              <ModalFormColumn>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="billingEmail"
                    value={formData.billingEmail}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
                    required
                  />
                </div>
              </ModalFormColumn>
              <ModalFormColumn>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
                  />
                </div>
              </ModalFormColumn>
            </ModalFormLayout>

            <ModalFormLayout>
              <ModalFormColumn span={2}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password (optional)
                  </label>
                  <input
                    type="password"
                    name="userPassword"
                    value={formData.userPassword}
                    onChange={handleInputChange}
                    placeholder="Leave blank to send an invite"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
                  />
                </div>
              </ModalFormColumn>
            </ModalFormLayout>
          </>
        )}

        {/* Common Subscription Fields */}
        <ModalFormLayout>
          <ModalFormColumn>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-3 h-3 inline mr-1" />
                Subscription Tier
              </label>
              <select
                name="subscriptionTier"
                value={formData.subscriptionTier}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="PAST_DUE">Past Due</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
          </ModalFormColumn>
        </ModalFormLayout>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
            {isLoading ? "Creating..." : `Create ${accountType === 'business' ? 'Business' : 'Individual'} Account`}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};