import { useSubmitLeadMutation } from '../store/leadsApi';
import { validateLead, type LeadInput } from '../lib/leads';

/**
 * Validates and saves a form submission. Resolves to an error message to show
 * the visitor, or null once the lead is safely stored.
 */
export function useLeadSubmit() {
  const [submitLead, { isLoading }] = useSubmitLeadMutation();

  const submit = async (input: LeadInput): Promise<string | null> => {
    const invalid = validateLead(input);
    if (invalid) return invalid;
    try {
      await submitLead(input).unwrap();
      return null;
    } catch {
      return "We couldn't send your details. Check your connection and try again.";
    }
  };

  return { submit, submitting: isLoading };
}
