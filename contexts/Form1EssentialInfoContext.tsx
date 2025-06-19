import React, { createContext, ReactNode, useContext } from 'react';
import { z } from 'zod';
import { CreateProjectInput } from '../types/project';
import { form1EssentialInfoSchema } from '../types/project-EssentialInfoSchema';
import { form3PeopleSchema } from '../types/project-PersonaSchema';
import { form4PhotosSchema } from '../types/project-PhotosSchema';
import { form2TimelineSchema } from '../types/project-TimelineSchema';
import { useAuth } from './AuthContext';
import { useProjects } from './ProjectContext';
import { BaseFormContextType, useBaseFormContext } from './useBaseFormContext';

type Form1Data = z.infer<typeof form1EssentialInfoSchema>;

const initialForm1Data: Form1Data = {
  name: '',
  type: 'Wedding',
  status: 'Draft',
  personA: { 
    preferredPronouns: 'Prefer not to say', 
    firstName: '', 
    surname: '', 
    contactPhone: '', 
    contactEmail: '' 
  },
  personB: { 
    preferredPronouns: 'Prefer not to say', 
    firstName: '', 
    surname: '', 
    contactPhone: '', 
    contactEmail: '' 
  },
  locations: [],
  notes: '',
};

// Extended interface for Form1-specific functionality
interface Form1ContextType extends BaseFormContextType<Form1Data> {
  handleCreateProject: () => Promise<void>;
}

const Form1Context = createContext<Form1ContextType | undefined>(undefined);

export const Form1Provider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { createProject } = useProjects();
  
  // Use the base form context
  const baseContext = useBaseFormContext(
    form1EssentialInfoSchema,
    'form1',
    initialForm1Data,
    {
      successMessage: 'Project updated successfully!',
      createSuccessMessage: 'Project created successfully!',
      errorMessage: 'Failed to save project. Please try again.'
    }
  );

  // Form1-specific create project function
  const handleCreateProject = async () => {
    if (!user) {
      baseContext.showSnackbar?.("Cannot create project, no user is authenticated.", 'error');
      return;
    }

    if (!baseContext.isValid || !baseContext.formData) {
      const firstError = baseContext.errors ? 
        Object.values(baseContext.errors as any)[0]?._errors?.[0] : 
        'Please check the form for errors.';
      baseContext.showSnackbar?.(firstError || 'Please check the form for errors.', 'error');
      return;
    }

    try {
      const projectToCreate: CreateProjectInput = {
        userId: user.id,
        form1: baseContext.formData,
        form2: form2TimelineSchema.parse({}),
        form3: form3PeopleSchema.parse({}),
        form4: form4PhotosSchema.parse({}),
      };

      await createProject(projectToCreate);
      baseContext.showSnackbar?.('Project created successfully!', 'success');
      
      setTimeout(() => {
        baseContext.closeModal();
      }, 1000);
    } catch (error) {
      console.error("Failed to create project:", error);
      baseContext.showSnackbar?.('Failed to create project. Please try again.', 'error');
    }
  };

  const value: Form1ContextType = {
    ...baseContext,
    handleCreateProject,
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
