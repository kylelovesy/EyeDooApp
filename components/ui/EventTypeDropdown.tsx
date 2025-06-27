import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText, Menu } from 'react-native-paper';

import { EventType, eventTypeDetails, getEventTypeDetails } from '../../constants/eventTypes';
import { commonStyles } from '../../constants/styles';
import { useAppTheme } from '../../constants/theme';

interface EventTypeDropdownProps {
  selectedType?: EventType;
  onSelect: (type: EventType) => void;
  error?: string;
  disabled?: boolean;
}

const EventTypeDropdown: React.FC<EventTypeDropdownProps> = ({
  selectedType,
  onSelect,
  error,
  disabled,
}) => {
  const theme = useAppTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedDetail = selectedType ? getEventTypeDetails(selectedType) : null;
  const SelectedIcon = selectedDetail?.Icon;

  return (
    <View>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            disabled={disabled}
            style={[error && { borderColor: theme.colors.error }]}
            contentStyle={commonStyles.rowCenter}
            icon={() => SelectedIcon ? <SelectedIcon width={20} height={20} /> : undefined}
          >
            {selectedDetail?.displayName || 'Select Event Type'}
          </Button>
        }
      >
        {eventTypeDetails.map((item) => {
          const IconComponent = item.Icon;
          return (
            <Menu.Item
              key={item.type}
              onPress={() => {
                onSelect(item.type);
                setMenuVisible(false);
              }}
              title={item.displayName}
              leadingIcon={() => <IconComponent width={20} height={20} />}
              disabled={disabled}
            />
          );
        })}
      </Menu>
      {error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
};

export default EventTypeDropdown;
