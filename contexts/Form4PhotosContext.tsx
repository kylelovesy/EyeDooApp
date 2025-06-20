import React, { createContext, ReactNode, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { form4PhotosSchema } from '../types/project-PhotosSchema';
import {
  CandidShotSchema,
  CoupleShotSchema,
  GroupShotSchema,
  PhotoRequestSchema
} from '../types/reusableSchemas';
import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

type Form4Data = z.infer<typeof form4PhotosSchema>;
type CandidShot = z.infer<typeof CandidShotSchema>;
type CoupleShot = z.infer<typeof CoupleShotSchema>;
type GroupShot = z.infer<typeof GroupShotSchema>;
type PhotoRequest = z.infer<typeof PhotoRequestSchema>;

const initialForm4Data: Form4Data = {
  groupShots: [],
  coupleShots: [],
  candidShots: [],
  photoRequests: [],
  mustHaveMoments: [],
  sentimentalMoments: [],
};

// Extended interface for Form4-specific functionality
interface Form4ContextType extends BaseFormContextType<Form4Data> {
  addShot: (shotType: keyof Form4Data) => void;
  removeShot: (shotType: keyof Form4Data, id: string) => void;
  updateShot: (shotType: keyof Form4Data, id: string, updates: Partial<CandidShot | CoupleShot | GroupShot | PhotoRequest>) => void;
}

const Form4Context = createContext<Form4ContextType | undefined>(undefined);

export const Form4Provider = ({ children }: { children: ReactNode }) => {
  const baseContext = useBaseFormContext(
    form4PhotosSchema,
    'form4',
    initialForm4Data,
    {
      successMessage: 'Photo requirements updated successfully!',
      errorMessage: 'Failed to update photo requirements. Please try again.'
    }
  );

  // Form4-specific functions with proper typing
  const addShot = (shotType: keyof Form4Data) => {
    let newShot: any;
    
    switch (shotType) {
      case 'groupShots':
        newShot = { 
          id: uuidv4(), 
          groupShotType: 'Other', 
          groupDescription: '',
          title: '',
          location: '',
          notes: '',
          importance: 'Medium',
          alwaysInclude: false
        };
        break;
      case 'coupleShots':
        newShot = { 
          id: uuidv4(), 
          coupleShotType: 'Other',
          title: '',
          location: '',
          notes: '',
          importance: 'Medium',
          alwaysInclude: false
        };
        break;
      case 'candidShots':
        newShot = { 
          id: uuidv4(), 
          candidShotType: 'Other',
          title: '',
          location: '',
          notes: '',
          importance: 'Medium',
          alwaysInclude: false
        };
        break;
      case 'photoRequests':
      case 'mustHaveMoments':
      case 'sentimentalMoments':
        newShot = { 
          id: uuidv4(), 
          photoRequestType: 'Other',
          title: '',
          location: '',
          notes: '',
          importance: 'Medium'
        };
        break;
      default:
        return;
    }

    baseContext.setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [shotType]: [...(prev[shotType] as any[] || []), newShot]
      };
    });
  };

  const removeShot = (shotType: keyof Form4Data, id: string) => {
    baseContext.setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [shotType]: (prev[shotType] as any[]).filter(shot => shot.id !== id)
      };
    });
  };
  
  const updateShot = (shotType: keyof Form4Data, id: string, updates: Partial<CandidShot | CoupleShot | GroupShot | PhotoRequest>) => {
    baseContext.setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [shotType]: (prev[shotType] as any[]).map(shot => 
          shot.id === id ? { ...shot, ...updates } : shot
        )
      };
    });
  };

  const value: Form4ContextType = {
    ...baseContext,
    addShot,
    removeShot,
    updateShot,
  };

  return (
    <Form4Context.Provider value={value}>
      {children}
    </Form4Context.Provider>
  );
};

export const useForm4 = (): Form4ContextType => {
  const context = useContext(Form4Context);
  if (context === undefined) {
    throw new Error('useForm4 must be used within a Form4Provider');
  }
  return context;
};

// Keep backward compatibility
export const Form4PhotosProvider = Form4Provider;
export const useForm4Photos = useForm4;
// import React, { createContext, ReactNode, useContext } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { z } from 'zod';
// import { form4PhotosSchema } from '../types/project-PhotosSchema';
// import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

// type Form4Data = z.infer<typeof form4PhotosSchema>;

// const initialForm4Data: Form4Data = {
//   groupShots: [],
//   coupleShots: [],
//   candidShots: [],
//   photoRequests: [],
//   mustHaveMoments: [],
//   sentimentalMoments: [],
// };

// // Extended interface for Form4-specific functionality
// interface Form4ContextType extends BaseFormContextType<Form4Data> {
//   addShot: (shotType: keyof Form4Data) => void;
//   removeShot: (shotType: keyof Form4Data, id: string) => void;
//   updateShot: (shotType: keyof Form4Data, id: string, updates: any) => void;
// }

// const Form4Context = createContext<Form4ContextType | undefined>(undefined);

// export const Form4Provider = ({ children }: { children: ReactNode }) => {
//   const baseContext = useBaseFormContext(
//     form4PhotosSchema,
//     'form4',
//     initialForm4Data,
//     {
//       successMessage: 'Photo requirements updated successfully!',
//       errorMessage: 'Failed to update photo requirements. Please try again.'
//     }
//   );

//   // Form4-specific functions
//   const addShot = (shotType: keyof Form4Data) => {
//     const newShot = { id: uuidv4(), groupShotType: 'Other', groupDescription: '' };
//     baseContext.setFormData(prev => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         [shotType]: [...(prev[shotType] as any[] || []), newShot]
//       };
//     });
//   };

//   const removeShot = (shotType: keyof Form4Data, id: string) => {
//     baseContext.setFormData(prev => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         [shotType]: (prev[shotType] as any[]).filter(shot => shot.id !== id)
//       };
//     });
//   };
  
//   const updateShot = (shotType: keyof Form4Data, id: string, updates: any) => {
//     baseContext.setFormData(prev => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         [shotType]: (prev[shotType] as any[]).map(shot => 
//           shot.id === id ? { ...shot, ...updates } : shot
//         )
//       };
//     });
//   };

//   const value: Form4ContextType = {
//     ...baseContext,
//     addShot,
//     removeShot,
//     updateShot,
//   };

//   return (
//     <Form4Context.Provider value={value}>
//       {children}
//     </Form4Context.Provider>
//   );
// };

// export const useForm4 = (): Form4ContextType => {
//   const context = useContext(Form4Context);
//   if (context === undefined) {
//     throw new Error('useForm4 must be used within a Form4Provider');
//   }
//   return context;
// };

// // Keep backward compatibility
// export const Form4PhotosProvider = Form4Provider;
// export const useForm4Photos = useForm4;
