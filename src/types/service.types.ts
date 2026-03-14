export interface Service {
  id: string;
  label: string;
  description: string;
  fullDescription: string;
  icon: string;
  color: string;
  duration: string;
  price?: number;
  preparationSteps?: string[];
  benefits?: string[];
  imageUrl?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  services: Service[];
}
