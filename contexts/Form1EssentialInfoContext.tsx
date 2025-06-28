import React, { createContext, ReactNode, useContext, useState } from 'react';
import { z } from 'zod';
import { removeUndefinedValues } from '../services/utils/errorHelpers';
import { EventStyle, LocationType, ProjectStatus, ProjectType, Pronoun } from '../types/enum';
import { CreateProjectInput } from '../types/project';
import { form1EssentialInfoSchema } from '../types/project-EssentialInfoSchema';
import { form3PeopleSchema } from '../types/project-PersonaSchema';
import { form4PhotosSchema } from '../types/project-PhotosSchema';
import { CombinedEventsTimelineSchema } from '../types/timeline';
import { useAuth } from './AuthContext';
import { useProjects } from './ProjectContext';
import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

type Form1Data = z.infer<typeof form1EssentialInfoSchema>;

const initialForm1Data: Form1Data = {
  projectName: '',
  projectType: ProjectType.WEDDING,
  projectStatus: ProjectStatus.DRAFT,
  personA: { 
    preferredPronouns: Pronoun.PREFER_NOT_TO_SAY, 
    firstName: '', 
    surname: undefined, 
    contactPhone: undefined, 
    contactEmail: '' 
  },
  personB: { 
    preferredPronouns: Pronoun.PREFER_NOT_TO_SAY, 
    firstName: '', 
    surname: undefined, 
    contactPhone: undefined, 
    contactEmail: '' 
  },
  sharedEmail: undefined,
  eventStyle: EventStyle.MODERN,
  eventDate: new Date(), // Set a default; user will change this in the form
  locations: [{ locationType: LocationType.MAIN_VENUE }],
  notes: undefined,
};

// Use a type alias to avoid the empty interface linting error.
type Form1ContextType = BaseFormContextType<Form1Data>;

const Form1Context = createContext<Form1ContextType | undefined>(undefined);

export const Form1Provider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { createProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const baseContext = useBaseFormContext(
    form1EssentialInfoSchema,
    'form1',
    initialForm1Data,
    {
      errorMessage: 'Failed to save project. Please try again.'
    }
  );

  const handleSubmit = async () => {
    if (!user) {
      baseContext.showSnackbar("Cannot create project, no user is authenticated.", 'error');
      return;
    }

    // Safely parse the data to get either success with data or an error.
    const result = form1EssentialInfoSchema.safeParse(baseContext.formData);

    if (!result.success) {
      // Safely get the first error message from the validation result.
      const firstError = result.error.errors[0]?.message || 'Please check the form for errors.';
      baseContext.showSnackbar(firstError, 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Clean the data by removing undefined values before sending to Firestore
      const cleanedForm1Data = removeUndefinedValues(result.data);
      
      // Use the successfully parsed and validated data (`result.data`).
      const projectToCreate: CreateProjectInput = {
        form1: cleanedForm1Data,
        timeline: CombinedEventsTimelineSchema.parse({}),
        form3: form3PeopleSchema.parse({}),
        form4: form4PhotosSchema.parse({}),
      };

      await createProject(projectToCreate);
      baseContext.showSnackbar('Project created successfully!', 'success');
      
      setTimeout(() => {
        baseContext.closeModal();
      }, 1000);
    } catch (error) {
      console.error("Failed to create project:", error);
      baseContext.showSnackbar('Failed to create project. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: Form1ContextType = {
    ...baseContext,
    isSubmitting: isSubmitting || baseContext.isSubmitting,
    handleSubmit,
  };

  return (
    <Form1Context.Provider value={value}>
      {children}
    </Form1Context.Provider>
  );
};

export const useForm1 = (): Form1ContextType => {
  const context = useContext(Form1Context);
  if (context === undefined) {
    throw new Error('useForm1 must be used within a Form1Provider');
  }
  return context;
};

// Keep backward compatibility
export const ProjectFormProvider = Form1Provider;
export const useProjectForm = useForm1;
