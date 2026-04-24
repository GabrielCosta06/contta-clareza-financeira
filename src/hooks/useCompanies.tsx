import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { companyRepo, subscriptionRepo } from "@/services";
import type { Company, Subscription } from "@/domain/types";
import type { NewCompanyInput } from "@/services/contracts";

export interface CompaniesState {
  active: Company | undefined;
  companies: Company[];
  subscription: Subscription | undefined;
  loading: boolean;
  /** Whether the user can add at least one more company under the current plan. */
  canAddCompany: boolean;
  /** Number of companies that exceed the plan's included quota. */
  extraCompanies: number;
  /** Estimated next invoice (base + addons). */
  estimatedMonthly: number | null;
  switchTo: (companyId: string) => Promise<void>;
  create: (input: NewCompanyInput) => Promise<Company>;
}

export const useCompanies = (): CompaniesState => {
  const qc = useQueryClient();

  const { data: companies = [], isLoading: l1 } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyRepo.list(),
  });
  const { data: active, isLoading: l2 } = useQuery({
    queryKey: ["company"],
    queryFn: () => companyRepo.current(),
  });
  const { data: subscription, isLoading: l3 } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => subscriptionRepo.current(),
  });

  const canAddCompany = useMemo(() => {
    if (!subscription) return false;
    return companies.length < subscription.maxCompanies;
  }, [companies.length, subscription]);

  const extraCompanies = useMemo(() => {
    if (!subscription) return 0;
    return Math.max(0, companies.length - subscription.includedCompanies);
  }, [companies.length, subscription]);

  const estimatedMonthly = useMemo(() => {
    if (!subscription) return null;
    return subscription.basePrice + extraCompanies * subscription.addonPricePerCompany;
  }, [subscription, extraCompanies]);

  const switchTo = useCallback(
    async (companyId: string) => {
      await companyRepo.setActive(companyId);
      // Refresh active company + every dataset that depends on it.
      await qc.invalidateQueries();
    },
    [qc],
  );

  const create = useCallback(
    async (input: NewCompanyInput) => {
      const c = await companyRepo.create(input);
      await qc.invalidateQueries();
      return c;
    },
    [qc],
  );

  return {
    active,
    companies,
    subscription,
    loading: l1 || l2 || l3,
    canAddCompany,
    extraCompanies,
    estimatedMonthly,
    switchTo,
    create,
  };
};
