import { Button, Divider, useTheme } from "react-native-paper";

import { CustomButton } from "@/components";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import BaseFormModal from "../../../components/ui/BaseFormModal";
import { Screen } from "../../../components/ui/Screen";
import { BodyText, HeadlineText } from "../../../components/ui/Typography";

import { useAuth } from "../../../contexts/AuthContext";
import { UserService } from "../../../services/userService";

import MasterKitForm from "../../../components/kit/MasterKitForm";
import { DEFAULT_PACKING_CATEGORIES } from "../../../constants/kitChecklistTypes";
import { generatePredefinedItems } from "../../../services/utils/kitUtils"; // Import the new utility function
import { TKitChecklistItem, TMasterCategory } from "../../../types/kitChecklist";

import MasterTaskForm from "@/components/tasks/MasterTaskForm";
import { DEFAULT_TASK_CATEGORIES } from "../../../constants/taskChecklistTypes";
import { generatePredefinedTasks } from "../../../services/utils/taskUtils";
import { TMasterTaskCategory, TTaskChecklistItem } from "../../../types/taskChecklist";

import MasterGroupShotsForm from "@/components/groups/MasterGroupShotsForm";
import { DEFAULT_GROUPSHOT_CATEGORIES } from "../../../constants/groupShotsChecklistTypes";
import { generatePredefinedGroupShots } from "../../../services/utils/groupShotUtils";
import { TGroupShotsChecklistItem, TMasterGroupShotsCategory } from "../../../types/groupShotsChecklist";

import MasterCoupleShotsForm from "@/components/couple/MasterCoupleShotsForm";
import { DEFAULT_COUPLESHOT_CATEGORIES } from "../../../constants/coupleShotsChecklistTypes";
import { generatePredefinedCoupleShots } from "../../../services/utils/coupleShotsUtils";
import { TCoupleShotsChecklistItem, TMasterCoupleShotsCategory } from "../../../types/coupleShotsChecklist";

interface SetupCustomizations {
  customKitListSetup: boolean;
  customTaskListSetup: boolean;
  customNFCBusinessCardSetup: boolean;
  customGroupShotsSetup: boolean;
  customCoupleShotsSetup: boolean;
}

export default function SetupScreen() {
  const theme = useTheme();
  const { user, updateUserSetup, loading, initialized } = useAuth();
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  const [modalType, setModalType] = useState<null | 'kit' | 'task' | 'nfc' | 'groupShots' | 'coupleShots'>(null);

  // const [kitModalVisible, setKitModalVisible] = useState(false);
  const [kitLoading, setKitLoading] = useState(false);
  const [masterKitList, setMasterKitList] = useState<TKitChecklistItem[]>([]);
  const [masterKitCategories, setMasterKitCategories] = useState<TMasterCategory[]>([]);

  
  // const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [masterTaskList, setMasterTaskList] = useState<TTaskChecklistItem[]>([]);
  const [masterTaskCategories, setMasterTaskCategories] = useState<TMasterTaskCategory[]>([]);

  const [groupShotsLoading, setGroupShotsLoading] = useState(false);
  const [masterGroupShotsList, setMasterGroupShotsList] = useState<TGroupShotsChecklistItem[]>([]);
  const [masterGroupShotsCategories, setMasterGroupShotsCategories] = useState<TMasterGroupShotsCategory[]>([]);

  const [coupleShotsLoading, setCoupleShotsLoading] = useState(false);
  const [masterCoupleShotsList, setMasterCoupleShotsList] = useState<TCoupleShotsChecklistItem[]>([]);
  const [masterCoupleShotsCategories, setMasterCoupleShotsCategories] = useState<TMasterCoupleShotsCategory[]>([]);

  
  const [customizations, setCustomizations] = useState<SetupCustomizations>({
    customKitListSetup: false,
    customTaskListSetup: false,
    customNFCBusinessCardSetup: false,
    customGroupShotsSetup: false,
    customCoupleShotsSetup: false,
  });

  // useEffect is now simplified and no longer creates the kit on mount.
  useEffect(() => {
    if (initialized && !loading && user) {
      console.log(
        "app/setup/index.tsx > User is ready for setup:",
        user.id
      );
    }
  }, [user, initialized, loading]);

  

  // Prepares the default kit data and opens the customization modal.
  const handleOpenKitModal = () => {
    // Generate the default kit structure from constants
    const defaultCategories = DEFAULT_PACKING_CATEGORIES.map((cat) => ({
      id: cat.id,
      displayName: cat.displayName,
      isPredefined: cat.isPredefined,
    }));

    // Use the utility function to generate the default items
    const defaultItems = generatePredefinedItems(DEFAULT_PACKING_CATEGORIES);

    // Set the state with the default data before showing the modal
    setMasterKitCategories(defaultCategories);
    setMasterKitList(defaultItems);
    setModalType('kit');
  };
  // Saves the customized kit from the modal.
  const handleSaveKit = async (
    items: TKitChecklistItem[],
    categories: TMasterCategory[]
  ) => {
    if (!user) return;
    setKitLoading(true);
    try {
      // Calls the service to save the custom kit to Firestore
      await UserService.updateMasterKit(user.id, { items, categories });
      await updateUserSetup({ customKitListSetup: true });
      setModalType(null);

      console.log("LOG: Custom kit saved successfully.");
    } catch (error) {
      console.error("Error saving custom kit:", error);
    } finally {
      setKitLoading(false);
    }
  };


  const handleOpenTaskModal = () => {
    // Generate the default task structure from constants
    const defaultCategories = DEFAULT_TASK_CATEGORIES.map((cat) => ({
      id: cat.id,
      displayName: cat.displayName,
      isPredefined: cat.isPredefined,
    }));

    // Use the utility function to generate the default items
    const defaultTasks = generatePredefinedTasks(DEFAULT_TASK_CATEGORIES);

    // Set the state with the default data before showing the modal
    setMasterTaskCategories(defaultCategories);
    setMasterTaskList(defaultTasks);
    setModalType('task');
  }
  const handleSaveTask = async (
    tasks: TTaskChecklistItem[],
    categories: TMasterTaskCategory[]
  ) => {
    if (!user) return;
    setTaskLoading(true);
    try {
      // Calls the service to save the custom kit to Firestore
      await UserService.updateMasterTask(user.id, { tasks, categories });
      await updateUserSetup({ customTaskListSetup: true });
      setModalType(null);
      console.log("LOG: Custom task list saved successfully.");
    } catch (error) {
      console.error("Error saving custom task list:", error);
    } finally {
      setTaskLoading(false);
    }
  };


  const handleOpenNFCModal = () => {
    setModalType('nfc');
  }

  const handleOpenGroupShotsModal = () => {
    // Generate the default task structure from constants
    const defaultCategories = DEFAULT_GROUPSHOT_CATEGORIES.map((cat) => ({
      id: cat.id,
      displayName: cat.displayName,
      isPredefined: cat.isPredefined,
    }));

    // Use the utility function to generate the default items
    const defaultTasks = generatePredefinedGroupShots(DEFAULT_GROUPSHOT_CATEGORIES);

    // Set the state with the default data before showing the modal
    setMasterGroupShotsCategories(defaultCategories);
    setMasterGroupShotsList(defaultTasks);
    setModalType('groupShots');
  }
  const handleSaveGroupShots = async (
    groupShots: TGroupShotsChecklistItem[],
    categories: TMasterGroupShotsCategory[]
  ) => {
    if (!user) return;
    setGroupShotsLoading(true);
    try {
      // Calls the service to save the custom kit to Firestore
      await UserService.updateMasterGroupShots(user.id, { groupShots, categories });
      await updateUserSetup({ customGroupShotsSetup: true });
      setModalType(null);
      console.log("LOG: Custom group shot list saved successfully.");
    } catch (error) {
      console.error("Error saving custom group shot list:", error);
    } finally {
      setGroupShotsLoading(false);
    }
  }


  const handleOpenCoupleShotsModal = () => {
    // Generate the default task structure from constants
    const defaultCategories = DEFAULT_COUPLESHOT_CATEGORIES.map((cat) => ({
      id: cat.id,
      displayName: cat.displayName,
      isPredefined: cat.isPredefined,
    }));

    // Use the utility function to generate the default items
    const defaultTasks = generatePredefinedCoupleShots(DEFAULT_COUPLESHOT_CATEGORIES);

    // Set the state with the default data before showing the modal
    setMasterCoupleShotsCategories(defaultCategories);
    setMasterCoupleShotsList(defaultTasks);
    setModalType('coupleShots');
  }
  const handleSaveCoupleShots = async (
    coupleShots: TCoupleShotsChecklistItem[],
    categories: TMasterCoupleShotsCategory[]
  ) => {
    if (!user) return;
    setCoupleShotsLoading(true);
    try {
      // Calls the service to save the custom kit to Firestore
      await UserService.updateMasterCoupleShots(user.id, { coupleShots, categories });
      await updateUserSetup({ customCoupleShotsSetup: true });
      setModalType(null);
      console.log("LOG: Custom couple shot list saved successfully.");
    } catch (error) {
      console.error("Error saving custom couple shot list:", error);
    } finally {
      setCoupleShotsLoading(false);
    }
  }


  const handleCloseModal = () => setModalType(null);

  // const handleCustomizationButton = (key: keyof SetupCustomizations) => {
  //   setCustomizations((prev) => ({
  //     ...prev,
  //     [key]: !prev[key],
  //   }));
  // };

  // Finishes setup and navigates away. Creates a default kit if needed.
  const handleCompleteSetup = async () => {
    if (!user) return;

    setIsCompleting(true);
    try {
      // If the user hasn't set up a custom kit, create a default one now.
      if (!customizations.customKitListSetup) {
        await UserService.createDefaultMasterKit(user.id);
        console.log("LOG: Default kit created on completing setup.");
      }

      await updateUserSetup({
        firstTimeSetup: false,
        showOnboarding: false,
        ...customizations,
      });

      router.replace("/(app)/projects");
    } catch (error) {
      console.error("Failed to complete setup:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  // Skips customization, creates a default kit, and navigates away.
  const handleSkipSetup = async () => {
    if (!user) return;

    setIsCompleting(true);
    try {
      // Create and save a default kit for the user in the background.
      await UserService.createDefaultMasterKit(user.id);
      console.log("LOG: Default kit created on skip.");

      // Update setup flags, ensuring all customizations are false.
      await updateUserSetup({
        firstTimeSetup: false,
        showOnboarding: false,
        customKitListSetup: false,
        customTaskListSetup: false,
        customNFCBusinessCardSetup: false,
        customGroupShotsSetup: false,
        customCoupleShotsSetup: false,
      });

      router.replace("/(app)/projects");
    } catch (error) {
      console.error("Failed to skip setup:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  function getModalTitle(modalType: string | null) {
    switch (modalType) {
      case 'kit':
        return "Customize Your Kit List";
      case 'task':
        return "Customize Your Task List";
      case 'nfc':
        return "Setup NFC Business Card";
      case 'groupShots':
        return "Customize Group Shot List";
      case 'coupleShots':
        return "Customize Couple Shot List";
      default:
        return "";
    }
  }

  if (loading) {
    return (
      <Screen scrollable padding="lg" edges={["bottom", "left", "right"]}>
        <HeadlineText size="large">Loading...</HeadlineText>
      </Screen>
    );
  }

  return (
    <Screen 
      scrollable={false}
      padding="md"
      safeArea={true} 
      edges={['bottom', 'left', 'right']}
      backgroundColor={theme.colors.background}
      statusBarStyle="auto"
      testID="setup-screen-index-full"
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginBottom: 4 }}>
          <HeadlineText
            size="medium"
            style={{
              textAlign: "center",
              marginTop: 12,
              marginBottom: 24,
              color: theme.colors.onSurface,
            }}
          >
            Welcome to EyeDooApp!
          </HeadlineText>

          <BodyText
            size="large"
            style={{
              textAlign: "center",
              marginBottom: 4,
              color: theme.colors.onSurface,
            }}
          >
            Lets customize your experience.
            {'\n'}
            You can change these settings later.
          </BodyText>
        </View>
        <Divider style={{ marginVertical: 16 }} />
        <View style={{ marginBottom: 4 }}>
          <BodyText
            size="medium"
            style={{
              marginBottom: 16,
              color: theme.colors.onSurface,
              textAlign: "center",
            }}
          >
            Simplify Your Preparation {'\n'} with Custom Kit and Task Lists
          </BodyText>

          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
            <CustomButton
              size="small"
              title="Custom Kit List"
              onPress={handleOpenKitModal}
              style={{ width: "48%", alignSelf: "center"}}
            />
            <CustomButton
              size="small"
              title="Preparation Tasks"
              onPress={handleOpenTaskModal}
              style={{ width: "48%", alignSelf: "center" }}
            />
          </View>          
        </View>
        <Divider style={{ marginVertical: 16 }} />
        <View style={{ marginBottom: 4 }}>
          <BodyText
            size="medium"
            style={{
              marginBottom: 16,
              color: theme.colors.onSurface,
              textAlign: "center",
            }}
          >
            Forget Business Cards,{'\n'} Add an NFC Card for Easy Sharing
          </BodyText>
          <CustomButton
            size="small"
            title="Setup NFC Business Card"
            onPress={handleOpenNFCModal}
            style={{ marginTop: -4, width: "80%", alignSelf: "center" }}
          />
        </View>
        <Divider style={{ marginVertical: 16 }} />
        <View style={{ marginBottom: 4 }}>
          <BodyText
            size="medium"
            style={{
              marginBottom: 16,
              color: theme.colors.onSurface,
              textAlign: "center",
            }}
          >
            Customize Your Shot Lists{'\n'} So You Can Focus on the Fun Stuff
          </BodyText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
          <CustomButton
            size="small"
            title="Group Shot List"
            onPress={handleOpenGroupShotsModal}
            style={{ width: "48%", alignSelf: "center"}}
          />
          <CustomButton
            size="small"
            title="Couple Shot List"
            onPress={handleOpenCoupleShotsModal}
            style={{ width: "48%", alignSelf: "center"}}
          />
          </View>          
        </View>
        <Divider style={{ marginVertical: 16 }} />
        <View style={{ marginBottom: 16 }}>
          <Button
            mode="contained"
            onPress={handleCompleteSetup}
            loading={isCompleting}
            disabled={isCompleting}
            style={{
              marginBottom: 16,
              paddingVertical: 4,
              width: "80%",
              alignSelf: "center",
            }}
            labelStyle={{ fontSize: 16 }}
          >
            Complete Setup
          </Button>

          <Button
            mode="outlined"
            onPress={handleSkipSetup}
            disabled={isCompleting}
            style={{ paddingVertical: 4, width: "80%", alignSelf: "center" }}
            labelStyle={{ fontSize: 16 }}
          >
            Skip Customization
          </Button>
        </View>
      </ScrollView>

      <BaseFormModal
        visible={modalType !== null}
        onClose={handleCloseModal}        
      >
        {modalType === 'kit' && (
          <MasterKitForm
            title={getModalTitle(modalType)}
            initialKitList={masterKitList}
            initialKitCategories={masterKitCategories}
            onSave={handleSaveKit}
            onCancel={handleCloseModal}
            isSaving={kitLoading}
          />
        )}
        {modalType === 'task' && (
          <MasterTaskForm
            title={getModalTitle(modalType)}
            initialTaskList={masterTaskList}
            initialTaskCategories={masterTaskCategories}
            onSave={handleSaveTask}
            onCancel={handleCloseModal}
            isSaving={taskLoading}
          />
        )}
        {modalType === 'groupShots' && (
          <MasterGroupShotsForm
            title={getModalTitle(modalType)}
            initialGroupShotsList={masterGroupShotsList}
            initialGroupShotsCategories={masterGroupShotsCategories}
            onSave={handleSaveGroupShots}
            onCancel={handleCloseModal}
            isSaving={groupShotsLoading}
          />
        )}
        {modalType === 'coupleShots' && (
          <MasterCoupleShotsForm
            title={getModalTitle(modalType)}
            initialCoupleShotsList={masterCoupleShotsList}
            initialCoupleShotsCategories={masterCoupleShotsCategories}
            onSave={handleSaveCoupleShots}
            onCancel={handleCloseModal}
            isSaving={coupleShotsLoading}
          />
        )}
      </BaseFormModal>
    </Screen>
  );
}

// import { Button, Divider, useTheme } from 'react-native-paper';

// import { CustomButton } from '@/components';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { ScrollView, View } from 'react-native';
// import { v4 as uuidv4 } from 'uuid';
// import MasterKitForm from '../../../components/kit/MasterKitForm';
// import BaseFormModal from '../../../components/ui/BaseFormModal';
// import { Screen } from '../../../components/ui/Screen';
// import { BodyText, HeadlineText } from '../../../components/ui/Typography';
// import { DEFAULT_PACKING_CATEGORIES } from '../../../constants/kitChecklistTypes';
// import { useAuth } from '../../../contexts/AuthContext';
// import { UserService } from '../../../services/userService';
// import { TKitChecklistItem, TMasterCategory } from '../../../types/kitChecklist';
// import { generatePredefinedItems } from "../../../services/utils/kitUtils"; // Assuming you have this utility

// interface SetupCustomizations {
//   customKitListSetup: boolean;
//   customTaskListSetup: boolean;
//   customNFCBusinessCardSetup: boolean;
//   customGroupShotsSetup: boolean;
//   customCoupleShotsSetup: boolean;
// }

// export default function SetupScreen() {
//   const theme = useTheme();
//   const { user, updateUserSetup, loading, initialized } = useAuth();
//   const router = useRouter();
//   const [isCompleting, setIsCompleting] = useState(false);
//   const [kitModalVisible, setKitModalVisible] = useState(false);
//   const [kitLoading, setKitLoading] = useState(false);

//   // State for the kit is now initialized empty. It will be populated
//   // only when the user decides to customize the kit.
//   const [masterKitList, setMasterKitList] = useState<TKitChecklistItem[]>([]);
//   const [masterCategories, setMasterCategories] = useState<TMasterCategory[]>(
//     []
//   );


//   const [customizations, setCustomizations] = useState<SetupCustomizations>({
//     customKitListSetup: false,
//     customTaskListSetup: false,
//     customNFCBusinessCardSetup: false,
//     customGroupShotsSetup: false,
//     customCoupleShotsSetup: false,
//   });


//   useEffect(() => {
//     if (initialized && !loading && user) {
//       console.log("app/setup/index.tsx > User is ready for setup:", user.id);
//     }
//   }, [user, initialized, loading]);

//   // Customise Kit Functions
//   // This function now prepares the default kit for the modal
//   const handleOpenKitModal = () => {
//     // Generate the default kit structure from constants
//     const defaultCategories = DEFAULT_PACKING_CATEGORIES.map((cat) => ({
//       id: cat.id,
//       displayName: cat.displayName,
//       isPredefined: cat.isPredefined,
//     }));
//     // Assumes `generatePredefinedItems` creates the default item list
//     const defaultItems = generatePredefinedItems(DEFAULT_PACKING_CATEGORIES);

//     setMasterCategories(defaultCategories);
//     setMasterKitList(defaultItems);
//     setKitModalVisible(true);
//   };

//   // Saves the customized kit from the modal and completes the setup step.
//   const handleSaveKit = async (
//     items: TKitChecklistItem[],
//     categories: TMasterCategory[]
//   ) => {
//     if (!user) return;
//     setKitLoading(true);
//     try {
//       // Assumes `updateMasterKit` exists in your service to save the kit
//       await UserService.updateMasterKit(user.id, { items, categories });
//       setCustomizations((prev) => ({ ...prev, customKitListSetup: true }));
//       setKitModalVisible(false);
//       console.log("LOG: Custom kit saved successfully.");
//     } catch (error) {
//       console.error("Error saving custom kit:", error);
//     } finally {
//       setKitLoading(false);
//     }
//   };


  

//   const handleCustomizationButton = (key: keyof SetupCustomizations) => {
//     setCustomizations(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const handleCompleteSetup = async () => {
//     if (!user) return;
    
//     setIsCompleting(true);
//     try {
//       await updateUserSetup({
//         firstTimeSetup: false,
//         showOnboarding: false,
//         ...customizations
//       });
      
//       // Navigate to projects after setup is complete
//       router.replace('/(app)/projects');
//     } catch (error) {
//       console.error('Failed to complete setup:', error);
//     } finally {
//       setIsCompleting(false);
//     }
//   };

//   //END OF CUSTOMISE FUNCTIONS


//   // Creates a default objects in the background as skipped and navigates away.
//   const handleSkipSetup = async () => {
//     if (!user) return;

//     setIsCompleting(true);
//     try {
//       // Create and save a default kit for the user
//       await UserService.createDefaultMasterKit(user.id);
//       console.log("LOG: Default kit created on skip.");

//       // Update setup flags
//       await updateUserSetup({
//         firstTimeSetup: false,
//         showOnboarding: false,
//         customKitListSetup: false, // Explicitly false as it was skipped
//         customTaskListSetup: false,  // Explicitly false as it was skipped
//         customNFCBusinessCardSetup: false,  // Explicitly false as it was skipped
//         customGroupShotsSetup: false,  // Explicitly false as it was skipped
//         customCoupleShotsSetup: false,  // Explicitly false as it was skipped
//       });

//       router.replace("/(app)/projects");
//     } catch (error) {
//       console.error("Failed to skip setup:", error);
//     } finally {
//       setIsCompleting(false);
//     }
//   };


//   if (loading) {
//     return (
//       <Screen scrollable padding="lg" edges={['bottom', 'left', 'right']}>
//         <HeadlineText size="large">Loading...</HeadlineText>
//       </Screen>
//     );
//   }

//   return (
//     <Screen scrollable padding="lg" edges={['bottom', 'left', 'right']}>
//       <ScrollView style={{ flex: 1 }}>
//         <View style={{ marginBottom: 4 }}>
//           <HeadlineText size="medium" style={{ 
//             textAlign: 'center',
//             marginBottom: 16,
//             color: theme.colors.onSurface 
//           }}>
//             Welcome to EyeDooApp!
//           </HeadlineText>
          
//           <BodyText size="medium" style={{ 
//             textAlign: 'center', 
//             marginBottom: 4,
//             color: theme.colors.onSurface 
//           }}>
//             Lets customize your experience. You can always change these settings later.
//           </BodyText>
//         </View>
//         {/* <Divider style={{ marginVertical: 12 }} />             */}
//         <View style={{ marginBottom: 4 }}>              
//             <BodyText size="medium" style={{ 
//             marginBottom: 16, 
//             color: theme.colors.onSurface,
//             textAlign: 'center'
//             }}>
//             Simplify Your Preparation with Custom Kit and Task Lists
//             </BodyText>
//             <CustomButton
//             title="Setup Custom Kit List"
//             onPress={() => setKitModalVisible(true)}
//             style={{ marginTop: -8,  width: '80%', alignSelf: 'center'}}
//             />
//             <CustomButton
//             title="Setup Custom Task List"
//             onPress={() => handleCustomizationButton('customTaskListSetup')}
//             style={{ marginTop: 16,  width: '80%', alignSelf: 'center' }}
//             />
//         </View>
//         {/* <Divider style={{ marginVertical: 12 }} /> */}
//         <View style={{ marginBottom: 4 }}>              
//             <BodyText size="medium" style={{ 
//             marginBottom: 16, 
//             color: theme.colors.onSurface,
//             textAlign: 'center'
//             }}>
//             Forget Business Cards, Add an NFC Card for Easy Sharing
//             </BodyText>
//             <CustomButton
//             title="Setup NFC Business Card"
//             onPress={() => handleCustomizationButton('customNFCBusinessCardSetup')}
//             style={{ marginTop: -8,  width: '80%', alignSelf: 'center' }}
//             />
//         </View>
//         {/* <Divider style={{ marginVertical: 12 }} /> */}
//         <View style={{ marginBottom: 4 }}>              
//             <BodyText size="medium" style={{ 
//             marginBottom: 16, 
//             color: theme.colors.onSurface,
//             textAlign: 'center'
//             }}>
//             Customize Your Shot Lists so You Can Focus on the Fun Stuff
//             </BodyText>
//             <CustomButton
//             title="Setup Group Shot List"
//             onPress={() => handleCustomizationButton('customGroupShotsSetup')}
//             style={{ marginTop: -8,  width: '80%', alignSelf: 'center' }}
//             />
//             <CustomButton
//             title="Setup Couple Shot List"
//             onPress={() => handleCustomizationButton('customCoupleShotsSetup')}
//             style={{ marginTop: 16,  width: '80%', alignSelf: 'center' }}
//             />
//         </View>
//         <Divider style={{ marginVertical: 8 }} />
           
//         <View style={{ marginBottom: 32 }}>
//           <Button
//             mode="contained"
//             onPress={handleCompleteSetup}
//             loading={isCompleting}
//             disabled={isCompleting}
//             style={{ 
//               marginBottom: 16,
//               paddingVertical: 4, 
//               width: '80%',
//               alignSelf: 'center'
//             }}
//             labelStyle={{ fontSize: 16 }}
//           >
//             Complete Setup
//           </Button>

//           <Button
//             mode="outlined"
//             onPress={handleSkipSetup}
//             disabled={isCompleting}
//             style={{ paddingVertical: 4, width: '80%', alignSelf: 'center' }}
//             labelStyle={{ fontSize: 16 }}
//           >
//             Skip Customization
//           </Button>
//         </View>
//       </ScrollView>
//       <BaseFormModal
//         visible={kitModalVisible}
//         onClose={() => setKitModalVisible(false)}
//         title="Customize Your Master Kit"
//       >
//         <MasterKitForm
//           initialKitList={masterKitList}
//           initialCategories={masterCategories}
//           onSave={handleSaveKit}
//           onCancel={() => setKitModalVisible(false)}
//           isSaving={kitLoading}
//         />
//       </BaseFormModal>
//     </Screen>
//   );
// } 