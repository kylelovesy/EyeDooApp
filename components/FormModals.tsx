import React from 'react';
import { EssentialInfoFormModal } from './modals/EssentialInfoForm';
import { PeopleFormModal } from './modals/PeopleForm';
import { PhotosFormModal } from './modals/PhotosForm';
import { TimelineFormModal } from './modals/TimelineForm';

/**
 * Centralized Form Modals Component
 * 
 * This component renders all form modals and manages their visibility through their respective contexts.
 * Each modal is controlled by its own context provider and will only render when isModalVisible is true.
 * 
 * Benefits:
 * - Single place to manage all modals
 * - Consistent modal behavior across the app
 * - Easy to add new modals
 * - Automatic context-based visibility management
 */
export const FormModals: React.FC = () => {
  return (
    <>
      {/* Essential Info Form Modal - for creating new projects */}
      <EssentialInfoFormModal />
      
      {/* Timeline Form Modal - for editing project timeline */}
      <TimelineFormModal />
      
      {/* People/Persona Form Modal - for editing project people */}
      <PeopleFormModal />
      
      {/* Photos Form Modal - for editing photo requirements */}
      <PhotosFormModal />
    </>
  );
};

/**
 * Modal Hooks for easy access to modal controls
 * 
 * These hooks provide a clean API for opening modals from anywhere in the app
 * where the appropriate context providers are available.
 */
export { useForm1 as useEssentialInfoModal } from '../contexts/Form1EssentialInfoContext';
export { useForm2 as useTimelineModal } from '../contexts/Form2TimelineContext';
export { usePersonaForm as usePeopleModal } from '../contexts/Form3PersonaContext';
export { useForm4Photos as usePhotosModal } from '../contexts/Form4PhotosContext';

/**
 * Modal Control Interface
 * 
 * Standard interface that all modal contexts should implement
 */
export interface ModalControlInterface {
  isModalVisible: boolean;
  openModal: (project?: any) => void;
  closeModal: () => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Modal Type Definitions
 * 
 * Enum for different modal types to ensure type safety
 */
export enum ModalType {
  ESSENTIAL_INFO = 'essential_info',
  TIMELINE = 'timeline',
  PEOPLE = 'people',
  PHOTOS = 'photos',
}

/**
 * Utility function to get modal display names
 */
export const getModalDisplayName = (modalType: ModalType): string => {
  const displayNames = {
    [ModalType.ESSENTIAL_INFO]: 'Essential Information',
    [ModalType.TIMELINE]: 'Timeline',
    [ModalType.PEOPLE]: 'People & Persona',
    [ModalType.PHOTOS]: 'Photo Requirements',
  };
  
  return displayNames[modalType];
};

/**
 * Modal Configuration Interface
 * 
 * For future extensibility - allows for configurable modal behavior
 */
export interface ModalConfig {
  type: ModalType;
  title: string;
  subtitle?: string;
  allowBackdropClose?: boolean;
  showCloseButton?: boolean;
  customActions?: boolean;
}

export default FormModals; 