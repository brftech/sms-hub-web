import { useState, useEffect } from "react";
import { X, Users, Building, Globe, Mail, Phone, MapPin, Calendar, UserPlus } from "lucide-react";
import { Company } from "../services/companiesService";

// Lazy import for service to avoid early instantiation
let companiesService: any = null;
const getCompaniesService = () => {
  if (!companiesService) {
    companiesService = require("../services/companiesService").companiesService;
  }
  return companiesService;
};

interface CompanyDetailsModalProps {
  company: Company;
  onClose: () => void;
}

export function CompanyDetailsModal({ company, onClose }: CompanyDetailsModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      const companyUsers = await getCompaniesService().instance.getCompanyUsers(company.id);
      setUsers(companyUsers);
      setLoadingUsers(false);
    };
    fetchUsers();
  }, [company.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {company.public_name}
              </h3>
              <p className="text-sm text-gray-500">
                {company.company_account_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Company Information</h4>
            
            <div className="space-y-3">
              {company.legal_name && (
                <div className="flex items-start space-x-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Legal Name</p>
                    <p className="text-sm text-gray-900">{company.legal_name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Billing Email</p>
                  <p className="text-sm text-gray-900">{company.primary_contact_email || 'N/A'}</p>
                </div>
              </div>

              {company.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{company.phone}</p>
                  </div>
                </div>
              )}

              {company.website && (
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                      {company.website}
                    </a>
                  </div>
                </div>
              )}

              {(company.address || company.city) && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">
                      {company.address && <span>{company.address}<br /></span>}
                      {company.city && <span>{company.city}, </span>}
                      {company.state && <span>{company.state} </span>}
                      {company.zip && <span>{company.zip}</span>}
                      {company.country && <span><br />{company.country}</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Business Details</h4>
            
            <div className="space-y-3">
              {company.industry_vertical && (
                <div>
                  <p className="text-xs text-gray-500">Industry</p>
                  <p className="text-sm text-gray-900">{company.industry_vertical}</p>
                </div>
              )}

              {/* Company size field removed from schema */}

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  company.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {company.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Onboarding step field removed from schema */}

              {company.created_at && (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">
                      {new Date(company.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Company Users</h4>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-1" />
              Add User
            </button>
          </div>

          {loadingUsers ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {user.phone_number || "-"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {user.role || "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No users found for this company</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}