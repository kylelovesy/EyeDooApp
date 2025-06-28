import React from 'react';
import { useTimelineContext } from '../contexts/TimelineContext';
import { EssentialInfoFormModal } from './modals/EssentialInfoForm';
import { PeopleFormModal } from './modals/PeopleForm';
import { PhotosFormModal } from './modals/PhotosForm';
import { TimelineEventForm } from './timeline/TimelineEventForm';
import BaseFormModal from './ui/BaseFormModal';
// Import the specific event type for the onSubmit handler
import { TTimelineEventForm } from '../types/timeline';


export const FormModals: React.FC = () => {
  return (
    <>
      <EssentialInfoFormModal />
      <TimelineFormModal />
      <PeopleFormModal />
      <PhotosFormModal />
    </>
  );
};

export { useForm1 as useEssentialInfoModal } from '../contexts/Form1EssentialInfoContext';
export { usePersonaForm as usePeopleModal } from '../contexts/Form3PersonaContext';
export { useForm4Photos as usePhotosModal } from '../contexts/Form4PhotosContext';
export { useTimelineContext as useTimelineModal } from '../contexts/TimelineContext';


export interface ModalControlInterface {
  isModalVisible: boolean;
  openModal: (project?: any) => void;
  closeModal: () => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export enum ModalType {
  ESSENTIAL_INFO = 'essential_info',
  TIMELINE = 'timeline',
  PEOPLE = 'people',
  PHOTOS = 'photos',
}

export const getModalDisplayName = (modalType: ModalType): string => {
  const displayNames = {
    [ModalType.ESSENTIAL_INFO]: 'Essential Information',
    [ModalType.TIMELINE]: 'Timeline',
    [ModalType.PEOPLE]: 'People & Persona',
    [ModalType.PHOTOS]: 'Photo Requirements',
  };
  
  return displayNames[modalType];
};

export interface ModalConfig {
  type: ModalType;
  title: string;
  subtitle?: string;
  allowBackdropClose?: boolean;
  showCloseButton?: boolean;
  customActions?: boolean;
}

// This self-contained component defines the modal for the timeline.
const TimelineFormModal = () => {
  const { 
    isModalVisible, 
    closeModal, 
    activeProject, 
    addEvent,
    isSubmitting,
  } = useTimelineContext();
  
  // Don't render if the modal isn't visible or if there's no project selected.
  if (!isModalVisible || !activeProject) return null;

  const handleAddEvent = (event: TTimelineEventForm) => {
    addEvent(activeProject.id, event);
  };
  
  return (
    <BaseFormModal
      visible={isModalVisible}
      onClose={closeModal}
      title="Edit Timeline"
      // FIX: The 'context' prop has been removed as it is not a valid prop for BaseFormModal.
      // The buttons and submission logic are now handled entirely within TimelineEventForm.
    >
      <TimelineEventForm
        projectDate={activeProject.form1.eventDate}
        onSubmit={handleAddEvent}
        onCancel={() => { /* The inner form's cancel can be a no-op */ }}
        isLoading={isSubmitting}
      />
      {/* You would typically also list the existing events from the context here,
        allowing the user to edit or delete them. That functionality would be
        added separately but this code fixes the current errors.
      */}
    </BaseFormModal>
  );
};

export default FormModals;


// import React from 'react';
// import { useTimelineContext } from '../contexts/TimelineContext';
// import { EssentialInfoFormModal } from './modals/EssentialInfoForm';
// import { PeopleFormModal } from './modals/PeopleForm';
// import { PhotosFormModal } from './modals/PhotosForm';
// import { TimelineEventForm } from './timeline/TimelineEventForm';
// import BaseFormModal from './ui/BaseFormModal';

// /**
//  * Centralized Form Modals Component
//  * 
//  * This component renders all form modals and manages their visibility through their respective contexts.
//  * Each modal is controlled by its own context provider and will only render when isModalVisible is true.
//  * 
//  * Benefits:
//  * - Single place to manage all modals
//  * - Consistent modal behavior across the app
//  * - Easy to add new modals
//  * - Automatic context-based visibility management
//  */
// export const FormModals: React.FC = () => {
//   return (
//     <>
//       {/* Essential Info Form Modal - for creating new projects */}
//       <EssentialInfoFormModal />
      
//       {/* Timeline Form Modal - for editing project timeline */}
//       <TimelineFormModal />
      
//       {/* People/Persona Form Modal - for editing project people */}
//       <PeopleFormModal />
      
//       {/* Photos Form Modal - for editing photo requirements */}
//       <PhotosFormModal />
//     </>
//   );
// };

// /**
//  * Modal Hooks for easy access to modal controls
//  * 
//  * These hooks provide a clean API for opening modals from anywhere in the app
//  * where the appropriate context providers are available.
//  */
// export { useForm1 as useEssentialInfoModal } from '../contexts/Form1EssentialInfoContext';
// export { usePersonaForm as usePeopleModal } from '../contexts/Form3PersonaContext';
// export { useForm4Photos as usePhotosModal } from '../contexts/Form4PhotosContext';
// export { useTimelineContext as useTimelineModal } from '../contexts/TimelineContext';

// /**
//  * Modal Control Interface
//  * 
//  * Standard interface that all modal contexts should implement
//  */
// export interface ModalControlInterface {
//   isModalVisible: boolean;
//   openModal: (project?: any) => void;
//   closeModal: () => void;
//   handleSubmit: () => Promise<void>;
//   isSubmitting: boolean;
// }

// /**
//  * Modal Type Definitions
//  * 
//  * Enum for different modal types to ensure type safety
//  */
// export enum ModalType {
//   ESSENTIAL_INFO = 'essential_info',
//   TIMELINE = 'timeline',
//   PEOPLE = 'people',
//   PHOTOS = 'photos',
// }

// /**
//  * Utility function to get modal display names
//  */
// export const getModalDisplayName = (modalType: ModalType): string => {
//   const displayNames = {
//     [ModalType.ESSENTIAL_INFO]: 'Essential Information',
//     [ModalType.TIMELINE]: 'Timeline',
//     [ModalType.PEOPLE]: 'People & Persona',
//     [ModalType.PHOTOS]: 'Photo Requirements',
//   };
  
//   return displayNames[modalType];
// };

// /**
//  * Modal Configuration Interface
//  * 
//  * For future extensibility - allows for configurable modal behavior
//  */
// export interface ModalConfig {
//   type: ModalType;
//   title: string;
//   subtitle?: string;
//   allowBackdropClose?: boolean;
//   showCloseButton?: boolean;
//   customActions?: boolean;
// }

// const TimelineFormModal = () => {
//   const { isModalVisible, closeModal, currentProject } = useTimelineContext();
  
//   if (!isModalVisible || !currentProject) return null;
  
//   return (
//     <BaseFormModal
//       visible={isModalVisible}
//       onClose={closeModal}
//       title="Add Timeline Event"
//     >
//       <TimelineEventForm
//         projectDate={currentProject.form1.eventDate}
//         onSubmit={handleSubmit}
//         onCancel={closeModal}
//       />
//     </BaseFormModal>
//   );
// };

// export default FormModals; 