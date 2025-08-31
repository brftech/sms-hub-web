import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@sms-hub/ui";

export interface SMSVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerify: (code: string) => void;
}

const SMSVerificationModal: React.FC<SMSVerificationModalProps> = ({
  isOpen,
  onClose,
  phoneNumber,
  onVerify,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SMS Verification</DialogTitle>
          <DialogDescription>
            Enter the verification code sent to {phoneNumber}
          </DialogDescription>
        </DialogHeader>
        {/* Verification UI implementation */}
      </DialogContent>
    </Dialog>
  );
};

export default SMSVerificationModal;