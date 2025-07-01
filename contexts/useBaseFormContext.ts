import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import { Project, UpdateProjectInput } from '../types/project';
import { useProjects } from './ProjectContext';

export interface BaseFormContextType<T> {
  // Modal Management
  isModalVisible: boolean;
  openModal: (project?: Project) => void;
  closeModal: () => void;
  
  // Form Data
  formData: T | null;
  setFormData: React.Dispatch<React.SetStateAction<T | null>>;
  
  // Submission
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  
  // Error & Success Handling
  errors: z.ZodFormattedError<T> | null;
  snackbar: { visible: boolean; message: string; type: 'success' | 'error' };
  hideSnackbar: () => void;
  showSnackbar: (message: string, type: 'success' | 'error') => void;
  
  // Validation
  isValid: boolean;
}

export const useBaseFormContext = <S extends z.ZodType<any, any, any>>(
  schema: S,
  formKey: keyof UpdateProjectInput,
  initialData: z.infer<S>,
  options?: {
    successMessage?: string;
    createSuccessMessage?: string;
    errorMessage?: string;
  }
): BaseFormContextType<z.infer<S>> => {
  type T = z.infer<S>;

  const { updateProject } = useProjects();
  
  // State Management
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<Project | null>(null);
  const [snackbar, setSnackbar] = useState({ 
    visible: false, 
    message: '', 
    type: 'success' as 'success' | 'error' 
  });

  // Helper Functions
  const showSnackbar = useCallback((message: string, type: 'success' | 'error') => {
    setSnackbar({ visible: true, message, type });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, visible: false }));
  }, []);

  // Modal Management
  const openModal = useCallback((project?: Project) => {
    if (project) {
      setProjectToUpdate(project);
       // Fix: Use proper type-safe access
       const projectData = project[formKey as keyof Project];
       setFormData(projectData as T);
    } else {
      setProjectToUpdate(null);
      setFormData(initialData);
    }
    setIsModalVisible(true);
  }, [formKey, initialData]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setFormData(null);
    setProjectToUpdate(null);
  }, []);

  // Validation
  const validationResult = useMemo(() => {
    return formData ? schema.safeParse(formData) : null;
  }, [formData, schema]);

  // const errors = useMemo(() => {
  //   if (!validationResult || validationResult.success) return null;
  //   return validationResult.error.format();
  // }, [validationResult]);

  // Submission
  const handleSubmit = useCallback(async () => {
    if (!formData || !validationResult?.success) {
      let errorMessage = 'Please check the form for errors.';
      if (validationResult && !validationResult.success) {
        errorMessage = validationResult.error.errors[0]?.message || errorMessage;
      }
      showSnackbar(errorMessage, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (projectToUpdate) {
        await updateProject(projectToUpdate.id as string, { [formKey]: validationResult.data } as UpdateProjectInput);
        showSnackbar(options?.successMessage || 'Updated successfully!', 'success');
      } else {
        // Handle creation - this would need to be implemented differently for Form1
        showSnackbar(options?.createSuccessMessage || 'Created successfully!', 'success');
      }
      
      // Don't auto-close modal - let the UI component handle it
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error(`Failed to ${projectToUpdate ? 'update' : 'create'} ${formKey}:`, error);
      showSnackbar(options?.errorMessage || 'Operation failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validationResult, projectToUpdate, formKey, updateProject, options, showSnackbar, closeModal]);

  return {
    isModalVisible,
    openModal,
    closeModal,
    formData,
    setFormData,
    handleSubmit,
    isSubmitting,
    errors: validationResult?.success ? null : (validationResult?.error.format() as z.ZodFormattedError<T, string> | null),
    snackbar,
    hideSnackbar,
    showSnackbar,
    isValid: validationResult?.success ?? false
  };
};