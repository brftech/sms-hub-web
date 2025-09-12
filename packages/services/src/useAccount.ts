import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { 
  Account, 
  CreateAccountData 
} from '@sms-hub/types';
import { createAccountService } from './accountService';

// Create a singleton account service instance
const getAccountService = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are required');
  }
  
  return createAccountService(supabaseUrl, supabaseAnonKey);
};

// Hook for managing a single account
export function useAccount(accountId: string | null) {
  const accountService = getAccountService();
  const queryClient = useQueryClient();

  // Get account details
  const {
    data: account,
    isLoading,
    error,
    refetch: refetchAccount,
  } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => accountService.getAccount(accountId!),
    enabled: !!accountId,
  });

  // Update account mutation
  const updateAccountMutation = useMutation({
    mutationFn: (data: Partial<Account>) => 
      accountService.updateAccount(accountId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', accountId] });
    },
  });

  const updateAccount = useCallback(async (data: Partial<Account>) => {
    return updateAccountMutation.mutateAsync(data);
  }, [updateAccountMutation]);

  const refreshAccount = useCallback(async () => {
    await refetchAccount();
  }, [refetchAccount]);

  return {
    account,
    isLoading,
    error,
    updateAccount,
    refreshAccount,
    
    // Mutation states
    isUpdating: updateAccountMutation.isPending,
  };
}

// Hook for managing multiple accounts (admin view)
export function useAccounts(hubId?: number) {
  const accountService = getAccountService();
  const queryClient = useQueryClient();

  const {
    data: accounts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['accounts', hubId],
    queryFn: () => accountService.getAccountsByHub(hubId!),
    enabled: !!hubId,
  });

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: (data: CreateAccountData) =>
      accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', hubId] });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: (accountId: string) =>
      accountService.deleteAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', hubId] });
    },
  });

  const createAccount = useCallback(async (data: CreateAccountData) => {
    return createAccountMutation.mutateAsync(data);
  }, [createAccountMutation]);

  const deleteAccount = useCallback(async (accountId: string) => {
    return deleteAccountMutation.mutateAsync(accountId);
  }, [deleteAccountMutation]);

  return {
    accounts,
    isLoading,
    error,
    createAccount,
    deleteAccount,
    refreshAccounts: refetch,
    
    // Mutation states
    isCreating: createAccountMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
  };
}

// Hook for getting current user's account
export function useCurrentUserAccount(userId: string | null) {
  const accountService = getAccountService();

  const {
    data: account,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['current-user-account', userId],
    queryFn: () => accountService.getAccountByUserId(userId!),
    enabled: !!userId,
  });

  return {
    account,
    isLoading,
    error,
    refreshAccount: refetch,
  };
}
