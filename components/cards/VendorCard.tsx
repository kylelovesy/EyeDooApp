import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, IconButton, Text } from 'react-native-paper';
import { useAppTheme } from '../../constants/theme';
import { VendorContact } from '../../types/vendors';
import { BodyText, TitleText } from '../ui/Typography';

interface VendorCardProps {
  vendor: VendorContact;
  onEdit: (vendor: VendorContact) => void;
  onDelete: (vendorId: string) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onEdit, onDelete }) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.info}>
            <TitleText>{vendor.name}</TitleText>
            {vendor.businessName && <BodyText>{vendor.businessName}</BodyText>}
            <Chip style={styles.chip}>{vendor.type}</Chip>
          </View>
          <View>
            <IconButton icon="pencil" size={20} onPress={() => onEdit(vendor)} />
            <IconButton icon="delete" size={20} onPress={() => onDelete(vendor.id!)} />
          </View>
        </View>
        {/* Contact details */}
        {vendor.notes && <Text style={styles.notes}>{vendor.notes}</Text>}
      </Card.Content>
    </Card>
  );
};

const useStyles = (theme: any) =>
  StyleSheet.create({
    card: { marginBottom: 12 },
    header: { flexDirection: 'row', justifyContent: 'space-between' },
    info: { flex: 1 },
    chip: { alignSelf: 'flex-start', marginTop: 8 },
    notes: { fontStyle: 'italic', marginTop: 8 },
  });
