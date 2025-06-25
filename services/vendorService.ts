import { VendorContact, VendorTypes } from '../types/vendors';

// Mock data, simulating a database or API response.
const mockVendors: VendorContact[] = [
    {
        id: '1',
        name: 'John Smith',
        businessName: 'Smith Photography',
        email: 'john@smithphoto.com',
        phone: '+1234567890',
        website: 'https://smithphoto.com',
        instagram: '@smithphoto',
        type: VendorTypes.PHOTOGRAPHER,
        notes: 'Specializes in outdoor weddings',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        businessName: 'Elegant Flowers',
        email: 'sarah@elegantflowers.com',
        phone: '+1987654321',
        type: VendorTypes.FLORIST,
        notes: 'Amazing bridal bouquets',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// In-memory store for demonstration purposes.
let vendors: VendorContact[] = [...mockVendors];

/**
 * Service to manage all vendor data operations.
 * This abstracts the data source from the components.
 * Functions are async to simulate real API calls.
 */
export const vendorService = {
  getVendors: async (): Promise<VendorContact[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...vendors];
  },

  addVendor: async (vendorData: VendorContact): Promise<VendorContact> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newVendor = { ...vendorData, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
    vendors.push(newVendor);
    return newVendor;
  },

  updateVendor: async (vendorId: string, vendorData: VendorContact): Promise<VendorContact> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const vendorIndex = vendors.findIndex(v => v.id === vendorId);
    if (vendorIndex === -1) throw new Error("Vendor not found");
    const updatedVendor = { ...vendors[vendorIndex], ...vendorData, updatedAt: new Date() };
    vendors[vendorIndex] = updatedVendor;
    return updatedVendor;
  },

  deleteVendor: async (vendorId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    vendors = vendors.filter(v => v.id !== vendorId);
  },
};
