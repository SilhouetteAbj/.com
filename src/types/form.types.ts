export interface ContactFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt?: string;
  status?: 'new' | 'read' | 'responded';
}

export interface InvestorInquiryFormData {
  id?: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  investmentType: 'equity' | 'partnership' | 'loan' | 'other';
  investmentAmount?: string;
  message: string;
  createdAt?: string;
  status?: 'new' | 'reviewing' | 'contacted';
}
