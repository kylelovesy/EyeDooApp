// # 3.0 Events
// # 3.2 Delete event screen
import React from 'react';
import { View } from 'react-native';
import { CustomButton } from '../../../components/ui/CustomButton';
import { Screen } from '../../../components/ui/Screen';
import { HeadlineText } from '../../../components/ui/Typography';
import { commonStyles } from '../../../constants/styles';
import { useAuth } from '../../../contexts/AuthContext';

export default function DeleteProjectScreen() {
  const { signOut } = useAuth();
  return (
    <Screen style={commonStyles.centerContent}>
      <HeadlineText>Delete Project Screen</HeadlineText>
      <View style={{ marginTop: 20 }}>
        <CustomButton
          title="Sign Out"
          variant="danger"
          onPress={signOut}
        />
      </View>
    </Screen>
  );
}