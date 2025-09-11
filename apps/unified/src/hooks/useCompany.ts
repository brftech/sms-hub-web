import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { companiesService, Company } from '../services/companiesService';

export function useCompany() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user?.company_id) {
        setCompany(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const companyData = await companiesService.instance.getCompanyById(user.company_id);
        setCompany(companyData);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch company');
        setCompany(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [user?.company_id]);

  return { company, isLoading, error };
}