import React, { useState } from "react";
import styled from "styled-components";
import { X, Plus, Building2, Mail, User, Phone, Lock, CreditCard } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Button } from "../button";
import { HubType } from "@sms-hub/types";

const ModalContent = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #e5e7eb;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
  color: white;
  padding: 10px 12px;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--hub-primary);
    background: #111827;
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const Select = styled.select`
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
  color: white;
  padding: 10px 12px;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--hub-primary);
    background: #111827;
  }

  option {
    background: #1f2937;
    color: white;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #374151;
`;

const ErrorMessage = styled.div`
  background: #7f1d1d;
  border: 1px solid #991b1b;
  border-radius: 6px;
  padding: 12px;
  color: #fca5a5;
  font-size: 14px;
  margin-bottom: 16px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--hub-primary);
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #e5e7eb;
  cursor: pointer;
`;

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

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <ModalContent>
        <Header>
          <Title>
            <Plus size={20} />
            Add New Account
          </Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>Company Information</SectionTitle>
            
            <FormGroup>
              <Label>
                <Building2 size={14} />
                Company Name *
              </Label>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Legal Name</Label>
              <Input
                type="text"
                name="legalName"
                value={formData.legalName}
                onChange={handleInputChange}
                placeholder="Enter legal name (optional)"
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>Billing Information</SectionTitle>
            
            <FormGroup>
              <Label>
                <Mail size={14} />
                Billing Email *
              </Label>
              <Input
                type="email"
                name="billingEmail"
                value={formData.billingEmail}
                onChange={handleInputChange}
                placeholder="billing@company.com"
                required
              />
            </FormGroup>

            <Row>
              <FormGroup>
                <Label>
                  <CreditCard size={14} />
                  Subscription Tier
                </Label>
                <Select
                  name="subscriptionTier"
                  value={formData.subscriptionTier}
                  onChange={handleInputChange}
                >
                  <option value="FREE">Free</option>
                  <option value="STARTER">Starter</option>
                  <option value="PRO">Pro</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Payment Status</Label>
                <Select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PAST_DUE">Past Due</option>
                  <option value="CANCELED">Canceled</option>
                </Select>
              </FormGroup>
            </Row>
          </Section>

          <Section>
            <SectionTitle>Initial User (Optional)</SectionTitle>
            
            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="createUser"
                name="createUser"
                checked={formData.createUser}
                onChange={handleInputChange}
              />
              <CheckboxLabel htmlFor="createUser">
                Create an initial user for this account
              </CheckboxLabel>
            </CheckboxGroup>

            {formData.createUser && (
              <>
                <Row>
                  <FormGroup>
                    <Label>
                      <User size={14} />
                      First Name
                    </Label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                    />
                  </FormGroup>
                </Row>

                <FormGroup>
                  <Label>
                    <Mail size={14} />
                    User Email *
                  </Label>
                  <Input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    placeholder="user@company.com"
                    required={formData.createUser}
                  />
                </FormGroup>

                <Row>
                  <FormGroup>
                    <Label>
                      <Lock size={14} />
                      Password
                    </Label>
                    <Input
                      type="password"
                      name="userPassword"
                      value={formData.userPassword}
                      onChange={handleInputChange}
                      placeholder="Leave blank to send invite"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <Phone size={14} />
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1234567890"
                    />
                  </FormGroup>
                </Row>

                <FormGroup>
                  <Label>User Role</Label>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="MEMBER">Member</option>
                    <option value="VIEWER">Viewer</option>
                    <option value="SUPPORT">Support</option>
                    <option value="ADMIN">Admin</option>
                    <option value="OWNER">Owner</option>
                  </Select>
                </FormGroup>
              </>
            )}
          </Section>

          <Footer>
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </Footer>
        </Form>
      </ModalContent>
    </BaseModal>
  );
};