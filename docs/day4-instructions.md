# Day 4: Questionnaires & Data Management
## Eye Do Plan Development - Wedding Photographer's Assistant by morlove

### 🎯 **Day 4 Overview**
Today we'll build a comprehensive questionnaire system with dynamic question types, data persistence, and offline support. This includes questionnaire templates, form validation, data management, and integration with the project system.

### ⏰ **Time Allocation (4 hours)**
- **Morning Session (2 hours)**
  - Task 4.1: Questionnaire Types & Service (60 minutes)
  - Task 4.2: Dynamic Form Components (60 minutes)
- **Afternoon Session (2 hours)**
  - Task 4.3: Questionnaire Screens & Templates (60 minutes)
  - Task 4.4: Data Integration & Testing (60 minutes)

### 🎯 **Day 4 Goals**
- ✅ Complete questionnaire system with multiple question types
- ✅ Dynamic form generation and validation
- ✅ Data persistence with offline support
- ✅ Questionnaire templates for different event types
- ✅ Integration with project management system
- ✅ Comprehensive testing on Android emulator

---

## Task 4.1: Questionnaire Types & Service (60 minutes)

### Step 1: Questionnaire Types and Schemas

Create `src/types/questionnaire.ts`:

```typescript
/**
 * Eye Do Plan - Questionnaire Types and Schemas
 * Type definitions for dynamic questionnaire system
 */

import { z } from 'zod';

// Question types enum
export enum QuestionType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  BOOLEAN = 'boolean',
  RATING = 'rating',
  FILE_UPLOAD = 'file_upload',
  ADDRESS = 'address',
}

// Question validation schema
export const QuestionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(QuestionType),
  title: z.string().min(1, 'Question title is required'),
  description: z.string().optional(),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  
  // Validation rules
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  pattern: z.string().optional(),
  
  // Choice options (for single/multiple choice)
  options: z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.string(),
  })).optional(),
  
  // Rating configuration
  ratingMax: z.number().optional(),
  ratingLabels: z.array(z.string()).optional(),
  
  // Conditional logic
  dependsOn: z.string().optional(), // Question ID
  showWhen: z.string().optional(), // Value condition
  
  // Display settings
  order: z.number(),
  section: z.string().optional(),
  helpText: z.string().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

// Answer schema
export const AnswerSchema = z.object({
  questionId: z.string(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
    z.date(),
  ]),
  textValue: z.string().optional(), // For display purposes
});

export type Answer = z.infer<typeof AnswerSchema>;

// Questionnaire schema
export const QuestionnaireSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  templateId: z.string().optional(),
  title: z.string().min(1, 'Questionnaire title is required'),
  description: z.string().optional(),
  
  // Questions and answers
  questions: z.array(QuestionSchema),
  answers: z.array(AnswerSchema),
  
  // Status and metadata
  status: z.enum(['draft', 'sent', 'in_progress', 'completed']),
  completionPercentage: z.number().min(0).max(100),
  
  // Client information
  clientEmail: z.string().email().optional(),
  sentAt: z.date().optional(),
  completedAt: z.date().optional(),
  
  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Additional settings
  allowPartialSave: z.boolean().default(true),
  requireAllQuestions: z.boolean().default(false),
  customStyling: z.record(z.string()).optional(),
});

export type Questionnaire = z.infer<typeof QuestionnaireSchema>;

// Template schema
export const QuestionnaireTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.enum(['wedding', 'engagement', 'bridal_shower', 'general']),
  questions: z.array(QuestionSchema.omit({ id: true })),
  isDefault: z.boolean().default(false),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type QuestionnaireTemplate = z.infer<typeof QuestionnaireTemplateSchema>;

// Create questionnaire input
export const CreateQuestionnaireSchema = QuestionnaireSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completionPercentage: true,
});

export type CreateQuestionnaireInput = z.infer<typeof CreateQuestionnaireSchema>;

// Update questionnaire input
export const UpdateQuestionnaireSchema = QuestionnaireSchema.partial().extend({
  id: z.string(),
});

export type UpdateQuestionnaireInput = z.infer<typeof UpdateQuestionnaireSchema>;
```

### Step 2: Questionnaire Service

Create `src/services/questionnaireService.ts`:

```typescript
/**
 * Eye Do Plan - Questionnaire Service
 * Comprehensive questionnaire management with offline support
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { handleProfileError } from '../utils/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Questionnaire,
  QuestionnaireTemplate,
  CreateQuestionnaireInput,
  UpdateQuestionnaireInput,
  Answer,
  Question,
  QuestionType,
  QuestionnaireSchema,
  QuestionnaireTemplateSchema,
} from '../types/questionnaire';

export interface QuestionnaireServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Questionnaire Service Class for Eye Do Plan
 * Manages questionnaires, templates, and answers with offline support
 */
export class QuestionnaireService {
  private static readonly CACHE_KEY = 'eyedoplan_questionnaires_cache';
  private static readonly TEMPLATES_CACHE_KEY = 'eyedoplan_templates_cache';
  private static readonly CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

  /**
   * Create a new questionnaire
   */
  static async createQuestionnaire(
    questionnaireData: CreateQuestionnaireInput
  ): Promise<QuestionnaireServiceResult<Questionnaire>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Validate input data
      const validatedData = CreateQuestionnaireSchema.parse(questionnaireData);

      // Calculate initial completion percentage
      const completionPercentage = this.calculateCompletionPercentage(
        validatedData.questions,
        validatedData.answers
      );

      // Prepare questionnaire data
      const newQuestionnaire = {
        ...validatedData,
        completionPercentage,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'questionnaires'), newQuestionnaire);

      // Get the created questionnaire
      const createdQuestionnaire = await this.getQuestionnaire(docRef.id);
      
      if (!createdQuestionnaire.success || !createdQuestionnaire.data) {
        throw new Error('Failed to retrieve created questionnaire');
      }

      // Clear cache to force refresh
      await this.clearQuestionnaireCache();

      return {
        success: true,
        data: createdQuestionnaire.data,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'createQuestionnaire',
        userId: auth.currentUser?.uid,
        questionnaireData,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get a single questionnaire by ID
   */
  static async getQuestionnaire(
    questionnaireId: string
  ): Promise<QuestionnaireServiceResult<Questionnaire>> {
    try {
      const docRef = doc(db, 'questionnaires', questionnaireId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Questionnaire not found',
        };
      }

      const data = docSnap.data();
      
      // Convert Firestore timestamps to dates
      const questionnaireData = {
        ...data,
        id: docSnap.id,
        sentAt: data.sentAt?.toDate(),
        completedAt: data.completedAt?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };

      // Validate the data
      const validatedQuestionnaire = QuestionnaireSchema.parse(questionnaireData);

      return {
        success: true,
        data: validatedQuestionnaire,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'getQuestionnaire',
        questionnaireId,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get questionnaires for a project
   */
  static async getProjectQuestionnaires(
    projectId: string
  ): Promise<QuestionnaireServiceResult<Questionnaire[]>> {
    try {
      // Check cache first
      const cachedQuestionnaires = await this.getCachedQuestionnaires(projectId);
      if (cachedQuestionnaires) {
        return {
          success: true,
          data: cachedQuestionnaires,
        };
      }

      // Build query
      const q = query(
        collection(db, 'questionnaires'),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );

      // Execute query
      const querySnapshot = await getDocs(q);
      
      const questionnaires: Questionnaire[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const questionnaireData = {
          ...data,
          id: doc.id,
          sentAt: data.sentAt?.toDate(),
          completedAt: data.completedAt?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };

        try {
          const validatedQuestionnaire = QuestionnaireSchema.parse(questionnaireData);
          questionnaires.push(validatedQuestionnaire);
        } catch (validationError) {
          console.warn('Eye Do Plan: Invalid questionnaire data:', validationError);
        }
      });

      // Cache questionnaires
      await this.cacheQuestionnaires(projectId, questionnaires);

      return {
        success: true,
        data: questionnaires,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'getProjectQuestionnaires',
        projectId,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Update questionnaire answers
   */
  static async updateQuestionnaireAnswers(
    questionnaireId: string,
    answers: Answer[]
  ): Promise<QuestionnaireServiceResult<Questionnaire>> {
    try {
      // Get current questionnaire
      const currentResult = await this.getQuestionnaire(questionnaireId);
      if (!currentResult.success || !currentResult.data) {
        throw new Error('Questionnaire not found');
      }

      const questionnaire = currentResult.data;

      // Calculate completion percentage
      const completionPercentage = this.calculateCompletionPercentage(
        questionnaire.questions,
        answers
      );

      // Determine status based on completion
      let status = questionnaire.status;
      if (completionPercentage === 100 && status !== 'completed') {
        status = 'completed';
      } else if (completionPercentage > 0 && status === 'draft') {
        status = 'in_progress';
      }

      // Prepare update data
      const updateData = {
        answers,
        completionPercentage,
        status,
        updatedAt: serverTimestamp(),
        ...(status === 'completed' && !questionnaire.completedAt && {
          completedAt: serverTimestamp(),
        }),
      };

      // Update in Firestore
      const docRef = doc(db, 'questionnaires', questionnaireId);
      await updateDoc(docRef, updateData);

      // Get updated questionnaire
      const updatedQuestionnaire = await this.getQuestionnaire(questionnaireId);
      
      if (!updatedQuestionnaire.success || !updatedQuestionnaire.data) {
        throw new Error('Failed to retrieve updated questionnaire');
      }

      // Clear cache to force refresh
      await this.clearQuestionnaireCache();

      return {
        success: true,
        data: updatedQuestionnaire.data,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'updateQuestionnaireAnswers',
        questionnaireId,
        answers,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get questionnaire templates
   */
  static async getQuestionnaireTemplates(): Promise<QuestionnaireServiceResult<QuestionnaireTemplate[]>> {
    try {
      // Check cache first
      const cachedTemplates = await this.getCachedTemplates();
      if (cachedTemplates) {
        return {
          success: true,
          data: cachedTemplates,
        };
      }

      // Build query
      const q = query(
        collection(db, 'questionnaire_templates'),
        orderBy('name', 'asc')
      );

      // Execute query
      const querySnapshot = await getDocs(q);
      
      const templates: QuestionnaireTemplate[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const templateData = {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };

        try {
          const validatedTemplate = QuestionnaireTemplateSchema.parse(templateData);
          templates.push(validatedTemplate);
        } catch (validationError) {
          console.warn('Eye Do Plan: Invalid template data:', validationError);
        }
      });

      // Cache templates
      await this.cacheTemplates(templates);

      return {
        success: true,
        data: templates,
      };
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'getQuestionnaireTemplates',
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Create questionnaire from template
   */
  static async createFromTemplate(
    templateId: string,
    projectId: string,
    title?: string
  ): Promise<QuestionnaireServiceResult<Questionnaire>> {
    try {
      // Get template
      const templateDoc = await getDoc(doc(db, 'questionnaire_templates', templateId));
      if (!templateDoc.exists()) {
        throw new Error('Template not found');
      }

      const templateData = templateDoc.data();
      const template = QuestionnaireTemplateSchema.parse({
        ...templateData,
        id: templateDoc.id,
        createdAt: templateData.createdAt?.toDate(),
        updatedAt: templateData.updatedAt?.toDate(),
      });

      // Generate questions with IDs
      const questions: Question[] = template.questions.map((q, index) => ({
        ...q,
        id: `q_${Date.now()}_${index}`,
        order: index,
      }));

      // Create questionnaire data
      const questionnaireData: CreateQuestionnaireInput = {
        projectId,
        templateId,
        title: title || `${template.name} Questionnaire`,
        description: template.description,
        questions,
        answers: [],
        status: 'draft',
        allowPartialSave: true,
        requireAllQuestions: false,
      };

      return await this.createQuestionnaire(questionnaireData);
    } catch (error) {
      const errorMessage = await handleProfileError(error, {
        method: 'createFromTemplate',
        templateId,
        projectId,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Calculate completion percentage
   */
  private static calculateCompletionPercentage(
    questions: Question[],
    answers: Answer[]
  ): number {
    if (questions.length === 0) return 0;

    const requiredQuestions = questions.filter(q => q.required);
    const answeredQuestions = answers.filter(a => {
      const question = questions.find(q => q.id === a.questionId);
      return question && this.isAnswerValid(a, question);
    });

    // If no required questions, calculate based on all questions
    if (requiredQuestions.length === 0) {
      return Math.round((answeredQuestions.length / questions.length) * 100);
    }

    // Calculate based on required questions
    const answeredRequired = answeredQuestions.filter(a => {
      const question = questions.find(q => q.id === a.questionId);
      return question?.required;
    });

    return Math.round((answeredRequired.length / requiredQuestions.length) * 100);
  }

  /**
   * Validate if an answer is valid for a question
   */
  private static isAnswerValid(answer: Answer, question: Question): boolean {
    if (!answer.value && answer.value !== 0 && answer.value !== false) {
      return false;
    }

    switch (question.type) {
      case QuestionType.TEXT:
      case QuestionType.TEXTAREA:
      case QuestionType.EMAIL:
      case QuestionType.PHONE:
        const textValue = String(answer.value);
        if (question.minLength && textValue.length < question.minLength) return false;
        if (question.maxLength && textValue.length > question.maxLength) return false;
        if (question.pattern && !new RegExp(question.pattern).test(textValue)) return false;
        return true;

      case QuestionType.NUMBER:
      case QuestionType.RATING:
        const numValue = Number(answer.value);
        if (isNaN(numValue)) return false;
        if (question.minValue !== undefined && numValue < question.minValue) return false;
        if (question.maxValue !== undefined && numValue > question.maxValue) return false;
        return true;

      case QuestionType.MULTIPLE_CHOICE:
        return Array.isArray(answer.value) && answer.value.length > 0;

      case QuestionType.SINGLE_CHOICE:
      case QuestionType.BOOLEAN:
      case QuestionType.DATE:
      case QuestionType.TIME:
      case QuestionType.FILE_UPLOAD:
      case QuestionType.ADDRESS:
        return true; // Basic validation - value exists

      default:
        return true;
    }
  }

  /**
   * Cache questionnaires data
   */
  private static async cacheQuestionnaires(
    projectId: string,
    questionnaires: Questionnaire[]
  ): Promise<void> {
    try {
      const cacheData = {
        questionnaires,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(
        `${this.CACHE_KEY}_${projectId}`,
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.warn('Eye Do Plan: Failed to cache questionnaires:', error);
    }
  }

  /**
   * Get cached questionnaires data
   */
  private static async getCachedQuestionnaires(
    projectId: string
  ): Promise<Questionnaire[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(`${this.CACHE_KEY}_${projectId}`);
      if (!cachedData) {
        return null;
      }

      const { questionnaires, timestamp } = JSON.parse(cachedData);
      
      // Check if cache is expired
      if (Date.now() - timestamp > this.CACHE_EXPIRY) {
        await AsyncStorage.removeItem(`${this.CACHE_KEY}_${projectId}`);
        return null;
      }

      return questionnaires;
    } catch (error) {
      console.warn('Eye Do Plan: Failed to get cached questionnaires:', error);
      return null;
    }
  }

  /**
   * Cache templates data
   */
  private static async cacheTemplates(templates: QuestionnaireTemplate[]): Promise<void> {
    try {
      const cacheData = {
        templates,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(this.TEMPLATES_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Eye Do Plan: Failed to cache templates:', error);
    }
  }

  /**
   * Get cached templates data
   */
  private static async getCachedTemplates(): Promise<QuestionnaireTemplate[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(this.TEMPLATES_CACHE_KEY);
      if (!cachedData) {
        return null;
      }

      const { templates, timestamp } = JSON.parse(cachedData);
      
      // Check if cache is expired
      if (Date.now() - timestamp > this.CACHE_EXPIRY) {
        await AsyncStorage.removeItem(this.TEMPLATES_CACHE_KEY);
        return null;
      }

      return templates;
    } catch (error) {
      console.warn('Eye Do Plan: Failed to get cached templates:', error);
      return null;
    }
  }

  /**
   * Clear questionnaire cache
   */
  private static async clearQuestionnaireCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Eye Do Plan: Failed to clear questionnaire cache:', error);
    }
  }
}

export default QuestionnaireService;
```

### 🧪 **Testing Task 4.1**

```bash
# Test on Android emulator
npx expo run:android

# Test questionnaire service functionality:
# 1. Create a questionnaire with different question types
# 2. Test answer validation
# 3. Test completion percentage calculation
# 4. Test template loading
# 5. Test offline caching
```

---

## Task 4.2: Dynamic Form Components (60 minutes)

### Step 1: Question Renderer Component

Create `src/components/forms/QuestionRenderer.tsx`:

```typescript
/**
 * Eye Do Plan - Question Renderer Component
 * Dynamic form component that renders different question types
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  RadioButton,
  Checkbox,
  Switch,
  useTheme,
  HelperText,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Question, Answer, QuestionType } from '../../types/questionnaire';

interface QuestionRendererProps {
  question: Question;
  answer?: Answer;
  onAnswerChange: (answer: Answer) => void;
  disabled?: boolean;
  showValidation?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  answer,
  onAnswerChange,
  disabled = false,
  showValidation = false,
}) => {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  /**
   * Handle answer value change
   */
  const handleValueChange = useCallback((value: any) => {
    const newAnswer: Answer = {
      questionId: question.id,
      value,
      textValue: getDisplayValue(value, question.type),
    };
    onAnswerChange(newAnswer);
  }, [question.id, question.type, onAnswerChange]);

  /**
   * Get display value for answer
   */
  const getDisplayValue = (value: any, type: QuestionType): string => {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case QuestionType.DATE:
        return value instanceof Date ? value.toLocaleDateString() : String(value);
      case QuestionType.TIME:
        return value instanceof Date ? value.toLocaleTimeString() : String(value);
      case QuestionType.BOOLEAN:
        return value ? 'Yes' : 'No';
      case QuestionType.MULTIPLE_CHOICE:
        return Array.isArray(value) ? value.join(', ') : String(value);
      default:
        return String(value);
    }
  };

  /**
   * Validate answer
   */
  const validateAnswer = (): string | null => {
    if (!showValidation) return null;
    
    const value = answer?.value;
    
    // Required validation
    if (question.required && (!value && value !== 0 && value !== false)) {
      return 'This field is required';
    }

    if (!value && value !== 0 && value !== false) return null;

    // Type-specific validation
    switch (question.type) {
      case QuestionType.TEXT:
      case QuestionType.TEXTAREA:
      case QuestionType.EMAIL:
      case QuestionType.PHONE:
        const textValue = String(value);
        if (question.minLength && textValue.length < question.minLength) {
          return `Minimum ${question.minLength} characters required`;
        }
        if (question.maxLength && textValue.length > question.maxLength) {
          return `Maximum ${question.maxLength} characters allowed`;
        }
        if (question.pattern && !new RegExp(question.pattern).test(textValue)) {
          return 'Invalid format';
        }
        if (question.type === QuestionType.EMAIL && !/\S+@\S+\.\S+/.test(textValue)) {
          return 'Invalid email address';
        }
        break;

      case QuestionType.NUMBER:
      case QuestionType.RATING:
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return 'Must be a valid number';
        }
        if (question.minValue !== undefined && numValue < question.minValue) {
          return `Minimum value is ${question.minValue}`;
        }
        if (question.maxValue !== undefined && numValue > question.maxValue) {
          return `Maximum value is ${question.maxValue}`;
        }
        break;
    }

    return null;
  };

  const errorMessage = validateAnswer();
  const hasError = !!errorMessage;

  /**
   * Render question based on type
   */
  const renderQuestionInput = () => {
    const currentValue = answer?.value;

    switch (question.type) {
      case QuestionType.TEXT:
      case QuestionType.EMAIL:
      case QuestionType.PHONE:
        return (
          <TextInput
            mode="outlined"
            label={question.title}
            placeholder={question.placeholder}
            value={String(currentValue || '')}
            onChangeText={handleValueChange}
            disabled={disabled}
            error={hasError}
            keyboardType={
              question.type === QuestionType.EMAIL ? 'email-address' :
              question.type === QuestionType.PHONE ? 'phone-pad' : 'default'
            }
            autoCapitalize={question.type === QuestionType.EMAIL ? 'none' : 'sentences'}
            accessibilityLabel={question.title}
            accessibilityHint={question.description}
          />
        );

      case QuestionType.TEXTAREA:
        return (
          <TextInput
            mode="outlined"
            label={question.title}
            placeholder={question.placeholder}
            value={String(currentValue || '')}
            onChangeText={handleValueChange}
            disabled={disabled}
            error={hasError}
            multiline
            numberOfLines={4}
            accessibilityLabel={question.title}
            accessibilityHint={question.description}
          />
        );

      case QuestionType.NUMBER:
        return (
          <TextInput
            mode="outlined"
            label={question.title}
            placeholder={question.placeholder}
            value={String(currentValue || '')}
            onChangeText={(text) => {
              const num = parseFloat(text);
              handleValueChange(isNaN(num) ? '' : num);
            }}
            disabled={disabled}
            error={hasError}
            keyboardType="numeric"
            accessibilityLabel={question.title}
            accessibilityHint={question.description}
          />
        );

      case QuestionType.DATE:
        return (
          <View>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              disabled={disabled}
              icon="calendar"
              contentStyle={styles.dateButton}
            >
              {currentValue instanceof Date 
                ? currentValue.toLocaleDateString()
                : question.placeholder || 'Select Date'
              }
            </Button>
            
            {showDatePicker && (
              <DateTimePicker
                value={currentValue instanceof Date ? currentValue : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    handleValueChange(selectedDate);
                  }
                }}
              />
            )}
          </View>
        );

      case QuestionType.TIME:
        return (
          <View>
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              disabled={disabled}
              icon="clock"
              contentStyle={styles.dateButton}
            >
              {currentValue instanceof Date 
                ? currentValue.toLocaleTimeString()
                : question.placeholder || 'Select Time'
              }
            </Button>
            
            {showTimePicker && (
              <DateTimePicker
                value={currentValue instanceof Date ? currentValue : new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    handleValueChange(selectedTime);
                  }
                }}
              />
            )}
          </View>
        );

      case QuestionType.SINGLE_CHOICE:
        return (
          <RadioButton.Group
            onValueChange={handleValueChange}
            value={String(currentValue || '')}
          >
            {question.options?.map((option) => (
              <View key={option.id} style={styles.radioOption}>
                <RadioButton.Item
                  label={option.label}
                  value={option.value}
                  disabled={disabled}
                  labelStyle={styles.radioLabel}
                />
              </View>
            ))}
          </RadioButton.Group>
        );

      case QuestionType.MULTIPLE_CHOICE:
        const selectedValues = Array.isArray(currentValue) ? currentValue : [];
        return (
          <View>
            {question.options?.map((option) => (
              <View key={option.id} style={styles.checkboxOption}>
                <Checkbox.Item
                  label={option.label}
                  status={selectedValues.includes(option.value) ? 'checked' : 'unchecked'}
                  onPress={() => {
                    const newValues = selectedValues.includes(option.value)
                      ? selectedValues.filter(v => v !== option.value)
                      : [...selectedValues, option.value];
                    handleValueChange(newValues);
                  }}
                  disabled={disabled}
                  labelStyle={styles.checkboxLabel}
                />
              </View>
            ))}
          </View>
        );

      case QuestionType.BOOLEAN:
        return (
          <View style={styles.switchContainer}>
            <Text variant="bodyLarge">{question.title}</Text>
            <Switch
              value={Boolean(currentValue)}
              onValueChange={handleValueChange}
              disabled={disabled}
            />
          </View>
        );

      case QuestionType.RATING:
        const ratingMax = question.ratingMax || 5;
        const ratingValue = Number(currentValue) || 0;
        
        return (
          <View>
            <Text variant="bodyLarge" style={styles.ratingTitle}>
              {question.title}
            </Text>
            <View style={styles.ratingContainer}>
              {Array.from({ length: ratingMax }, (_, index) => (
                <Button
                  key={index}
                  mode={index < ratingValue ? 'contained' : 'outlined'}
                  onPress={() => handleValueChange(index + 1)}
                  disabled={disabled}
                  compact
                  style={styles.ratingButton}
                >
                  {index + 1}
                </Button>
              ))}
            </View>
            {question.ratingLabels && (
              <View style={styles.ratingLabels}>
                <Text variant="bodySmall">{question.ratingLabels[0]}</Text>
                <Text variant="bodySmall">{question.ratingLabels[1]}</Text>
              </View>
            )}
          </View>
        );

      case QuestionType.FILE_UPLOAD:
        return (
          <Button
            mode="outlined"
            onPress={() => {
              // TODO: Implement file upload
              console.log('File upload not implemented yet');
            }}
            disabled={disabled}
            icon="attachment"
            contentStyle={styles.uploadButton}
          >
            {currentValue ? 'File Selected' : 'Choose File'}
          </Button>
        );

      case QuestionType.ADDRESS:
        return (
          <TextInput
            mode="outlined"
            label={question.title}
            placeholder={question.placeholder || 'Enter address'}
            value={String(currentValue || '')}
            onChangeText={handleValueChange}
            disabled={disabled}
            error={hasError}
            multiline
            numberOfLines={3}
            accessibilityLabel={question.title}
            accessibilityHint={question.description}
          />
        );

      default:
        return (
          <Text variant="bodyMedium" style={styles.unsupportedType}>
            Unsupported question type: {question.type}
          </Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Question Header */}
      <View style={styles.questionHeader}>
        <Text variant="bodyLarge" style={styles.questionTitle}>
          {question.title}
          {question.required && (
            <Text style={[styles.required, { color: theme.colors.error }]}>
              {' '}*
            </Text>
          )}
        </Text>
        
        {question.description && (
          <Text variant="bodySmall" style={styles.questionDescription}>
            {question.description}
          </Text>
        )}
      </View>

      {/* Question Input */}
      <View style={styles.questionInput}>
        {renderQuestionInput()}
      </View>

      {/* Help Text */}
      {question.helpText && (
        <HelperText type="info" visible={true}>
          {question.helpText}
        </HelperText>
      )}

      {/* Error Message */}
      {hasError && (
        <HelperText type="error" visible={true}>
          {errorMessage}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  questionHeader: {
    marginBottom: 12,
  },
  questionTitle: {
    fontWeight: '600',
    lineHeight: 24,
  },
  required: {
    fontWeight: 'bold',
  },
  questionDescription: {
    marginTop: 4,
    opacity: 0.7,
    lineHeight: 18,
  },
  questionInput: {
    marginBottom: 8,
  },
  dateButton: {
    justifyContent: 'flex-start',
    paddingVertical: 12,
  },
  radioOption: {
    marginVertical: 2,
  },
  radioLabel: {
    fontSize: 16,
  },
  checkboxOption: {
    marginVertical: 2,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ratingTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  ratingButton: {
    minWidth: 40,
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadButton: {
    justifyContent: 'flex-start',
    paddingVertical: 12,
  },
  unsupportedType: {
    fontStyle: 'italic',
    opacity: 0.7,
  },
});

export default QuestionRenderer;
```

### Step 2: Questionnaire Form Component

Create `src/components/forms/QuestionnaireForm.tsx`:

```typescript
/**
 * Eye Do Plan - Questionnaire Form Component
 * Complete form for questionnaire with validation and progress tracking
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Text,
  ProgressBar,
  Button,
  Divider,
  useTheme,
  Banner,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import QuestionRenderer from './QuestionRenderer';
import { LoadingState } from '../ui/LoadingState';
import { Questionnaire, Answer, Question } from '../../types/questionnaire';
import QuestionnaireService from '../../services/questionnaireService';
import { handleError } from '../../utils/errorHandler';

interface QuestionnaireFormProps {
  questionnaire: Questionnaire;
  onUpdate?: (questionnaire: Questionnaire) => void;
  onComplete?: (questionnaire: Questionnaire) => void;
  readonly?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number; // milliseconds
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questionnaire,
  onUpdate,
  onComplete,
  readonly = false,
  autoSave = true,
  autoSaveInterval = 30000, // 30 seconds
}) => {
  const theme = useTheme();
  const [answers, setAnswers] = useState<Answer[]>(questionnaire.answers);
  const [saving, setSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Calculate completion percentage
   */
  const calculateProgress = useCallback(() => {
    const requiredQuestions = questionnaire.questions.filter(q => q.required);
    const totalQuestions = requiredQuestions.length > 0 ? requiredQuestions.length : questionnaire.questions.length;
    
    if (totalQuestions === 0) return 100;

    const answeredQuestions = answers.filter(a => {
      const question = questionnaire.questions.find(q => q.id === a.questionId);
      return question && isAnswerValid(a, question);
    });

    const relevantAnswered = requiredQuestions.length > 0 
      ? answeredQuestions.filter(a => {
          const question = questionnaire.questions.find(q => q.id === a.questionId);
          return question?.required;
        })
      : answeredQuestions;

    return Math.round((relevantAnswered.length / totalQuestions) * 100);
  }, [questionnaire.questions, answers]);

  /**
   * Validate if an answer is valid for a question
   */
  const isAnswerValid = (answer: Answer, question: Question): boolean => {
    const value = answer.value;
    
    if (!value && value !== 0 && value !== false) {
      return !question.required;
    }

    // Add specific validation logic here if needed
    return true;
  };

  /**
   * Handle answer change
   */
  const handleAnswerChange = useCallback((newAnswer: Answer) => {
    setAnswers(prevAnswers => {
      const existingIndex = prevAnswers.findIndex(a => a.questionId === newAnswer.questionId);
      
      if (existingIndex >= 0) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingIndex] = newAnswer;
        return updatedAnswers;
      } else {
        return [...prevAnswers, newAnswer];
      }
    });
    
    setHasUnsavedChanges(true);
  }, []);

  /**
   * Save answers to service
   */
  const saveAnswers = useCallback(async (showLoading = true) => {
    if (readonly) return;
    
    try {
      if (showLoading) setSaving(true);
      
      const result = await QuestionnaireService.updateQuestionnaireAnswers(
        questionnaire.id,
        answers
      );

      if (result.success && result.data) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        onUpdate?.(result.data);
        
        // Check if completed
        if (result.data.status === 'completed') {
          onComplete?.(result.data);
        }
      } else {
        throw new Error(result.error || 'Failed to save answers');
      }
    } catch (error) {
      const errorMessage = await handleError(error, {
        component: 'QuestionnaireForm',
        action: 'saveAnswers',
        questionnaireId: questionnaire.id,
      });
      
      Alert.alert(
        'Save Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      if (showLoading) setSaving(false);
    }
  }, [questionnaire.id, answers, readonly, onUpdate, onComplete]);

  /**
   * Handle submit
   */
  const handleSubmit = async () => {
    setShowValidation(true);
    
    // Check if all required questions are answered
    const requiredQuestions = questionnaire.questions.filter(q => q.required);
    const unansweredRequired = requiredQuestions.filter(q => {
      const answer = answers.find(a => a.questionId === q.id);
      return !answer || !isAnswerValid(answer, q);
    });

    if (unansweredRequired.length > 0) {
      Alert.alert(
        'Incomplete Form',
        `Please answer all required questions (${unansweredRequired.length} remaining).`,
        [{ text: 'OK' }]
      );
      return;
    }

    await saveAnswers();
  };

  /**
   * Auto-save effect
   */
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges || readonly) return;

    const timer = setTimeout(() => {
      saveAnswers(false);
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [autoSave, hasUnsavedChanges, autoSaveInterval, saveAnswers, readonly]);

  /**
   * Filter visible questions based on conditional logic
   */
  const getVisibleQuestions = useCallback(() => {
    return questionnaire.questions
      .filter(question => {
        if (!question.dependsOn || !question.showWhen) return true;
        
        const dependentAnswer = answers.find(a => a.questionId === question.dependsOn);
        if (!dependentAnswer) return false;
        
        return String(dependentAnswer.value) === question.showWhen;
      })
      .sort((a, b) => a.order - b.order);
  }, [questionnaire.questions, answers]);

  /**
   * Group questions by section
   */
  const getQuestionSections = useCallback(() => {
    const visibleQuestions = getVisibleQuestions();
    const sections: { [key: string]: Question[] } = {};
    
    visibleQuestions.forEach(question => {
      const sectionName = question.section || 'General';
      if (!sections[sectionName]) {
        sections[sectionName] = [];
      }
      sections[sectionName].push(question);
    });
    
    return sections;
  }, [getVisibleQuestions]);

  const progress = calculateProgress();
  const isComplete = progress === 100;
  const questionSections = getQuestionSections();

  if (saving && answers.length === 0) {
    return <LoadingState message="Loading questionnaire..." />;
  }

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text variant="titleMedium" style={styles.progressTitle}>
            {questionnaire.title}
          </Text>
          <Text variant="bodySmall" style={styles.progressText}>
            {progress}% Complete
          </Text>
        </View>
        
        <ProgressBar
          progress={progress / 100}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
        
        {questionnaire.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {questionnaire.description}
          </Text>
        )}
      </View>

      {/* Auto-save Banner */}
      {hasUnsavedChanges && autoSave && !readonly && (
        <Banner
          visible={true}
          icon="content-save"
          style={styles.autoSaveBanner}
        >
          Changes will be saved automatically
        </Banner>
      )}

      {/* Last Saved Indicator */}
      {lastSaved && !hasUnsavedChanges && (
        <View style={styles.savedIndicator}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={theme.colors.primary}
          />
          <Text variant="bodySmall" style={styles.savedText}>
            Saved {lastSaved.toLocaleTimeString()}
          </Text>
        </View>
      )}

      {/* Questions Form */}
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(questionSections).map(([sectionName, questions], sectionIndex) => (
          <View key={sectionName} style={styles.section}>
            {Object.keys(questionSections).length > 1 && (
              <>
                <Text variant="headlineSmall" style={styles.sectionTitle}>
                  {sectionName}
                </Text>
                <Divider style={styles.sectionDivider} />
              </>
            )}
            
            {questions.map((question, questionIndex) => {
              const answer = answers.find(a => a.questionId === question.id);
              
              return (
                <QuestionRenderer
                  key={question.id}
                  question={question}
                  answer={answer}
                  onAnswerChange={handleAnswerChange}
                  disabled={readonly || saving}
                  showValidation={showValidation}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      {!readonly && (
        <View style={styles.actionContainer}>
          <Button
            mode="outlined"
            onPress={() => saveAnswers()}
            disabled={saving || !hasUnsavedChanges}
            loading={saving}
            icon="content-save"
            style={styles.saveButton}
          >
            Save Progress
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={saving}
            loading={saving}
            icon={isComplete ? "check" : "send"}
            style={styles.submitButton}
          >
            {isComplete ? 'Complete' : 'Submit'}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  progressText: {
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  description: {
    opacity: 0.7,
    lineHeight: 20,
  },
  autoSaveBanner: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  savedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  savedText: {
    opacity: 0.7,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: 100, // Space for action buttons
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDivider: {
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  saveButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default QuestionnaireForm;
```

### 🧪 **Testing Task 4.2**

```bash
# Test on Android emulator
npx expo run:android

# Test dynamic form components:
# 1. Test different question types rendering
# 2. Test form validation
# 3. Test answer persistence
# 4. Test conditional question logic
# 5. Test auto-save functionality
```

---

## Task 4.3: Questionnaire Screens & Templates (60 minutes)

### Step 1: Questionnaire List Screen

Create `app/(projects)/[id]/questionnaires.tsx`:

```typescript
/**
 * Eye Do Plan - Project Questionnaires Screen
 * List and manage questionnaires for a specific project
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Text,
  FAB,
  Chip,
  useTheme,
  Menu,
  IconButton,
  Button,
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { CustomCard, LoadingState } from '../../../src/components';
import QuestionnaireService from '../../../src/services/questionnaireService';
import ProjectService from '../../../src/services/projectService';
import { Questionnaire, QuestionnaireTemplate } from '../../../src/types/questionnaire';
import { Project } from '../../../src/types/project';
import { handleError } from '../../../src/utils/errorHandler';

export default function ProjectQuestionnairesScreen() {
  const theme = useTheme();
  const { id: projectId } = useLocalSearchParams<{ id: string }>();
  
  const [project, setProject] = useState<Project | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [templateMenuVisible, setTemplateMenuVisible] = useState(false);

  /**
   * Load project and questionnaires data
   */
  const loadData = useCallback(async () => {
    if (!projectId) return;
    
    try {
      // Load project details
      const projectResult = await ProjectService.getProject(projectId);
      if (projectResult.success && projectResult.data) {
        setProject(projectResult.data);
      }

      // Load questionnaires
      const questionnairesResult = await QuestionnaireService.getProjectQuestionnaires(projectId);
      if (questionnairesResult.success && questionnairesResult.data) {
        setQuestionnaires(questionnairesResult.data);
      }

      // Load templates
      const templatesResult = await QuestionnaireService.getQuestionnaireTemplates();
      if (templatesResult.success && templatesResult.data) {
        setTemplates(templatesResult.data);
      }
    } catch (error) {
      const errorMessage = await handleError(error, {
        screen: 'ProjectQuestionnaires',
        action: 'loadData',
        projectId,
      });
      console.error('Eye Do Plan: Failed to load questionnaires:', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId]);

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  /**
   * Create questionnaire from template
   */
  const handleCreateFromTemplate = async (template: QuestionnaireTemplate) => {
    if (!projectId) return;
    
    try {
      setTemplateMenuVisible(false);
      
      const result = await QuestionnaireService.createFromTemplate(
        template.id,
        projectId,
        `${template.name} - ${project?.clientName || 'Client'}`
      );

      if (result.success && result.data) {
        setQuestionnaires(prev => [result.data!, ...prev]);
        router.push(`/(projects)/${projectId}/questionnaires/${result.data.id}`);
      } else {
        throw new Error(result.error || 'Failed to create questionnaire');
      }
    } catch (error) {
      const errorMessage = await handleError(error, {
        screen: 'ProjectQuestionnaires',
        action: 'createFromTemplate',
        templateId: template.id,
        projectId,
      });
      
      Alert.alert(
        'Creation Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * Delete questionnaire
   */
  const handleDeleteQuestionnaire = async (questionnaireId: string) => {
    Alert.alert(
      'Delete Questionnaire',
      'Are you sure you want to delete this questionnaire? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement delete questionnaire in service
              setQuestionnaires(prev => prev.filter(q => q.id !== questionnaireId));
            } catch (error) {
              const errorMessage = await handleError(error, {
                screen: 'ProjectQuestionnaires',
                action: 'deleteQuestionnaire',
                questionnaireId,
              });
              
              Alert.alert('Delete Failed', errorMessage, [{ text: 'OK' }]);
            }
          },
        },
      ]
    );
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Get status color
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.tertiary;
      case 'in_progress':
        return theme.colors.primary;
      case 'sent':
        return theme.colors.secondary;
      default:
        return theme.colors.outline;
    }
  };

  /**
   * Render questionnaire card
   */
  const renderQuestionnaireCard = (questionnaire: Questionnaire) => {
    const completionPercentage = questionnaire.completionPercentage || 0;
    const statusText = questionnaire.status.replace('_', ' ').toUpperCase();

    return (
      <CustomCard
        key={questionnaire.id}
        title={questionnaire.title}
        subtitle={`${completionPercentage}% Complete • ${statusText}`}
        headerIcon="file-document-outline"
        onPress={() => router.push(`/(projects)/${projectId}/questionnaires/${questionnaire.id}`)}
        onMenuPress={() => handleDeleteQuestionnaire(questionnaire.id)}
        style={styles.questionnaireCard}
      >
        <View style={styles.questionnaireContent}>
          {questionnaire.description && (
            <Text variant="bodyMedium" style={styles.questionnaireDescription}>
              {questionnaire.description}
            </Text>
          )}
          
          <View style={styles.questionnaireMeta}>
            <Chip
              mode="outlined"
              compact
              style={[
                styles.statusChip,
                { borderColor: getStatusColor(questionnaire.status) },
              ]}
            >
              {statusText}
            </Chip>
            
            <Text variant="bodySmall" style={styles.questionCount}>
              {questionnaire.questions.length} questions
            </Text>
          </View>

          {questionnaire.sentAt && (
            <Text variant="bodySmall" style={styles.sentDate}>
              Sent: {questionnaire.sentAt.toLocaleDateString()}
            </Text>
          )}

          {questionnaire.completedAt && (
            <Text variant="bodySmall" style={styles.completedDate}>
              Completed: {questionnaire.completedAt.toLocaleDateString()}
            </Text>
          )}
        </View>
      </CustomCard>
    );
  };

  if (loading) {
    return <LoadingState message="Loading questionnaires..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          />
          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Questionnaires
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              {project?.title || 'Project'}
            </Text>
          </View>
        </View>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              // TODO: Implement export functionality
            }}
            title="Export All"
            leadingIcon="export"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              // TODO: Implement template management
            }}
            title="Manage Templates"
            leadingIcon="file-cog"
          />
        </Menu>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {questionnaires.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="file-document-plus"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              No Questionnaires Yet
            </Text>
            <Text variant="bodyMedium" style={styles.emptyDescription}>
              Create your first questionnaire to gather important information from your clients.
            </Text>
            
            {templates.length > 0 && (
              <View style={styles.templateButtons}>
                <Text variant="bodyMedium" style={styles.templateTitle}>
                  Start with a template:
                </Text>
                {templates.slice(0, 3).map((template) => (
                  <Button
                    key={template.id}
                    mode="outlined"
                    onPress={() => handleCreateFromTemplate(template)}
                    style={styles.templateButton}
                  >
                    {template.name}
                  </Button>
                ))}
              </View>
            )}
          </View>
        ) : (
          questionnaires.map(renderQuestionnaireCard)
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setTemplateMenuVisible(true)}
        label="New Questionnaire"
        accessibilityLabel="Create new questionnaire"
      />

      {/* Template Selection Menu */}
      <Menu
        visible={templateMenuVisible}
        onDismiss={() => setTemplateMenuVisible(false)}
        anchor={<View style={styles.fabAnchor} />}
        anchorPosition="top"
      >
        <Menu.Item
          onPress={() => {
            setTemplateMenuVisible(false);
            // TODO: Navigate to custom questionnaire creation
          }}
          title="Custom Questionnaire"
          leadingIcon="file-plus"
        />
        {templates.map((template) => (
          <Menu.Item
            key={template.id}
            onPress={() => handleCreateFromTemplate(template)}
            title={template.name}
            leadingIcon="file-document"
          />
        ))}
      </Menu>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 8,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  headerSubtitle: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  questionnaireCard: {
    marginBottom: 12,
  },
  questionnaireContent: {
    gap: 8,
  },
  questionnaireDescription: {
    lineHeight: 20,
  },
  questionnaireMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  questionCount: {
    opacity: 0.7,
    fontWeight: '500',
  },
  sentDate: {
    opacity: 0.7,
    fontSize: 12,
  },
  completedDate: {
    opacity: 0.7,
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  templateButtons: {
    marginTop: 24,
    gap: 8,
    alignItems: 'center',
  },
  templateTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  templateButton: {
    minWidth: 200,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fabAnchor: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 1,
    height: 1,
  },
});
```

### 🧪 **Testing Task 4.3**

```bash
# Test on Android emulator
npx expo run:android

# Test questionnaire screens:
# 1. Navigate to project questionnaires
# 2. Test template selection
# 3. Test questionnaire creation
# 4. Test questionnaire list display
# 5. Test navigation between screens
```

---

## Task 4.4: Data Integration & Testing (60 minutes)

### Step 1: Default Templates Data

Create `src/data/questionnaireTemplates.ts`:

```typescript
/**
 * Eye Do Plan - Default Questionnaire Templates
 * Pre-built templates for different event types
 */

import { QuestionType } from '../types/questionnaire';

export const defaultTemplates = [
  {
    name: 'Wedding Photography Questionnaire',
    description: 'Comprehensive questionnaire for wedding photography clients',
    category: 'wedding' as const,
    isDefault: true,
    questions: [
      {
        type: QuestionType.TEXT,
        title: 'Bride\'s Full Name',
        required: true,
        order: 1,
        section: 'Basic Information',
      },
      {
        type: QuestionType.TEXT,
        title: 'Groom\'s Full Name',
        required: true,
        order: 2,
        section: 'Basic Information',
      },
      {
        type: QuestionType.EMAIL,
        title: 'Primary Contact Email',
        required: true,
        order: 3,
        section: 'Basic Information',
      },
      {
        type: QuestionType.PHONE,
        title: 'Primary Contact Phone',
        required: true,
        order: 4,
        section: 'Basic Information',
      },
      {
        type: QuestionType.DATE,
        title: 'Wedding Date',
        required: true,
        order: 5,
        section: 'Event Details',
      },
      {
        type: QuestionType.TIME,
        title: 'Ceremony Start Time',
        required: true,
        order: 6,
        section: 'Event Details',
      },
      {
        type: QuestionType.ADDRESS,
        title: 'Ceremony Venue Address',
        required: true,
        order: 7,
        section: 'Event Details',
      },
      {
        type: QuestionType.ADDRESS,
        title: 'Reception Venue Address',
        required: false,
        order: 8,
        section: 'Event Details',
        helpText: 'Leave blank if same as ceremony venue',
      },
      {
        type: QuestionType.NUMBER,
        title: 'Approximate Number of Guests',
        required: false,
        order: 9,
        section: 'Event Details',
        minValue: 1,
        maxValue: 1000,
      },
      {
        type: QuestionType.SINGLE_CHOICE,
        title: 'Photography Package',
        required: true,
        order: 10,
        section: 'Photography Details',
        options: [
          { id: 'basic', label: 'Basic Package (4 hours)', value: 'basic' },
          { id: 'standard', label: 'Standard Package (6 hours)', value: 'standard' },
          { id: 'premium', label: 'Premium Package (8 hours)', value: 'premium' },
          { id: 'custom', label: 'Custom Package', value: 'custom' },
        ],
      },
      {
        type: QuestionType.MULTIPLE_CHOICE,
        title: 'Additional Services Needed',
        required: false,
        order: 11,
        section: 'Photography Details',
        options: [
          { id: 'engagement', label: 'Engagement Session', value: 'engagement' },
          { id: 'bridal', label: 'Bridal Portraits', value: 'bridal' },
          { id: 'rehearsal', label: 'Rehearsal Dinner', value: 'rehearsal' },
          { id: 'second_shooter', label: 'Second Photographer', value: 'second_shooter' },
          { id: 'videography', label: 'Videography', value: 'videography' },
        ],
      },
      {
        type: QuestionType.TEXTAREA,
        title: 'Special Moments to Capture',
        required: false,
        order: 12,
        section: 'Photography Details',
        placeholder: 'Describe any special moments, traditions, or specific shots you want captured...',
        maxLength: 1000,
      },
      {
        type: QuestionType.TEXTAREA,
        title: 'Family Photo Requirements',
        required: false,
        order: 13,
        section: 'Photography Details',
        placeholder: 'List specific family combinations you want photographed...',
        maxLength: 500,
      },
      {
        type: QuestionType.BOOLEAN,
        title: 'Will there be a first look session?',
        required: false,
        order: 14,
        section: 'Timeline',
      },
      {
        type: QuestionType.TIME,
        title: 'Getting Ready Start Time (Bride)',
        required: false,
        order: 15,
        section: 'Timeline',
      },
      {
        type: QuestionType.TIME,
        title: 'Getting Ready Start Time (Groom)',
        required: false,
        order: 16,
        section: 'Timeline',
      },
      {
        type: QuestionType.RATING,
        title: 'How important is having photos during cocktail hour?',
        required: false,
        order: 17,
        section: 'Preferences',
        ratingMax: 5,
        ratingLabels: ['Not Important', 'Very Important'],
      },
      {
        type: QuestionType.SINGLE_CHOICE,
        title: 'Preferred Photography Style',
        required: false,
        order: 18,
        section: 'Preferences',
        options: [
          { id: 'traditional', label: 'Traditional/Classic', value: 'traditional' },
          { id: 'photojournalistic', label: 'Photojournalistic/Documentary', value: 'photojournalistic' },
          { id: 'artistic', label: 'Artistic/Creative', value: 'artistic' },
          { id: 'mixed', label: 'Mixed Style', value: 'mixed' },
        ],
      },
      {
        type: QuestionType.TEXTAREA,
        title: 'Additional Notes or Special Requests',
        required: false,
        order: 19,
        section: 'Additional Information',
        placeholder: 'Any other information you think would be helpful...',
        maxLength: 1000,
      },
    ],
  },
  {
    name: 'Engagement Session Questionnaire',
    description: 'Quick questionnaire for engagement photography sessions',
    category: 'engagement' as const,
    isDefault: true,
    questions: [
      {
        type: QuestionType.TEXT,
        title: 'Partner 1 Name',
        required: true,
        order: 1,
        section: 'Basic Information',
      },
      {
        type: QuestionType.TEXT,
        title: 'Partner 2 Name',
        required: true,
        order: 2,
        section: 'Basic Information',
      },
      {
        type: QuestionType.EMAIL,
        title: 'Contact Email',
        required: true,
        order: 3,
        section: 'Basic Information',
      },
      {
        type: QuestionType.PHONE,
        title: 'Contact Phone',
        required: true,
        order: 4,
        section: 'Basic Information',
      },
      {
        type: QuestionType.DATE,
        title: 'Preferred Session Date',
        required: true,
        order: 5,
        section: 'Session Details',
      },
      {
        type: QuestionType.SINGLE_CHOICE,
        title: 'Preferred Time of Day',
        required: true,
        order: 6,
        section: 'Session Details',
        options: [
          { id: 'sunrise', label: 'Sunrise (Golden Hour)', value: 'sunrise' },
          { id: 'morning', label: 'Morning', value: 'morning' },
          { id: 'afternoon', label: 'Afternoon', value: 'afternoon' },
          { id: 'sunset', label: 'Sunset (Golden Hour)', value: 'sunset' },
        ],
      },
      {
        type: QuestionType.TEXTAREA,
        title: 'Preferred Location Ideas',
        required: false,
        order: 7,
        section: 'Session Details',
        placeholder: 'Describe locations that are meaningful to you or styles you prefer...',
        maxLength: 500,
      },
      {
        type: QuestionType.SINGLE_CHOICE,
        title: 'Session Style Preference',
        required: false,
        order: 8,
        section: 'Preferences',
        options: [
          { id: 'casual', label: 'Casual & Relaxed', value: 'casual' },
          { id: 'formal', label: 'Formal & Elegant', value: 'formal' },
          { id: 'adventurous', label: 'Adventurous & Outdoorsy', value: 'adventurous' },
          { id: 'urban', label: 'Urban & Modern', value: 'urban' },
        ],
      },
      {
        type: QuestionType.BOOLEAN,
        title: 'Are you comfortable with some direction/posing?',
        required: false,
        order: 9,
        section: 'Preferences',
      },
      {
        type: QuestionType.TEXTAREA,
        title: 'Tell us about your relationship',
        required: false,
        order: 10,
        section: 'Personal',
        placeholder: 'How did you meet? What do you love doing together? This helps us capture your unique connection...',
        maxLength: 500,
      },
    ],
  },
];
```

### Step 2: Integration Helper

Create `src/utils/questionnaireHelpers.ts`:

```typescript
/**
 * Eye Do Plan - Questionnaire Helper Functions
 * Utility functions for questionnaire management
 */

import { Question, Answer, QuestionType, Questionnaire } from '../types/questionnaire';

/**
 * Generate a unique question ID
 */
export const generateQuestionId = (): string => {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate questionnaire completeness
 */
export const validateQuestionnaire = (questionnaire: Questionnaire): {
  isValid: boolean;
  errors: string[];
  missingRequired: Question[];
} => {
  const errors: string[] = [];
  const missingRequired: Question[] = [];

  // Check required questions
  const requiredQuestions = questionnaire.questions.filter(q => q.required);
  
  requiredQuestions.forEach(question => {
    const answer = questionnaire.answers.find(a => a.questionId === question.id);
    
    if (!answer || !isAnswerValid(answer, question)) {
      missingRequired.push(question);
      errors.push(`${question.title} is required`);
    }
  });

  // Check answer validity
  questionnaire.answers.forEach(answer => {
    const question = questionnaire.questions.find(q => q.id === answer.questionId);
    if (question && !isAnswerValid(answer, question)) {
      errors.push(`Invalid answer for ${question.title}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    missingRequired,
  };
};

/**
 * Check if an answer is valid for a question
 */
export const isAnswerValid = (answer: Answer, question: Question): boolean => {
  const value = answer.value;
  
  // Check if value exists (considering falsy values that are valid)
  if (value === null || value === undefined || value === '') {
    return !question.required;
  }

  // Type-specific validation
  switch (question.type) {
    case QuestionType.TEXT:
    case QuestionType.TEXTAREA:
    case QuestionType.EMAIL:
    case QuestionType.PHONE:
      const textValue = String(value);
      
      // Length validation
      if (question.minLength && textValue.length < question.minLength) return false;
      if (question.maxLength && textValue.length > question.maxLength) return false;
      
      // Pattern validation
      if (question.pattern && !new RegExp(question.pattern).test(textValue)) return false;
      
      // Email validation
      if (question.type === QuestionType.EMAIL) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(textValue);
      }
      
      return true;

    case QuestionType.NUMBER:
    case QuestionType.RATING:
      const numValue = Number(value);
      if (isNaN(numValue)) return false;
      
      if (question.minValue !== undefined && numValue < question.minValue) return false;
      if (question.maxValue !== undefined && numValue > question.maxValue) return false;
      
      return true;

    case QuestionType.MULTIPLE_CHOICE:
      return Array.isArray(value) && value.length > 0;

    case QuestionType.SINGLE_CHOICE:
      return question.options?.some(option => option.value === value) || false;

    case QuestionType.BOOLEAN:
      return typeof value === 'boolean';

    case QuestionType.DATE:
    case QuestionType.TIME:
      return value instanceof Date || !isNaN(Date.parse(String(value)));

    case QuestionType.FILE_UPLOAD:
      return typeof value === 'string' && value.length > 0;

    case QuestionType.ADDRESS:
      return typeof value === 'string' && value.trim().length > 0;

    default:
      return true;
  }
};

/**
 * Calculate questionnaire completion percentage
 */
export const calculateCompletionPercentage = (
  questions: Question[],
  answers: Answer[]
): number => {
  if (questions.length === 0) return 100;

  const requiredQuestions = questions.filter(q => q.required);
  const totalQuestions = requiredQuestions.length > 0 ? requiredQuestions.length : questions.length;
  
  const validAnswers = answers.filter(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    return question && isAnswerValid(answer, question);
  });

  const relevantAnswers = requiredQuestions.length > 0 
    ? validAnswers.filter(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        return question?.required;
      })
    : validAnswers;

  return Math.round((relevantAnswers.length / totalQuestions) * 100);
};

/**
 * Filter visible questions based on conditional logic
 */
export const getVisibleQuestions = (
  questions: Question[],
  answers: Answer[]
): Question[] => {
  return questions.filter(question => {
    // No dependency - always visible
    if (!question.dependsOn || !question.showWhen) return true;
    
    // Find the dependent answer
    const dependentAnswer = answers.find(a => a.questionId === question.dependsOn);
    if (!dependentAnswer) return false;
    
    // Check if condition is met
    return String(dependentAnswer.value) === question.showWhen;
  }).sort((a, b) => a.order - b.order);
};

/**
 * Group questions by section
 */
export const groupQuestionsBySection = (questions: Question[]): { [key: string]: Question[] } => {
  const sections: { [key: string]: Question[] } = {};
  
  questions.forEach(question => {
    const sectionName = question.section || 'General';
    if (!sections[sectionName]) {
      sections[sectionName] = [];
    }
    sections[sectionName].push(question);
  });
  
  return sections;
};

/**
 * Export questionnaire data to JSON
 */
export const exportQuestionnaireData = (questionnaire: Questionnaire): string => {
  const exportData = {
    questionnaire: {
      title: questionnaire.title,
      description: questionnaire.description,
      status: questionnaire.status,
      completionPercentage: questionnaire.completionPercentage,
      createdAt: questionnaire.createdAt,
      completedAt: questionnaire.completedAt,
    },
    questions: questionnaire.questions.map(q => ({
      title: q.title,
      type: q.type,
      section: q.section,
      required: q.required,
      order: q.order,
    })),
    answers: questionnaire.answers.map(a => {
      const question = questionnaire.questions.find(q => q.id === a.questionId);
      return {
        question: question?.title || 'Unknown Question',
        answer: a.textValue || String(a.value),
        value: a.value,
      };
    }),
  };
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Generate questionnaire summary
 */
export const generateQuestionnaireSummary = (questionnaire: Questionnaire): {
  totalQuestions: number;
  answeredQuestions: number;
  requiredQuestions: number;
  answeredRequired: number;
  completionPercentage: number;
  sections: string[];
} => {
  const totalQuestions = questionnaire.questions.length;
  const requiredQuestions = questionnaire.questions.filter(q => q.required).length;
  
  const validAnswers = questionnaire.answers.filter(answer => {
    const question = questionnaire.questions.find(q => q.id === answer.questionId);
    return question && isAnswerValid(answer, question);
  });
  
  const answeredRequired = validAnswers.filter(answer => {
    const question = questionnaire.questions.find(q => q.id === answer.questionId);
    return question?.required;
  }).length;
  
  const sections = Array.from(new Set(
    questionnaire.questions.map(q => q.section || 'General')
  ));
  
  return {
    totalQuestions,
    answeredQuestions: validAnswers.length,
    requiredQuestions,
    answeredRequired,
    completionPercentage: calculateCompletionPercentage(questionnaire.questions, questionnaire.answers),
    sections,
  };
};
```

### 🧪 **Testing Task 4.4**

```bash
# Test on Android emulator
npx expo run:android

# Comprehensive testing:
# 1. Test questionnaire creation from templates
# 2. Test form validation and completion tracking
# 3. Test answer persistence and auto-save
# 4. Test conditional question logic
# 5. Test data export functionality
# 6. Test offline functionality
# 7. Test error handling and recovery
```

---

## 📋 **Day 4 Completion Checklist**

### ✅ **Completed Tasks**
- [ ] Questionnaire Types & Service with comprehensive CRUD operations
- [ ] Dynamic Form Components with all question types
- [ ] Questionnaire Screens & Templates with professional UI
- [ ] Data Integration & Testing with helper functions
- [ ] Offline support with caching and auto-save
- [ ] Comprehensive validation and error handling

### 🎯 **Day 4 Achievements**
- **Dynamic Questionnaire System**: Support for 12+ question types with validation
- **Template System**: Pre-built templates for different event types
- **Offline Functionality**: Auto-save, caching, and offline data persistence
- **Professional UI**: Responsive forms with progress tracking and validation
- **Data Management**: Comprehensive CRUD operations with error handling

### 📱 **Testing Results**
- [ ] All question types render and function correctly
- [ ] Form validation works for all scenarios
- [ ] Auto-save functionality works reliably
- [ ] Conditional logic displays questions correctly
- [ ] Data persistence works offline and online
- [ ] Error handling provides user-friendly feedback

### 🚀 **Ready for Day 5**
With Day 4 complete, you now have:
- Complete questionnaire management system
- Dynamic form generation and validation
- Professional data collection interface
- Offline support and auto-save functionality
- Ready to build timeline and shot list features

---

## 🔧 **Troubleshooting Day 4**

### Common Issues:
1. **Form Validation Errors**: Check Zod schemas and validation logic
2. **Auto-save Issues**: Verify AsyncStorage permissions and error handling
3. **Question Rendering**: Ensure all question types have proper components
4. **Data Persistence**: Check Firebase security rules and network connectivity
5. **Performance Issues**: Implement proper memoization for large forms

### Performance Tips:
- Use React.memo for question components
- Implement virtual scrolling for long questionnaires
- Debounce auto-save operations
- Cache template data appropriately

**Day 4 Complete! 🎉 Ready to move on to Day 5: Timeline & Testing**

