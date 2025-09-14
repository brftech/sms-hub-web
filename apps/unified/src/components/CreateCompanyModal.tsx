import { useState } from "react";
import { X } from "lucide-react";
import { Company } from "../services/companiesService";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (company: Partial<Company>) => void;
  isCreating: boolean;
  hubId: number;
}

export function CreateCompanyModal({
  isOpen,
  onClose,
  onCreate,
  isCreating,
  hubId,
}: CreateCompanyModalProps) {
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    hub_id: hubId,
    is_active: true,
  });

  const generateAccountNumber = () => {
    const prefix = hubId === 1 ? "GNY" : hubId === 2 ? "PMD" : hubId === 3 ? "PTX" : "PTC";
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}-${randomNum}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.public_name || !newCompany.primary_contact_email) {
      alert("Please fill in required fields");
      return;
    }

    onCreate({
      ...newCompany,
      company_account_number: generateAccountNumber(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Create New Company
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Public Name *
              </label>
              <input
                type="text"
                required
                value={newCompany.public_name || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  public_name: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Legal Name
              </label>
              <input
                type="text"
                value={newCompany.legal_name || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  legal_name: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Contact Email *
              </label>
              <input
                type="email"
                required
                value={newCompany.primary_contact_email || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  primary_contact_email: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Phone
              </label>
              <input
                type="tel"
                value={newCompany.phone || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  phone: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <input
                type="text"
                value={newCompany.industry_vertical || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  industry_vertical: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              {/* Company size field removed from schema */}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={newCompany.website || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  website: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={newCompany.address || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  address: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={newCompany.city || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  city: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Region
              </label>
              <input
                type="text"
                value={newCompany.state || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  state: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                value={newCompany.zip || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  zip: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={newCompany.country_of_registration || ""}
                onChange={(e) => setNewCompany({
                  ...newCompany,
                  country_of_registration: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="United States"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating..." : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}