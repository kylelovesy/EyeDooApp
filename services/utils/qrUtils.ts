import { VendorContact, VendorTypes } from '../../types/vendors';

/**
 * Parses a string from a QR code into a VendorContact object.
 * This utility function is isolated to handle a specific task.
 * It supports JSON, vCard, URLs, and plain text formats.
 * @param data The raw string data from the QR code.
 * @returns A partial VendorContact object.
 */
export const parseQRCodeData = (data: string): Partial<VendorContact> => {
  console.log('Parsing QR code data:', data);

  // Try to parse as JSON first
  try {
    const jsonData = JSON.parse(data);
    if (typeof jsonData === 'object' && jsonData !== null) {
      // Basic validation for JSON structure
      const vendorData: Partial<VendorContact> = {};
      if (typeof jsonData.name === 'string') vendorData.name = jsonData.name;
      if (typeof jsonData.businessName === 'string') vendorData.businessName = jsonData.businessName;
      if (typeof jsonData.email === 'string') vendorData.email = jsonData.email;
      if (typeof jsonData.phone === 'string') vendorData.phone = jsonData.phone;
      if (typeof jsonData.website === 'string') vendorData.website = jsonData.website;
      if (typeof jsonData.instagram === 'string') vendorData.instagram = jsonData.instagram;
      if (typeof jsonData.facebook === 'string') vendorData.facebook = jsonData.facebook;
      if (typeof jsonData.notes === 'string') vendorData.notes = jsonData.notes;
      if (Object.values(VendorTypes).includes(jsonData.type)) {
          vendorData.type = jsonData.type;
      }
      console.log('Parsed JSON data:', vendorData);
      return vendorData;
    }
  } catch (e) {
    // Not JSON, continue to other parsing methods
    console.log('Not JSON format, trying other formats...');
  }

  // Check if it's a URL (website, Instagram, Facebook, etc.)
  const urlRegex = /^https?:\/\/.+/i;
  if (urlRegex.test(data)) {
    const contact: Partial<VendorContact> = { website: data };
    
    // Extract business name from domain if possible
    try {
      const url = new URL(data);
      const hostname = url.hostname.replace('www.', '');
      
      // Check for social media platforms
      if (hostname.includes('instagram.com')) {
        const pathMatch = data.match(/instagram\.com\/([^/?]+)/);
        if (pathMatch) {
          contact.instagram = `@${pathMatch[1]}`;
          contact.businessName = pathMatch[1];
        }
      } else if (hostname.includes('facebook.com')) {
        contact.facebook = data;
        const pathMatch = data.match(/facebook\.com\/([^/?]+)/);
        if (pathMatch) {
          contact.businessName = pathMatch[1];
        }
      } else {
        // Extract business name from domain
        contact.businessName = hostname.split('.')[0];
      }
    } catch (urlError) {
      console.log('Error parsing URL:', urlError);
    }
    
    console.log('Parsed URL data:', contact);
    return contact;
  }

  // Check if it's an email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(data)) {
    const contact: Partial<VendorContact> = { 
      email: data,
      businessName: data.split('@')[0] // Use email prefix as business name
    };
    console.log('Parsed email data:', contact);
    return contact;
  }

  // Check if it's a phone number
  const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
  if (phoneRegex.test(data.replace(/[\s\-\(\)]/g, ''))) {
    const contact: Partial<VendorContact> = { 
      phone: data,
      name: `Contact ${data}` // Provide a default name
    };
    console.log('Parsed phone data:', contact);
    return contact;
  }

  // Try vCard parsing (supports BEGIN:VCARD format and simple line format)
  if (data.includes('BEGIN:VCARD') || data.includes('FN:') || data.includes('ORG:')) {
    const contact: Partial<VendorContact> = {};
    const lines = data.split('\n');

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Standard vCard fields
      if (trimmedLine.startsWith('FN:')) contact.name = trimmedLine.substring(3).trim();
      if (trimmedLine.startsWith('N:')) {
        // N: format is Last;First;Middle;Prefix;Suffix
        const nameParts = trimmedLine.substring(2).split(';');
        if (!contact.name && nameParts.length >= 2) {
          contact.name = `${nameParts[1]} ${nameParts[0]}`.trim();
        }
      }
      if (trimmedLine.startsWith('ORG:')) contact.businessName = trimmedLine.substring(4).trim();
      if (trimmedLine.startsWith('EMAIL:') || trimmedLine.startsWith('EMAIL;')) {
        const emailMatch = trimmedLine.match(/EMAIL[^:]*:(.+)/);
        if (emailMatch) contact.email = emailMatch[1].trim();
      }
      if (trimmedLine.startsWith('TEL:') || trimmedLine.startsWith('TEL;')) {
        const phoneMatch = trimmedLine.match(/TEL[^:]*:(.+)/);
        if (phoneMatch) contact.phone = phoneMatch[1].trim();
      }
      if (trimmedLine.startsWith('URL:')) contact.website = trimmedLine.substring(4).trim();
      if (trimmedLine.startsWith('NOTE:')) contact.notes = trimmedLine.substring(5).trim();
    });

    console.log('Parsed vCard data:', contact);
    return contact;
  }

  // If none of the above formats work, treat as plain text (could be a business name)
  const plainTextContact: Partial<VendorContact> = {
    businessName: data.trim(),
    name: data.trim()
  };
  
  console.log('Parsed plain text data:', plainTextContact);
  return plainTextContact;
};
