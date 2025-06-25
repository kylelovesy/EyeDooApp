import { CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    IconButton,
    Modal,
    Surface,
    Text,
} from 'react-native-paper';
import { spacing, useAppTheme } from '../../constants/theme';
import { useCameraPermission } from '../../hooks/useCameraPermissions';
import { parseQRCodeData } from '../../services/utils/qrUtils';
import { VendorContact } from '../../types/vendors';
import { HeadlineText } from '../ui/Typography';

interface QRCodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (vendorData: Partial<VendorContact>) => void;
  onScanError: (error: string) => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  visible,
  onClose,
  onScanSuccess,
  onScanError,
}) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);
  const { hasPermission } = useCameraPermission(visible); // Use the updated hook

  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when the modal is opened
  useEffect(() => {
    if (visible) {
      setScanned(false);
      setIsProcessing(false);
    }
  }, [visible]);

  const handleBarcodeScanned = ({ data }: { data: string; }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      console.log('Raw QR code data:', data);
      const vendorData = parseQRCodeData(data);
      console.log('Parsed vendor data:', vendorData);
      
      // More flexible validation - accept if ANY useful information is found
      const hasUsefulData = 
        (vendorData.name && vendorData.name.trim()) ||
        (vendorData.businessName && vendorData.businessName.trim()) ||
        (vendorData.email && vendorData.email.trim()) ||
        (vendorData.phone && vendorData.phone.trim()) ||
        (vendorData.website && vendorData.website.trim()) ||
        (vendorData.instagram && vendorData.instagram.trim()) ||
        (vendorData.facebook && vendorData.facebook.trim());

      if (!hasUsefulData) {
        throw new Error(`No valid contact information found in QR code. Scanned data: "${data.substring(0, 100)}${data.length > 100 ? '...' : ''}"`);
      }
      
      onScanSuccess(vendorData);
      onClose();
    } catch (error) {
      console.error('QR Code parsing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse QR code';
      onScanError(errorMessage);
      // Allow user to see the error and then reset
      setTimeout(() => {
        setScanned(false);
        setIsProcessing(false);
      }, 3000); // Increased timeout to give user time to read the error
    }
  };

  const renderContent = () => {
    if (hasPermission === null) {
      return (
        <Surface style={styles.permissionSurface}>
          <ActivityIndicator size="large" />
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </Surface>
      );
    }
    if (hasPermission === false) {
      return (
        <Surface style={styles.permissionSurface}>
          <Text style={styles.permissionText}>No access to camera</Text>
          <Text style={styles.permissionSubtext}>
            Please enable camera permissions in settings.
          </Text>
          <Button mode="contained" onPress={onClose} style={styles.permissionButton}>
            Close
          </Button>
        </Surface>
      );
    }
    return (
      <View style={styles.scannerContainer}>
          <Surface style={styles.header}>
            <HeadlineText size="medium">Scan Vendor QR Code</HeadlineText>
            <IconButton icon="close" onPress={onClose} />
          </Surface>
          <View style={styles.cameraContainer}>
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
             {isProcessing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" />
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            )}
          </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      {renderContent()}
    </Modal>
  );
};

// Styles remain largely the same
const { width } = Dimensions.get('window');
const useStyles = (theme: any) =>
  StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: theme.colors.background },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
    permissionSurface: { padding: spacing.xl, borderRadius: 12, alignItems: 'center' },
    permissionText: { marginTop: spacing.md, textAlign: 'center', fontSize: 18, fontWeight: '600' },
    permissionSubtext: { marginTop: spacing.sm, textAlign: 'center', color: theme.colors.onSurfaceVariant },
    permissionButton: { marginTop: spacing.lg },
    scannerContainer: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, elevation: 4 },
    cameraContainer: { flex: 1, position: 'relative' },
    overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    scanArea: { width: width * 0.7, height: width * 0.7, position: 'relative' },
    corner: { position: 'absolute', width: 30, height: 30, borderColor: theme.colors.primary, borderWidth: 3 },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    processingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    processingText: { marginTop: 12, color: 'white', fontSize: 16 },
  });
