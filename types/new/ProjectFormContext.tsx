import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState
} from 'react';
import { z } from 'zod';
import { useProjects } from './ProjectContext';

// --- 1. Import the correct CREATE schema ---
import { CombinedProjectCreateSchema } from './projectSchema'; // Adjust path

// --- 2. Infer the form data type from the Zod schema ---
type CreateProjectInput = z.infer<typeof CombinedProjectCreateSchema>;

// --- 3. Define the initial state for the form, matching the nested schema ---
const initialFormData: CreateProjectInput = {
  form1: {
    userId: '',
    name: '',
    type: 'Wedding',
    status: 'Draft',
    personA: {
        preferredPronouns: 'Prefer not to say',
        firstName: '',
        surname: '',
        contactPhone: '',
        contactEmail: '',
    },
    personB: {
        preferredPronouns: 'Prefer not to say',
        firstName: '',
        surname: '',
        contactPhone: '',
        contactEmail: '',
    },
    locations: [],
    notes: '',
  },
  form2: {
    events: []
  },
  form3: {
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
  },
  form4: {
    groupShots: [],
    coupleShots: [],
    candidShots: [],
    photoRequests: [],
    mustHaveMoments: [],
    sentimentalMoments: [],
  },
};

// Define the shape of the context
interface ProjectFormContextType {
  formData: CreateProjectInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateProjectInput>>;
  isModalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isSubmittable: boolean;
  errors: z.ZodFormattedError<CreateProjectInput> | null;
}

const ProjectFormContext = createContext<ProjectFormContextType | undefined>(undefined);

export const ProjectFormProvider = ({ children }: { children: ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState<CreateProjectInput>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<z.ZodFormattedError<CreateProjectInput> | null>(null);

  const { createProject } = useProjects(); // Get the create function from the main context

  const validationResult = useMemo(() => {
    return CombinedProjectCreateSchema.safeParse(formData);
  }, [formData]);

  const openModal = useCallback(() => setIsModalVisible(true), []);
  
  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setFormData(initialFormData); // Reset form on close
    setErrors(null);
  }, []);

  const handleSubmit = async () => {
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      console.error('Submission failed:', formattedErrors);
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors(null);

    try {
      // Use the validated data and the function from the main ProjectContext
      await createProject(validationResult.data);
      closeModal(); // Close modal on success
    } catch (error) {
      console.error("Failed to submit project:", error);
      // Here you could set a general, non-field-specific error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = { 
    formData, 
    setFormData, 
    isModalVisible, 
    openModal, 
    closeModal, 
    handleSubmit, 
    isSubmitting,
    // Provide the raw success boolean for simple checks in the UI
    isSubmittable: validationResult.success,
    errors 
  };

  return (
    <ProjectFormContext.Provider value={value}>
      {children}
    </ProjectFormContext.Provider>
  );
};

// Custom hook to easily consume the context
export const useProjectForm = (): ProjectFormContextType => {
  const context = useContext(ProjectFormContext);
  if (context === undefined) {
    throw new Error('useProjectForm must be used within a ProjectFormProvider');
  }
  return context;
};
