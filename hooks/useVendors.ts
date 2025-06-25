import { useEffect, useMemo, useState } from 'react';
import { vendorService } from '../services/vendorService';
import { VendorContact } from '../types/vendors';

/**
 * Custom hook for managing vendor data, including fetching, searching, and filtering.
 * It provides a clean API for the UI to interact with vendor state.
 */
export const useVendors = () => {
  const [vendors, setVendors] = useState<VendorContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const loadVendors = async () => {
      try {
        setIsLoading(true);
        const data = await vendorService.getVendors();
        setVendors(data);
        setError(null);
      } catch (e) {
        setError('Failed to fetch vendors.');
      } finally {
        setIsLoading(false);
      }
    };
    loadVendors();
  }, []);

  // Memoized filtering logic
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            vendor.name.toLowerCase().includes(query) ||
            vendor.businessName?.toLowerCase().includes(query) ||
            vendor.email?.toLowerCase().includes(query);
            
        const matchesCategory = !selectedCategory || vendor.type === selectedCategory;

        return matchesSearch && matchesCategory;
    });
  }, [vendors, searchQuery, selectedCategory]);

  // CRUD operations
  const addVendor = async (vendorData: VendorContact) => {
    const newVendor = await vendorService.addVendor(vendorData);
    setVendors(prev => [...prev, newVendor]);
  };

  const updateVendor = async (vendorId: string, vendorData: VendorContact) => {
    const updatedVendor = await vendorService.updateVendor(vendorId, vendorData);
    setVendors(prev => prev.map(v => v.id === vendorId ? updatedVendor : v));
  };
  
  const deleteVendor = async (vendorId: string) => {
    await vendorService.deleteVendor(vendorId);
    setVendors(prev => prev.filter(v => v.id !== vendorId));
  };

  return {
    vendors: filteredVendors,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addVendor,
    updateVendor,
    deleteVendor,
  };
};
