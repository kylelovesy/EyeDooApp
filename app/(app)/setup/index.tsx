import {
    Button,
    Divider,
    useTheme
} from 'react-native-paper';

import { CustomButton } from '@/components';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import MasterKitForm from '../../../components/kit/MasterKitForm';
import BaseFormModal from '../../../components/ui/BaseFormModal';
import { Screen } from '../../../components/ui/Screen';
import { BodyText, HeadlineText } from '../../../components/ui/Typography';
import { DEFAULT_PACKING_CATEGORIES } from '../../../constants/kitChecklistTypes';
import { useAuth } from '../../../contexts/AuthContext';
import { UserService } from '../../../services/userService';
import { TKitChecklistItem, TMasterCategory } from '../../../types/kitChecklist';

interface SetupCustomizations {
  customKitListSetup: boolean;
  customTaskListSetup: boolean;
  customNFCBusinessCardSetup: boolean;
  customGroupShotsSetup: boolean;
  customCoupleShotsSetup: boolean;
}

export default function SetupScreen() {
  const theme = useTheme();
  const { user, updateUserSetup, loading } = useAuth();
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);
  const [kitModalVisible, setKitModalVisible] = useState(false);
  const [masterKitList, setMasterKitList] = useState<TKitChecklistItem[]>([]);
  const [masterCategories, setMasterCategories] = useState<TMasterCategory[]>([]);
  const [kitLoading, setKitLoading] = useState(false);

  const [customizations, setCustomizations] = useState<SetupCustomizations>({
    customKitListSetup: false,
    customTaskListSetup: false,
    customNFCBusinessCardSetup: false,
    customGroupShotsSetup: false,
    customCoupleShotsSetup: false,
  });

  // Fetch master kit on mount
  useEffect(() => {
    if (!user) return;
    setKitLoading(true);
    console.log('app/setup/index.tsx > useEffect > user.id', user.id);
    UserService.getOrCreateMasterKit(user.id)
      .then(kit => {
        console.log('app/setup/index.tsx > useEffect > kit', kit);
        setMasterKitList(kit.items);
        setMasterCategories(kit.categories);
      })
      .catch(() => {
        // fallback to defaults
        setMasterKitList(DEFAULT_PACKING_CATEGORIES.flatMap(cat =>
          cat.items.map(item => ({
            id: uuidv4 ? uuidv4() : `${Date.now()}_${Math.random()}`,
            ...item,
            categoryId: cat.id,
            isPredefined: cat.isPredefined,
            packed: false,
          }))
        ));
        setMasterCategories(DEFAULT_PACKING_CATEGORIES.map(cat => ({
          id: cat.id,
          displayName: cat.displayName,
          isPredefined: cat.isPredefined,
        })));
      })
      .finally(() => setKitLoading(false));
  }, [user]);

  // Handler for saving the kit
  const handleSaveKit = async (items: TKitChecklistItem[], categories: TMasterCategory[]) => {
    if (!user) return;
    setKitLoading(true);
    await UserService.updateMasterKit(user.id, { items, categories });
    setMasterKitList(items);
    setMasterCategories(categories);
    setCustomizations(prev => ({ ...prev, customKitListSetup: true }));
    setKitModalVisible(false);
    setKitLoading(false);
  };

  const handleCustomizationButton = (key: keyof SetupCustomizations) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCompleteSetup = async () => {
    if (!user) return;
    
    setIsCompleting(true);
    try {
      await updateUserSetup({
        firstTimeSetup: false,
        showOnboarding: false,
        ...customizations
      });
      
      // Navigate to projects after setup is complete
      router.replace('/(app)/projects');
    } catch (error) {
      console.error('Failed to complete setup:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkipSetup = async () => {
    if (!user) return;
    
    setIsCompleting(true);
    try {
      await updateUserSetup({
        firstTimeSetup: false,
        showOnboarding: false,
        customKitListSetup: false,
        customTaskListSetup: false,
        customNFCBusinessCardSetup: false,
        customGroupShotsSetup: false,
        customCoupleShotsSetup: false,
      });
      
      // Navigate to projects after setup is complete
      router.replace('/(app)/projects');
    } catch (error) {
      console.error('Failed to skip setup:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <Screen scrollable padding="lg" edges={['bottom', 'left', 'right']}>
        <HeadlineText size="large">Loading...</HeadlineText>
      </Screen>
    );
  }

  return (
    <Screen scrollable padding="lg" edges={['bottom', 'left', 'right']}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginBottom: 4 }}>
          <HeadlineText size="medium" style={{ 
            textAlign: 'center',
            marginBottom: 16,
            color: theme.colors.onSurface 
          }}>
            Welcome to EyeDooApp!
          </HeadlineText>
          
          <BodyText size="medium" style={{ 
            textAlign: 'center', 
            marginBottom: 4,
            color: theme.colors.onSurface 
          }}>
            Lets customize your experience. You can always change these settings later.
          </BodyText>
        </View>
        {/* <Divider style={{ marginVertical: 12 }} />             */}
        <View style={{ marginBottom: 4 }}>              
            <BodyText size="medium" style={{ 
            marginBottom: 16, 
            color: theme.colors.onSurface,
            textAlign: 'center'
            }}>
            Simplify Your Preparation with Custom Kit and Task Lists
            </BodyText>
            <CustomButton
            title="Setup Custom Kit List"
            onPress={() => setKitModalVisible(true)}
            style={{ marginTop: -8,  width: '80%', alignSelf: 'center'}}
            />
            <CustomButton
            title="Setup Custom Task List"
            onPress={() => handleCustomizationButton('customTaskListSetup')}
            style={{ marginTop: 16,  width: '80%', alignSelf: 'center' }}
            />
        </View>
        {/* <Divider style={{ marginVertical: 12 }} /> */}
        <View style={{ marginBottom: 4 }}>              
            <BodyText size="medium" style={{ 
            marginBottom: 16, 
            color: theme.colors.onSurface,
            textAlign: 'center'
            }}>
            Forget Business Cards, Add an NFC Card for Easy Sharing
            </BodyText>
            <CustomButton
            title="Setup NFC Business Card"
            onPress={() => handleCustomizationButton('customNFCBusinessCardSetup')}
            style={{ marginTop: -8,  width: '80%', alignSelf: 'center' }}
            />
        </View>
        {/* <Divider style={{ marginVertical: 12 }} /> */}
        <View style={{ marginBottom: 4 }}>              
            <BodyText size="medium" style={{ 
            marginBottom: 16, 
            color: theme.colors.onSurface,
            textAlign: 'center'
            }}>
            Customize Your Shot Lists so You Can Focus on the Fun Stuff
            </BodyText>
            <CustomButton
            title="Setup Group Shot List"
            onPress={() => handleCustomizationButton('customGroupShotsSetup')}
            style={{ marginTop: -8,  width: '80%', alignSelf: 'center' }}
            />
            <CustomButton
            title="Setup Couple Shot List"
            onPress={() => handleCustomizationButton('customCoupleShotsSetup')}
            style={{ marginTop: 16,  width: '80%', alignSelf: 'center' }}
            />
        </View>
        <Divider style={{ marginVertical: 8 }} />
           
        <View style={{ marginBottom: 32 }}>
          <Button
            mode="contained"
            onPress={handleCompleteSetup}
            loading={isCompleting}
            disabled={isCompleting}
            style={{ 
              marginBottom: 16,
              paddingVertical: 4, 
              width: '80%',
              alignSelf: 'center'
            }}
            labelStyle={{ fontSize: 16 }}
          >
            Complete Setup
          </Button>

          <Button
            mode="outlined"
            onPress={handleSkipSetup}
            disabled={isCompleting}
            style={{ paddingVertical: 4, width: '80%', alignSelf: 'center' }}
            labelStyle={{ fontSize: 16 }}
          >
            Skip Customization
          </Button>
        </View>
      </ScrollView>
      <BaseFormModal
        visible={kitModalVisible}
        onClose={() => setKitModalVisible(false)}
        title="Customize Your Master Kit"
      >
        <MasterKitForm
          initialKitList={masterKitList}
          initialCategories={masterCategories}
          onSave={handleSaveKit}
          onCancel={() => setKitModalVisible(false)}
          isSaving={kitLoading}
        />
      </BaseFormModal>
    </Screen>
  );
} 