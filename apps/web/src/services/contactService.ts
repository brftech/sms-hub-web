import { supabase } from "@/integrations/supabase/client";
import { ContactData } from "@/types";

class ContactService {
  async submitContact(data: ContactData, hubId: number) {
    try {
      // Try to use Supabase function first
      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        "submit-contact",
        {
          body: {
            name: `${data.firstName} ${data.lastName}`.trim(),
            email: data.email,
            phone: data.phone || undefined,
            company: data.company || undefined,
            platform_interest: "Gnymble",
            message: data.message || "Interested to learn more...",
            hub_id: hubId,
          },
        }
      );

      if (functionError) {
        console.warn('Supabase function not available, falling back to direct insert:', functionError);
        
        // Fallback to direct database insert
        const { data: lead, error } = await supabase
          .from('leads')
          .insert([{
            hub_id: hubId,
            name: `${data.firstName} ${data.lastName}`.trim(),
            email: data.email,
            lead_phone_number: data.phone || undefined,
            company_name: data.company || undefined,
            platform_interest: "web_contact",
            message: data.message || "Interested to learn more...",
            source: 'contact_form'
          }])
          .select()
          .single();

        if (error) throw error;
        return lead;
      }

      return responseData;
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    }
  }
}

export const contactService = new ContactService();