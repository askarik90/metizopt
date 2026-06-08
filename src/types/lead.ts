export interface Lead {
  name: string;
  company?: string;
  phone: string;
  whatsapp?: string;
  city?: string;
  message?: string;
  category?: string;
  fileUrl?: string;

  search_query?: string;
  page_url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  created_at: string;
}

export interface LeadResponse {
  success: boolean;
  message: string;
  leadId?: string;
}
