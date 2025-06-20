import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-get-random-values'; // Needed for uuid
import {
    Button,
    Card,
    IconButton,
    List,
    Text,
} from 'react-native-paper';
import { z } from 'zod';
import { useForm4Photos } from '../../contexts/Form4PhotosContext';
import {
    CANDID_SHOT_CATEGORIES,
    CandidShotCategory,
    COUPLE_SHOT_CATEGORIES,
    CoupleShotCategory,
    GROUP_SHOT_CATEGORIES,
    GroupShotCategory,
    ImportanceLevel,
    PHOTO_REQUEST_TYPES,
    PhotoRequestType
} from '../../types/enum';
import {
    CandidShotSchema,
    CoupleShotSchema,
    GroupShotSchema,
    PhotoRequestSchema
} from '../../types/reusableSchemas';
import CustomDropdown from '../ui/CustomDropdown';
import FormModal from '../ui/FormModal';

type CandidShot = z.infer<typeof CandidShotSchema>;
type CoupleShot = z.infer<typeof CoupleShotSchema>;
type GroupShot = z.infer<typeof GroupShotSchema>;
type PhotoRequest = z.infer<typeof PhotoRequestSchema>;

// --- Main Modal Component ---
export const PhotosFormModal: React.FC = () => {
  const context = useForm4Photos();
  const { formData } = context;

  if (!formData) return null;

  return (
    <FormModal
        title="Photo Requirements"
        subtitle="Specify the photos you want for your project"
        context={context}
        saveLabel="Save Photos"
        cancelLabel="Cancel"
    >
        <PhotosFormFields />
    </FormModal>
  );
};

const GroupShotForm: React.FC<{groupShot: GroupShot, index: number, onUpdate: (g: GroupShot) => void, onRemove: () => void}> = ({ groupShot, index, onUpdate, onRemove }) => {
    return (
        <Card style={styles.subCard}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant='titleMedium'>Group Shot {index + 1}</Text>
                    <IconButton icon="delete" size={20} onPress={onRemove} />
                </View>
                <CustomDropdown
                    placeholder={groupShot.groupShotType || 'Select Your Group Shots'}
                    data={GROUP_SHOT_CATEGORIES.map(o => ({ label: o, value: o }))}
                    onSelect={(selectedItem) => onUpdate({ ...groupShot, groupShotType: selectedItem.value as GroupShotCategory })}
                />
            </Card.Content>
        </Card>
    );
};

const CoupleShotForm: React.FC<{coupleShot: CoupleShot, index: number, onUpdate: (c: CoupleShot) => void, onRemove: () => void}> = ({ coupleShot, index, onUpdate, onRemove }) => {
    return (
        <Card style={styles.subCard}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant='titleMedium'>Couple Shot {index + 1}</Text>
                    <IconButton icon="delete" size={20} onPress={onRemove} />
                </View>
                <CustomDropdown
                    placeholder={coupleShot.coupleShotType || 'Select Your Couple Shots'}
                    data={COUPLE_SHOT_CATEGORIES.map(o => ({ label: o, value: o }))}
                    onSelect={(selectedItem) => onUpdate({ ...coupleShot, coupleShotType: selectedItem.value as CoupleShotCategory })}
                />
            </Card.Content>
        </Card>
    );
};

const CandidShotForm: React.FC<{candidShot: CandidShot, index: number, onUpdate: (c: CandidShot) => void, onRemove: () => void}> = ({ candidShot, index, onUpdate, onRemove }) => {
    return (
        <Card style={styles.subCard}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant='titleMedium'>Candid Shot {index + 1}</Text>
                    <IconButton icon="delete" size={20} onPress={onRemove} />
                </View>
                <CustomDropdown
                    placeholder={candidShot.candidShotType || 'Select Your Candid Shots'}
                    data={CANDID_SHOT_CATEGORIES.map(o => ({ label: o, value: o }))}
                    onSelect={(selectedItem) => onUpdate({ ...candidShot, candidShotType: selectedItem.value as CandidShotCategory })}
                />
            </Card.Content>
        </Card>
    );
};

const PhotoRequestForm: React.FC<{photoRequest: PhotoRequest, index: number, onUpdate: (p: PhotoRequest) => void, onRemove: () => void}> = ({ photoRequest, index, onUpdate, onRemove }) => {
    return (
        <Card style={styles.subCard}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant='titleMedium'>Photo Request {index + 1}</Text>
                    <IconButton icon="delete" size={20} onPress={onRemove} />
                </View>
                <CustomDropdown
                    placeholder={photoRequest.photoRequestType || 'Select Your Photo Requests'}
                    data={PHOTO_REQUEST_TYPES.map(o => ({ label: o, value: o }))}
                    onSelect={(selectedItem) => onUpdate({ ...photoRequest, photoRequestType: selectedItem.value as PhotoRequestType })}
                />
            </Card.Content>
        </Card>
    );
};

// const MustHaveMomentForm: React.FC<{mustHaveMoment: MustHaveMoment, index: number, onUpdate: (m: MustHaveMoment) => void, onRemove: () => void}> = ({ mustHaveMoment, index, onUpdate, onRemove }) => {
//     return (
//         <Card style={styles.subCard}>
//             <Card.Content>
//                 <View style={styles.cardHeader}>
//                     <Text variant='titleMedium'>Must Have Moment {index + 1}</Text>
//                     <IconButton icon="delete" size={20} onPress={onRemove} />
//                 </View>
//                 <CustomDropdown
//                     placeholder={mustHaveMoment.mustHaveMomentType || 'Select Your Must Have Moments'}
//                     data={MUST_HAVE_MOMENTS.map(o => ({ label: o, value: o }))}
//                     onSelect={(selectedItem) => onUpdate({ ...mustHaveMoment, mustHaveMomentType: selectedItem.value as MustHaveMomentType })}
//                 />
//             </Card.Content>
//         </Card>
//     );
// };

// const SentimentalMomentForm: React.FC<{sentimentalMoment: SentimentalMoment, index: number, onUpdate: (s: SentimentalMoment) => void, onRemove: () => void}> = ({ sentimentalMoment, index, onUpdate, onRemove }) => {
//     return (
//         <Card style={styles.subCard}>
//             <Card.Content>
//                 <View style={styles.cardHeader}>
//                     <Text variant='titleMedium'>Sentimental Moment {index + 1}</Text>
//                     <IconButton icon="delete" size={20} onPress={onRemove} />
//                 </View>
//                 <CustomDropdown
//                     placeholder={sentimentalMoment.sentimentalMomentType || 'Select Your Sentimental Moments'}
//                     data={SENTIMENTAL_MOMENTS.map(o => ({ label: o, value: o }))}
//                     onSelect={(selectedItem) => onUpdate({ ...sentimentalMoment, sentimentalMomentType: selectedItem.value as SentimentalMomentType })}
//                 />
//             </Card.Content>
//         </Card>
//     );
// };

const PhotosFormFields: React.FC = () => {
    const { formData, setFormData } = useForm4Photos();
    const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());

    if (!formData) return null;

    const updateFormData = (updates: Partial<typeof formData>) => 
        setFormData((prev) => prev ? { ...prev, ...updates } : null);
    const addGroupShot = () => updateFormData({ groupShots: [...(formData.groupShots || []), { 
        groupShotType: GroupShotCategory.COUPLE_WITH_EACH_PARENT,
        importance: ImportanceLevel.MEDIUM,
        alwaysInclude: false
    }] });
    const updateGroupShot = (i: number, g: GroupShot) => updateFormData({ groupShots: (formData.groupShots || []).map((shot, idx) => idx === i ? g : shot) });
    const removeGroupShot = (i: number) => updateFormData({ groupShots: (formData.groupShots || []).filter((_, idx) => idx !== i) });
    
    const addCoupleShot = () => updateFormData({ coupleShots: [...(formData.coupleShots || []), { 
        coupleShotType: CoupleShotCategory.CLASSIC_POSED_PORTRAITS,
        importance: ImportanceLevel.MEDIUM,
        alwaysInclude: false
    }] });
    const updateCoupleShot = (i: number, c: CoupleShot) => updateFormData({ coupleShots: (formData.coupleShots || []).map((shot, idx) => idx === i ? c : shot) });
    const removeCoupleShot = (i: number) => updateFormData({ coupleShots: (formData.coupleShots || []).filter((_, idx) => idx !== i) });
    
    const addCandidShot = () => updateFormData({ candidShots: [...(formData.candidShots || []), { 
        candidShotType: CandidShotCategory.HAIR_AND_MAKEUP,
        importance: ImportanceLevel.MEDIUM,
        alwaysInclude: false
    }] });
    const updateCandidShot = (i: number, c: CandidShot) => updateFormData({ candidShots: (formData.candidShots || []).map((shot, idx) => idx === i ? c : shot) });
    const removeCandidShot = (i: number) => updateFormData({ candidShots: (formData.candidShots || []).filter((_, idx) => idx !== i) });

    const addPhotoRequest = () => updateFormData({ photoRequests: [...(formData.photoRequests || []), { 
        photoRequestType: PhotoRequestType.GROUP_SHOT,
        importance: ImportanceLevel.MEDIUM
    }] });
    const updatePhotoRequest = (i: number, p: PhotoRequest) => updateFormData({ photoRequests: (formData.photoRequests || []).map((request, idx) => idx === i ? p : request) });
    const removePhotoRequest = (i: number) => updateFormData({ photoRequests: (formData.photoRequests || []).filter((_, idx) => idx !== i) });

    // const addMustHaveMoment = () => updateFormData({ mustHaveMoments: [...(formData.mustHaveMoments || []), { photoRequestType: PhotoRequestType.GROUP_SHOT }] });
    // const updateMustHaveMoment = (i: number, m: PhotoRequest) => updateFormData({ mustHaveMoments: (formData.mustHaveMoments || []).map((request, idx) => idx === i ? m : request) });
    // const removeMustHaveMoment = (i: number) => updateFormData({ mustHaveMoments: (formData.mustHaveMoments || []).filter((_, idx) => idx !== i) });

    // const addSentimentalMoment = () => updateFormData({ sentimentalMoments: [...(formData.sentimentalMoments || []), { photoRequestType: PhotoRequestType.GROUP_SHOT }] });
    // const updateSentimentalMoment = (i: number, m: PhotoRequest) => updateFormData({ sentimentalMoments: (formData.sentimentalMoments || []).map((request, idx) => idx === i ? m : request) });
    // const removeSentimentalMoment = (i: number) => updateFormData({ sentimentalMoments: (formData.sentimentalMoments || []).filter((_, idx) => idx !== i) });

    // Track accordion expansion
    const handleAccordionToggle = (accordionId: string) => {
        setExpandedAccordions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(accordionId)) {
                newSet.delete(accordionId);
            } else {
                newSet.add(accordionId);
            }
            return newSet;
        });
    };

    // Use Zod validation errors to determine accordion state - now works for both expanded and collapsed
    const getAccordionStyle = (accordionId: string, hasErrors: boolean) => {
        const isExpanded = expandedAccordions.has(accordionId);        
        console.log(`Accordion ${accordionId}:`, { isExpanded, hasErrors });        
        // Return array of styles directly
        if (hasErrors) {
            return [styles.accordion, styles.accordionInvalid]; // Red tint when has errors
        } else {
            return [styles.accordion, styles.accordionValid]; // Green tint when no errors
        }
    };

    // Check validation state for each accordion
    const groupShotsHasErrors = !!(formData.groupShots || []).some(shot => !shot.groupShotType);
    const coupleShotsHasErrors = !!(formData.coupleShots || []).some(shot => !shot.coupleShotType);
    const candidShotsHasErrors = !!(formData.candidShots || []).some(shot => !shot.candidShotType);
    const photoRequestsHasErrors = !!(formData.photoRequests || []).some(request => !request.photoRequestType);
    // const mustHaveMomentsHasErrors = !!(formData.mustHaveMoments || []).some(request => !request.photoRequestType);
    // const sentimentalMomentsHasErrors = !!(formData.sentimentalMoments || []).some(request => !request.photoRequestType);

//REPLACE WITH SHOT CARDS

    return (
        <>
           <List.AccordionGroup>
            <List.Accordion 
                title={`Group Shots (${formData.groupShots?.length || 0})`} 
                id="groupShots" 
                style={getAccordionStyle('groupShots', groupShotsHasErrors)} 
                onPress={() => handleAccordionToggle('groupShots')}
                >
                <View style={styles.accordionContent}>
                    <Button mode="contained-tonal" onPress={addGroupShot} icon="plus" style={{marginBottom: 16}}> Add Group Shot </Button>
                    {(formData.groupShots || []).map((groupShot, index) => (
                    <GroupShotForm key={index} groupShot={groupShot} index={index} onUpdate={(g) => updateGroupShot(index, g)} onRemove={() => removeGroupShot(index)} />
                    ))}
                </View>
            </List.Accordion>
            <List.Accordion 
                title={`Couple Shots (${formData.coupleShots?.length || 0})`} 
                id="coupleShots" 
                style={getAccordionStyle('coupleShots', coupleShotsHasErrors)} 
                onPress={() => handleAccordionToggle('coupleShots')}
            >
                <View style={styles.accordionContent}>
                    <Button mode="contained-tonal" onPress={addCoupleShot} icon="plus" style={{marginBottom: 16}}> Add Couple Shot </Button>
                    {(formData.coupleShots || []).map((coupleShot, index) => (
                    <CoupleShotForm key={index} coupleShot={coupleShot} index={index} onUpdate={(c) => updateCoupleShot(index, c)} onRemove={() => removeCoupleShot(index)} />
                    ))}
                </View>
            </List.Accordion>
            <List.Accordion 
                title={`Candid Shots (${formData.candidShots?.length || 0})`} 
                id="candidShots" 
                style={getAccordionStyle('candidShots', candidShotsHasErrors)} 
                onPress={() => handleAccordionToggle('candidShots')}
            >
                <View style={styles.accordionContent}>
                    <Button mode="contained-tonal" onPress={addCandidShot} icon="plus" style={{marginBottom: 16}}> Add Candid Shot </Button>
                    {(formData.candidShots || []).map((candidShot, index) => (
                    <CandidShotForm key={index} candidShot={candidShot} index={index} onUpdate={(c) => updateCandidShot(index, c)} onRemove={() => removeCandidShot(index)} />
                    ))}
                </View>
            </List.Accordion>
            <List.Accordion 
                title={`Photo Requests (${formData.photoRequests?.length || 0})`} 
                id="photoRequests" 
                style={getAccordionStyle('photoRequests', photoRequestsHasErrors)} 
                onPress={() => handleAccordionToggle('photoRequests')}
            >
                <View style={styles.accordionContent}>
                    <Button mode="contained-tonal" onPress={addPhotoRequest} icon="plus" style={{marginBottom: 16}}> Add Photo Request </Button>
                    {(formData.photoRequests || []).map((photoRequest, index) => (
                        <PhotoRequestForm key={index} photoRequest={photoRequest} index={index} onUpdate={(p) => updatePhotoRequest(index, p)} onRemove={() => removePhotoRequest(index)} />
                    ))}
                </View>
            </List.Accordion>
           </List.AccordionGroup>
        </>
    );
};
const styles = StyleSheet.create({
    card: { marginBottom: 16 },
    subCard: { backgroundColor: '#fff', marginBottom: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0'},
    subCardContent: { padding: 12 },
    accordion: { 
      backgroundColor: '#ffffff', 
      borderColor: '#e0e0e0', 
      borderWidth: 1, 
      marginBottom: 8, 
      borderRadius: 8 
    },
    accordionValid: {
      backgroundColor: '#f0f9f0', // Light green background
      borderColor: '#4caf50',     // Green border
      borderWidth: 2,
    },
    accordionInvalid: {
      backgroundColor: '#fef8f8', // Light red background
      borderColor: '#f44336',     // Red border
      borderWidth: 2,
    },
    accordionContent: { padding: 12 },
    input: { marginBottom: 8 },
    cardHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  });

  export default PhotosFormModal;



//                 label="Category"
//                 value={groupShot.groupShotType}
//                 options={GROUP_SHOT_CATEGORIES.map(c => ({ label: c, value: c }))}
//                 onValueChange={(value) => onUpdate({ ...groupShot, groupShotType: value })}
//             />
//         </View>
//     );
// };




// // --- Form Fields Component ---
// const PhotosFormFields: React.FC = () => {
//     const { formData, addShot, removeShot, updateShot } = useForm4Photos();

//     if (!formData) return null;

//     return (
//         <List.AccordionGroup>
//             <List.Accordion title={`Group Shots (${formData.groupShots?.length || 0})`} id="groupShots" style={styles.accordion}>
//                 <Button onPress={() => addShot('groupShots')} mode='contained-tonal' style={styles.addButton}>Add Group Shot</Button>
//                 {formData.groupShots?.map((shot, index) => (
//                     <ShotCard key={shot.id!} title={`Group Shot ${index + 1}`} onRemove={() => removeShot('groupShots', shot.id!)}>
//                         <CustomDropdown
//                             label="Category"
//                             value={shot.groupShotType}
//                             options={GROUP_SHOT_CATEGORIES.map(c => ({ label: c, value: c }))}
//                             onValueChange={(value) => updateShot('groupShots', shot.id!, { groupShotType: value })}
//                         />
//                         <TextInput label="Description" value={shot.groupDescription || ''} onChangeText={text => updateShot('groupShots', shot.id!, { groupDescription: text })} mode="outlined" style={styles.input}/>
//                     </ShotCard>
//                 ))}
//             </List.Accordion>

//             <List.Accordion title={`Couple Shots (${formData.coupleShots?.length || 0})`} id="coupleShots" style={styles.accordion}>
//                 <Button onPress={() => addShot('coupleShots')} mode='contained-tonal' style={styles.addButton}>Add Couple Shot</Button>
//                 {formData.coupleShots?.map((shot, index) => (
//                     <ShotCard key={shot.id!} title={`Couple Shot ${index + 1}`} onRemove={() => removeShot('coupleShots', shot.id!)}>
//                          <CustomDropdown
//                             label="Category"
//                             value={shot.coupleShotType}
//                             options={COUPLE_SHOT_CATEGORIES.map(c => ({ label: c, value: c }))}
//                             onValueChange={(value) => updateShot('coupleShots', shot.id!, { coupleShotType: value })}
//                         />
//                         <TextInput label="Notes" value={shot.notes || ''} onChangeText={text => updateShot('coupleShots', shot.id!, { notes: text })} mode="outlined" style={styles.input}/>
//                     </ShotCard>
//                 ))}
//             </List.Accordion>
            
//             <List.Accordion title={`Candid Shots (${formData.candidShots?.length || 0})`} id="candidShots" style={styles.accordion}>
//                 <Button onPress={() => addShot('candidShots')} mode='contained-tonal' style={styles.addButton}>Add Candid Shot</Button>
//                 {formData.candidShots?.map((shot, index) => (
//                     <ShotCard key={shot.id!} title={`Candid Shot ${index + 1}`} onRemove={() => removeShot('candidShots', shot.id!)}>
//                         <CustomDropdown
//                             label="Category"
//                             value={shot.candidShotType}
//                             options={CANDID_SHOT_CATEGORIES.map(c => ({ label: c, value: c }))}
//                             onValueChange={(value) => updateShot('candidShots', shot.id!, { candidShotType: value })}
//                         />
//                         <TextInput label="Notes" value={shot.notes || ''} onChangeText={text => updateShot('candidShots', shot.id!, { notes: text })} mode="outlined" style={styles.input}/>
//                     </ShotCard>
//                 ))}
//             </List.Accordion>
            
//             <List.Accordion title={`Photo Requests (${formData.photoRequests?.length || 0})`} id="photoRequests" style={styles.accordion}>
//                 <Button onPress={() => addShot('photoRequests')} mode='contained-tonal' style={styles.addButton}>Add Photo Request</Button>
//                 {formData.photoRequests?.map((request, index) => (
//                     <ShotCard key={request.id!} title={`Photo Request ${index + 1}`} onRemove={() => removeShot('photoRequests', request.id!)}>
//                         <CustomDropdown
//                             label="Type"
//                             value={request.photoRequestType}
//                             options={PHOTO_REQUEST_TYPES.map(t => ({ label: t, value: t }))}
//                             onValueChange={(value) => updateShot('photoRequests', request.id!, { photoRequestType: value })}
//                         />
//                         <TextInput label="Title" value={request.title || ''} onChangeText={text => updateShot('photoRequests', request.id!, { title: text })} mode="outlined" style={styles.input}/>
//                         <TextInput label="Notes" value={request.notes || ''} onChangeText={text => updateShot('photoRequests', request.id!, { notes: text })} mode="outlined" style={styles.input}/>
//                     </ShotCard>
//                 ))}
//             </List.Accordion>
//         </List.AccordionGroup>
//     );
// };

// // --- Reusable Shot Form Component ---
// const ShotCard = ({ title, onRemove, children }: { title: string, onRemove: () => void, children: React.ReactNode }) => (
//     <Card style={styles.shotCard}>
//         <Card.Content>
//             <View style={styles.cardHeader}>
//                 <Text variant="titleMedium">{title}</Text>
//                 <IconButton icon="delete" size={20} onPress={onRemove} />
//             </View>
//             {children}
//         </Card.Content>
//     </Card>
// );

// // --- Styles ---
// const styles = {
//   accordion: {
//     backgroundColor: '#ffffff',
//     borderColor: '#e0e0e0',
//     borderWidth: 1,
//     marginBottom: 8,
//     borderRadius: 8
//   },
//   shotCard: {
//     backgroundColor: '#fff',
//     marginVertical: 8,
//     elevation: 1,
//   },
//   cardHeader: {
//     flexDirection: 'row' as const,
//     justifyContent: 'space-between' as const,
//     alignItems: 'center' as const,
//   },
//   input: {
//     marginVertical: 8,
//   },
//   addButton: {
//       margin: 10,
//   }
// };

// export default PhotosFormModal;
// import React from 'react';
// import { View } from 'react-native';
// import 'react-native-get-random-values'; // Needed for uuid
// import {
//   Button,
//   Card,
//   IconButton,
//   List,
//   Text,
//   TextInput,
// } from 'react-native-paper';
// import { useForm4Photos } from '../../contexts/Form4PhotosContext';
// import { COUPLE_SHOT_CATEGORIES, GROUP_SHOT_CATEGORIES } from '../../types/enum';
// import BaseFormModal from '../ui/BaseFormModal';
// import { CustomDropdown } from '../ui/CustomDropdown';

// // --- Main Modal Component ---
// export const PhotosFormModal: React.FC = () => {
//   const context = useForm4Photos();
//   const { formData } = context;

//   if (!formData) {
//     return null;
//   }

//   return (
//     <BaseFormModal
//         title="Photo Requirements"
//         subtitle="Specify the photos you want for your project"
//         context={context}
//         saveLabel="Save Photos"
//         cancelLabel="Cancel"
//     >
//         <PhotosFormFields />
//     </BaseFormModal>
//   );
// };


// // --- Form Fields Component ---
// const PhotosFormFields: React.FC = () => {
//     const { formData, addShot, removeShot, updateShot } = useForm4Photos();

//     if (!formData) return null;

//     return (
//         <List.AccordionGroup>
//             <List.Accordion title={`Group Shots (${formData.groupShots?.length || 0})`} id="groupShots" style={styles.accordion}>
//                 <Button onPress={() => addShot('groupShots')} mode='contained-tonal' style={styles.addButton}>Add Group Shot</Button>
//                 {formData.groupShots?.map((shot, index) => (
//                     <ShotCard key={shot.id!} title={`Group Shot ${index + 1}`} onRemove={() => removeShot('groupShots', shot.id!)}>
//                         <CustomDropdown
//                             label="Category"
//                             value={shot.groupShotType}
//                             options={GROUP_SHOT_CATEGORIES.map(c => ({ label: c, value: c }))}
//                             onValueChange={(value) => updateShot('groupShots', shot.id!, { groupShotType: value })}
//                         />
//                         <TextInput label="Description" value={shot.groupDescription || ''} onChangeText={text => updateShot('groupShots', shot.id!, { groupDescription: text })} mode="outlined" style={styles.input}/>
//                     </ShotCard>
//                 ))}
//             </List.Accordion>

//             <List.Accordion title={`Couple Shots (${formData.coupleShots?.length || 0})`} id="coupleShots" style={styles.accordion}>
//                 <Button onPress={() => addShot('coupleShots')} mode='contained-tonal' style={styles.addButton}>Add Couple Shot</Button>
//                 {formData.coupleShots?.map((shot, index) => (
//                     <ShotCard key={shot.id!} title={`Couple Shot ${index + 1}`} onRemove={() => removeShot('coupleShots', shot.id!)}>
//                          <CustomDropdown
//                             label="Category"
//                             value={shot.coupleShotType}
//                             options={COUPLE_SHOT_CATEGORIES.map(c => ({ label: c, value: c }))}
//                             onValueChange={(value) => updateShot('coupleShots', shot.id!, { coupleShotType: value })}
//                         />
//                         <TextInput label="Notes" value={shot.notes || ''} onChangeText={text => updateShot('coupleShots', shot.id!, { notes: text })} mode="outlined" style={styles.input}/>
//                     </ShotCard>
//                 ))}
//             </List.Accordion>
//             <List.Accordion title={`Candid Shots (${formData.candidShots?.length || 0})`} id="candidShots" style={styles.accordion}>
//                 <Button onPress={() => addShot('candidShots')} mode='contained-tonal' style={styles.addButton}>Add Candid Shot</Button>
//                 {formData.candidShots?.map((shot, index) => (
//                     <ShotCard key={shot.id!} title={`Candid Shot ${index + 1}`} onRemove={() => removeShot('candidShots', shot.id!)}>
//                         <TextInput label="Notes" value={shot.notes || ''} onChangeText={text => updateShot('candidShots', shot.id!, { notes: text })} mode="outlined" style={styles.input}/>
//                     </ShotCard>
//                 ))}
//             </List.Accordion>
//             <List.Accordion title={`Photo Requests (${formData.photoRequests?.length || 0})`} id="photoRequests" style={styles.accordion}>
//                 <Button onPress={() => addShot('photoRequests')} mode='contained-tonal' style={styles.addButton}>Add Photo Request</Button>
//                 {formData.photoRequests?.map((request, index) => (
//                     <ShotCard key={request.id!} title={`Photo Request ${index + 1}`} onRemove={() => removeShot('photoRequests', request.id!)}>
//                         <TextInput label="Notes" value={request.notes || ''} onChangeText={text => updateShot('photoRequests', request.id!, { notes: text })} mode="outlined" style={styles.input}/>
//                     </ShotCard>
//                 ))}
//             </List.Accordion>
//         </List.AccordionGroup>
//     );
// };


// // --- Reusable Shot Form Component ---
// const ShotCard = ({ title, onRemove, children }: { title: string, onRemove: () => void, children: React.ReactNode }) => (
//     <Card style={styles.shotCard}>
//         <Card.Content>
//             <View style={styles.cardHeader}>
//                 <Text variant="titleMedium">{title}</Text>
//                 <IconButton icon="delete" size={20} onPress={onRemove} />
//             </View>
//             {children}
//         </Card.Content>
//     </Card>
// );


// // --- Styles ---
// const styles = {
//   accordion: {
//     backgroundColor: '#ffffff',
//     borderColor: '#e0e0e0',
//     borderWidth: 1,
//     marginBottom: 8,
//     borderRadius: 8
//   },
//   shotCard: {
//     backgroundColor: '#fff',
//     marginVertical: 8,
//     elevation: 1,
//   },
//   cardHeader: {
//     flexDirection: 'row' as const,
//     justifyContent: 'space-between' as const,
//     alignItems: 'center' as const,
//   },
//   input: {
//     marginVertical: 8,
//   },
//   addButton: {
//       margin: 10,
//   }
// };

// export default PhotosFormModal;
