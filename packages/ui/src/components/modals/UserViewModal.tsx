import React from "react";
import { X, Edit } from "lucide-react";

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-blue-100 text-sm">
                  {user.role === "superadmin"
                    ? "Super Administrator"
                    : user.role === "admin"
                      ? "Administrator"
                      : user.role === "support"
                        ? "Support"
                        : user.role === "viewer"
                          ? "Viewer"
                          : user.role === "member"
                            ? "Member"
                            : user.role?.toUpperCase() || "USER"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                    {user.account_number || "N/A"}
                  </p>
                </div>

                {user.mobile_phone_number && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                      {user.mobile_phone_number}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Permissions */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Status & Permissions
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Status
                  </label>
                  <div className="mt-1">
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
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hub Assignment
                  </label>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 ring-1 ring-blue-200">
                      {getHubName(user.hub_id)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role Level
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}
                    >
                      {user.role === "superadmin"
                        ? "Super Administrator"
                        : user.role === "admin"
                          ? "Administrator"
                          : user.role === "support"
                            ? "Support"
                            : user.role === "viewer"
                              ? "Viewer"
                              : user.role === "member"
                                ? "Member"
                                : user.role?.toUpperCase() || "USER"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Timeline */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Account Timeline
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900">
                    Account created on{" "}
                    <span className="font-semibold">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "Unknown date"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Account has been active for {getAccountAge(user.created_at)}{" "}
                    days
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
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(user);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit User</span>
          </button>
        </div>
      </div>
    </div>
  );
};
