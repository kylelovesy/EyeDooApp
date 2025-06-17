// src/context/ProjectFormContext.tsx
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { createNewProject } from '../services/projectService';
import { ProjectStatus, ProjectType, TestFormData } from '../types/project';
import { combinedProjectSchema } from '../types/projectSchema';

// Define the initial state for a new form
const initialFormData: TestFormData = {
  form1Data: { projectName: '', projectType: ProjectType.WEDDING },
  form2Data: { clientName: '', venue: '' },
  form3Data: { eventDay: '', eventDate: '' },
  form4Data: { eventStyle: '', projectStatus: ProjectStatus.DRAFT },
};

// Define the shape of the context
interface ProjectFormContextType {
  formData: TestFormData;
  setFormData: React.Dispatch<React.SetStateAction<TestFormData>>;
  isModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleSubmit: (userId: string) => Promise<void>;
  isSubmittable: boolean;
  errors: any; // You can create a more specific type for Zod errors
}

// Create the context
const ProjectFormContext = createContext<ProjectFormContextType | undefined>(undefined);

// Create the Provider component
export const ProjectFormProvider = ({ children }: { children: ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState<TestFormData>(initialFormData);
  const [errors, setErrors] = useState<any>({});

  // Memoize the validation result to avoid re-calculating on every render
  const validationResult = useMemo(() => {
    return combinedProjectSchema.safeParse(formData);
  }, [formData]);

  const isSubmittable = validationResult.success;

  const openModal = () => setIsModalVisible(true);
  
  const closeModal = () => {
    setIsModalVisible(false);
    setFormData(initialFormData); // Reset form on close
    setErrors({});
  };

  const handleSubmit = async (userId: string) => {
    console.log('handleSubmit', formData);
    console.log('handleSubmit', validationResult);
    console.log('handleSubmit', isSubmittable);
    console.log('handleSubmit', errors);
    console.log('handleSubmit', userId);
    if (!isSubmittable) {
      console.log('Submission failed:', validationResult.error.flatten().fieldErrors);
      setErrors(validationResult.error.flatten().fieldErrors);
      return;
    }
    try {
      await createNewProject(formData, userId);
      closeModal();
      // Here you would typically trigger a refresh of the project list
    } catch (error) {
      console.error(error);
      // Handle submission error (e.g., show a toast message)
    }
  };

  const value = { formData, setFormData, isModalVisible, openModal, closeModal, handleSubmit, isSubmittable, errors };

  return (
    <ProjectFormContext.Provider value={value}>
      {children}
    </ProjectFormContext.Provider>
  );
};

// Custom hook to easily consume the context
export const useProjectForm = () => {
  const context = useContext(ProjectFormContext);
  if (context === undefined) {
    throw new Error('useProjectForm must be used within a ProjectFormProvider');
  }
  return context;
};