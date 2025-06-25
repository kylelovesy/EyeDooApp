import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    Chip,
    Snackbar,
    Text,
    TextInput,
} from 'react-native-paper';
import { commonStyles, createThemedStyles } from '../../constants/styles';
import { spacing, useAppTheme } from '../../constants/theme';
import { VendorContact, VendorContactSchema, VendorTypes } from '../../types/vendors';
import FormModal from '../ui/FormModal';
import { TitleText } from '../ui/Typography';
import { QRCodeScanner } from './QRCodeScanner';

interface VendorFormProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (vendor: VendorContact) => Promise<void>;
  initialData?: Partial<VendorContact>;
}

export const VendorForm: React.FC<VendorFormProps> = ({
  visible,
  onDismiss,
  onSave,
  initialData,
}) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const [formData, setFormData] = useState<Partial<VendorContact>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const [qrScannerVisible, setQrScannerVisible] = useState(false);

  // When the modal opens or initialData changes, reset the form
  useEffect(() => {
    setFormData(initialData || { type: VendorTypes.OTHER });
    setErrors({});
  }, [initialData, visible]);

  const updateField = (field: keyof VendorContact, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleQRScanSuccess = (vendorData: Partial<VendorContact>) => {
    setFormData(prev => ({ ...prev, ...vendorData }));
    setSnackbar({ visible: true, message: 'Contact information imported from QR code!', type: 'success' });
    setQrScannerVisible(false);
  };

  const handleQRScanError = (message: string) => {
    console.log('QR Scan Error:', message);
    
    // Provide more helpful error messages
    let userMessage = message;
    if (message.includes('No valid contact information found')) {
      userMessage = 'QR code format not recognized. Supported formats:\n• Business cards with contact info\n• Website URLs\n• Email addresses\n• Phone numbers\n• vCard format\n• JSON format';
    }
    
    setSnackbar({ visible: true, message: userMessage, type: 'error' });
    setQrScannerVisible(false);
  };
  
  const handleSubmit = async () => {
    const result = VendorContactSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path.length > 0) newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      setSnackbar({ visible: true, message: 'Please fix the errors.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(result.data as VendorContact);
      onDismiss();
    } catch (error) {
      setSnackbar({ visible: true, message: 'Failed to save vendor.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create mock context for FormModal compatibility
  const mockContext = {
    isModalVisible: visible,
    openModal: () => {},
    closeModal: onDismiss,
    formData: formData as VendorContact | null,
    setFormData: setFormData as React.Dispatch<React.SetStateAction<VendorContact | null>>,
    handleSubmit,
    isSubmitting,
    errors: null,
    snackbar: { visible: false, message: '', type: 'success' as 'success' | 'error' },
    hideSnackbar: () => {},
    showSnackbar: () => {},
    isValid: true
  };

  return (
    <>
      <FormModal
        title={`${initialData?.id ? 'Edit' : 'Add'} Vendor`}
        subtitle="Manage your vendor contacts and information"
        context={mockContext}
        saveLabel="Save Vendor"
        cancelLabel="Cancel"
      >
        <Card style={[commonStyles.card, styles.card]}>
          <Card.Content style={commonStyles.cardContent}>
            <Button 
              mode="outlined" 
              onPress={() => setQrScannerVisible(true)} 
              icon="qrcode-scan" 
              disabled={isSubmitting}
              style={{ marginBottom: spacing.md }}
            >
              Scan QR Code
            </Button>
          </Card.Content>
        </Card>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <Card style={[commonStyles.card, styles.card]}>
            <Card.Content style={commonStyles.cardContent}>
              <TitleText size="medium" style={{ marginBottom: spacing.sm }}>
                Basic Information
              </TitleText>
              
              <TextInput
                label="Name *"
                value={formData.name || ''}
                onChangeText={text => updateField('name', text)}
                error={!!errors.name}
                mode="outlined"
                style={[commonStyles.input, styles.input]}
                theme={theme}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <TextInput
                label="Business Name"
                value={formData.businessName || ''}
                onChangeText={text => updateField('businessName', text)}
                error={!!errors.businessName}
                mode="outlined"
                style={[commonStyles.input, styles.input]}
                theme={theme}
              />
              {errors.businessName && <Text style={styles.errorText}>{errors.businessName}</Text>}

              <TitleText size="small" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
                Vendor Category
              </TitleText>
              <View style={styles.categoryContainer}>
                {Object.values(VendorTypes).map(type => (
                  <Chip
                    key={type}
                    selected={formData.type === type}
                    onPress={() => updateField('type', type)}
                    style={styles.categoryChip}
                    textStyle={styles.categoryChipText}
                  >
                    {type}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Contact Information */}
          <Card style={[commonStyles.card, styles.card]}>
            <Card.Content style={commonStyles.cardContent}>
              <TitleText size="medium" style={{ marginBottom: spacing.sm }}>
                Contact Information
              </TitleText>
              
              <TextInput
                label="Email"
                value={formData.email || ''}
                onChangeText={text => updateField('email', text)}
                error={!!errors.email}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[commonStyles.input, styles.input]}
                theme={theme}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                label="Phone"
                value={formData.phone || ''}
                onChangeText={text => updateField('phone', text)}
                error={!!errors.phone}
                mode="outlined"
                keyboardType="phone-pad"
                style={[commonStyles.input, styles.input]}
                theme={theme}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <TextInput
                label="Website"
                value={formData.website || ''}
                onChangeText={text => updateField('website', text)}
                error={!!errors.website}
                mode="outlined"
                keyboardType="url"
                autoCapitalize="none"
                style={[commonStyles.input, styles.input]}
                theme={theme}
              />
              {errors.website && <Text style={styles.errorText}>{errors.website}</Text>}
            </Card.Content>
          </Card>

          {/* Social Media */}
          <Card style={[commonStyles.card, styles.card]}>
            <Card.Content style={commonStyles.cardContent}>
              <TitleText size="medium" style={{ marginBottom: spacing.sm }}>
                Social Media
              </TitleText>
              
              <TextInput
                label="Instagram Handle"
                value={formData.instagram || ''}
                onChangeText={text => updateField('instagram', text)}
                error={!!errors.instagram}
                mode="outlined"
                autoCapitalize="none"
                style={[commonStyles.input, styles.input]}
                theme={theme}
                placeholder="@username"
              />
              {errors.instagram && <Text style={styles.errorText}>{errors.instagram}</Text>}

              <TextInput
                label="Facebook"
                value={formData.facebook || ''}
                onChangeText={text => updateField('facebook', text)}
                error={!!errors.facebook}
                mode="outlined"
                autoCapitalize="none"
                style={[commonStyles.input, styles.input]}
                theme={theme}
              />
              {errors.facebook && <Text style={styles.errorText}>{errors.facebook}</Text>}
            </Card.Content>
          </Card>

          {/* Notes */}
          <Card style={[commonStyles.card, styles.card]}>
            <Card.Content style={commonStyles.cardContent}>
              <TitleText size="medium" style={{ marginBottom: spacing.sm }}>
                Notes
              </TitleText>
              
              <TextInput
                label="Additional Notes"
                value={formData.notes || ''}
                onChangeText={text => updateField('notes', text)}
                error={!!errors.notes}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={[commonStyles.input, styles.input, styles.notesInput]}
                theme={theme}
              />
              {errors.notes && <Text style={styles.errorText}>{errors.notes}</Text>}
            </Card.Content>
          </Card>
        </ScrollView>
      </FormModal>

      <QRCodeScanner
        visible={qrScannerVisible}
        onClose={() => setQrScannerVisible(false)}
        onScanSuccess={handleQRScanSuccess}
        onScanError={handleQRScanError}
      />

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={{ backgroundColor: snackbar.type === 'success' ? '#4CAF50' : '#F44336' }}
      >
        {snackbar.message}
      </Snackbar>
    </>
  );
};

const useStyles = (theme: any) => {
  const themedStyles = createThemedStyles(theme);
  return StyleSheet.create({
    ...themedStyles,
    card: {
      marginBottom: spacing.md,
    },
    input: {
      marginBottom: spacing.sm,
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    categoryChip: {
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
    },
    categoryChipText: {
      fontSize: 12,
    },
    notesInput: {
      minHeight: 100,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: -spacing.xs,
      marginBottom: spacing.sm,
    },
  });
};

export default VendorForm;
