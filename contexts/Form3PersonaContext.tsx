import React, { createContext, ReactNode, useContext } from 'react';
import { z } from 'zod';
import { form3PeopleSchema } from '../types/project-PersonaSchema';
import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

type Form3Data = z.infer<typeof form3PeopleSchema>;

const initialForm3Data: Form3Data = {
  immediateFamily: [],
  extendedFamily: [],
  weddingParty: [],
  otherKeyPeople: [],
  familySituations: false,
  familySituationsNotes: '',
  guestsToAvoid: false,
  guestsToAvoidNotes: '',
  surprises: false,
  surprisesNotes: '',
};

type Form3ContextType = BaseFormContextType<Form3Data>;

const Form3Context = createContext<Form3ContextType | undefined>(undefined);

export const Form3Provider = ({ children }: { children: ReactNode }) => {
  const context = useBaseFormContext(
    form3PeopleSchema,
    'form3',
    initialForm3Data,
    {
      successMessage: 'People & persona updated successfully!',
      errorMessage: 'Failed to update people & persona. Please try again.'
    }
  );

  return (
    <Form3Context.Provider value={context}>
      {children}
    </Form3Context.Provider>
  );
};

export const useForm3 = (): Form3ContextType => {
  const context = useContext(Form3Context);
  if (context === undefined) {
    throw new Error('useForm3 must be used within a Form3Provider');
  }
  return context;
};

// Keep backward compatibility
export const PersonaFormProvider = Form3Provider;
export const Form3PersonaProvider = Form3Provider;
export const usePersonaForm = useForm3;
