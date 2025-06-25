import React, { createContext, ReactNode, useContext } from 'react';
import { z } from 'zod';
// Assuming your combined schema for the 'form2' data is in this file
import { form2TimelineSchema } from '../types/project-TimelineSchema';
import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

// 1. Infer the form data type from the Zod schema
type Form2Data = z.infer<typeof form2TimelineSchema>;

// 2. Define the initial state for an empty timeline form
// This will be used when creating a new project or when data is not available.
const initialForm2Data: Form2Data = {
  events: [],
};

// 3. Define the context type, extending the generic base type
// This provides type safety and autocompletion for consumers of the context.
type Form2ContextType = BaseFormContextType<Form2Data>;

// 4. Create the React Context
const Form2Context = createContext<Form2ContextType | undefined>(undefined);

/**
 * Provides state and functionality for the Timeline Form (Form 2).
 * It uses the generic `useBaseFormContext` to handle all common logic,
 * such as modal visibility, data handling, validation, and submission.
 */
export const Form2Provider = ({ children }: { children: ReactNode }) => {
  // All the complex logic is encapsulated in this single hook call.
  const context = useBaseFormContext(
    // The Zod schema for validation
    form2TimelineSchema,
    // The key in the main project document where this data is stored
    'form2',
    // The default data for a new, empty form
    initialForm2Data,
    // Custom messages for snackbar notifications
    {
      successMessage: 'Timeline updated successfully!',
      errorMessage: 'Failed to update timeline. Please try again.',
    }
  );

  return (
    <Form2Context.Provider value={context}>
      {children}
    </Form2Context.Provider>
  );
};

/**
 * Custom hook to easily access the Form2TimelineContext.
 * This is the primary way components will interact with the timeline form state.
 */
export const useForm2 = (): Form2ContextType => {
  const context = useContext(Form2Context);
  if (context === undefined) {
    throw new Error('useForm2 must be used within a Form2Provider');
  }
  return context;
};

// --- Backward Compatibility & Aliases ---
// These exports maintain consistency with your other files.
export const TimelineFormProvider = Form2Provider;
export const Form2TimelineProvider = Form2Provider;
export const useTimelineForm = useForm2;

// import React, { createContext, ReactNode, useContext } from 'react';
// import { z } from 'zod';
// import { form2TimelineSchema } from '../types/project-TimelineSchema';
// import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

// type Form2Data = z.infer<typeof form2TimelineSchema>;

// const initialForm2Data: Form2Data = {
//   events: []
// };

// type Form2ContextType = BaseFormContextType<Form2Data>;

// const Form2Context = createContext<Form2ContextType | undefined>(undefined);

// export const Form2Provider = ({ children }: { children: ReactNode }) => {
//   const context = useBaseFormContext(
//     form2TimelineSchema,
//     'form2',
//     initialForm2Data,
//     {
//       successMessage: 'Timeline updated successfully!',
//       errorMessage: 'Failed to update timeline. Please try again.'
//     }
//   );

//   return (
//     <Form2Context.Provider value={context}>
//       {children}
//     </Form2Context.Provider>
//   );
// };

// export const useForm2 = (): Form2ContextType => {
//   const context = useContext(Form2Context);
//   if (context === undefined) {
//     throw new Error('useForm2 must be used within a Form2Provider');
//   }
//   return context;
// };

// // Keep backward compatibility
// export const TimelineFormProvider = Form2Provider;
// export const Form2TimelineProvider = Form2Provider;
// export const useTimelineForm = useForm2;
