import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Card, IconButton, useTheme } from 'react-native-paper';
import { spacing } from '../../constants/theme';
import { BodyText, TitleText } from '../ui/Typography';

interface CustomCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  headerIcon?: string;
  showMenu?: boolean;
  onMenuPress?: () => void;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  title,
  subtitle,
  children,
  variant = 'default',
  headerIcon,
  showMenu = false,
  onMenuPress,
  onPress,
  style,
  testID,
}) => {
  const theme = useTheme();

  const getCardMode = () => {
    switch (variant) {
      case 'outlined':
        return 'outlined';
      case 'filled':
        return 'contained';
      default:
        return 'elevated';
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;
  const cardProps = onPress ? { onPress, activeOpacity: 0.7 } : {};

  return (
    <CardComponent {...cardProps} testID={testID}>
      <Card mode={getCardMode()} style={style}>
        {(title || subtitle || headerIcon || showMenu) && (
          <Card.Content style={{ paddingBottom: children ? spacing.sm : spacing.md }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start' 
            }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                {headerIcon && (
                  <MaterialCommunityIcons
                    name={headerIcon as any}
                    size={24}
                    color={theme.colors.primary}
                    style={{ marginRight: spacing.sm }}
                  />
                )}
                <View style={{ flex: 1 }}>
                  {title && (
                    <TitleText size="large" numberOfLines={1}>
                      {title}
                    </TitleText>
                  )}
                  {subtitle && (
                    <BodyText 
                      size="medium" 
                      style={{ opacity: 0.7, marginTop: spacing.xs }}
                      numberOfLines={2}
                    >
                      {subtitle}
                    </BodyText>
                  )}
                </View>
              </View>
              
              {showMenu && (
                <IconButton
                  icon="dots-vertical"
                  size={20}
                  onPress={onMenuPress}
                  style={{ margin: 0 }}
                />
              )}
            </View>
          </Card.Content>
        )}
        
        {children && (
          <Card.Content style={{ paddingTop: (title || subtitle) ? 0 : spacing.md }}>
            {children}
          </Card.Content>
        )}
      </Card>
    </CardComponent>
  );
};

export default CustomCard;