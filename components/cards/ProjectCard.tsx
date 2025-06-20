import { MaterialCommunityIcons } from '@expo/vector-icons';
import { differenceInDays } from 'date-fns';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';
import { spacing, useAppTheme } from '../../constants/theme';
import { convertFirestoreTimestamp } from '../../services/utils/timestampHelpers';
import { ProjectStatus } from '../../types/enum';
import { Project } from '../../types/project';
import { BodyText, LabelText, TitleText } from '../ui/Typography';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
  isActive?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  onDelete,
  style,
  isActive = false,
}) => {
  const theme = useAppTheme();
  const { form1 } = project;

  const getStatusColor = (status: ProjectStatus | undefined) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return theme.colors.primary;
      case ProjectStatus.COMPLETED:
        return theme.colors.secondary;
      case ProjectStatus.DRAFT:
        return theme.colors.tertiary;
      case ProjectStatus.CANCELLED:
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const getProgressPercentage = () => {
    let completed = 1; // Start with 1 for form1
    const total = 4;
    
    if (project.form2?.events?.length > 0) completed++;
    if (project.form3?.immediateFamily?.length > 0) completed++;
    if (project.form4?.groupShots?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const formatEventDate = (date: Date | undefined) => {
    if (!date || !(date instanceof Date)) return 'No date set';
    // The eventDate is already a Date object, so we can format it directly.
    return convertFirestoreTimestamp(date).toLocaleDateString();
  };

  const getDaysUntilEvent = (eventDate: Date | undefined) => {
    if (!eventDate || !(eventDate instanceof Date)) return 'N/A';
    
    const now = new Date();
    // No .toDate() needed, as eventDate is already a Date object.
    const diffDays = differenceInDays(eventDate, now);
    
    if (diffDays < 0) return 'Event passed';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days left`;
  };

  const cardStyle: ViewStyle[] = [styles.card, style || {}];
  if (isActive) {
    cardStyle.push({
      borderColor: theme.colors.primary,
      borderWidth: 2,
    });
  }
  
  const clientName = `${form1.personA.firstName} & ${form1.personB.firstName}`;
  const venue = form1.locations?.length > 0 ? form1.locations[0].locationAddress : 'No venue listed';

  return (
    <Card style={cardStyle} onPress={onPress}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <TitleText size="large" numberOfLines={1}>
              {form1.projectName}
            </TitleText>
            <BodyText size="medium" style={{ opacity: 0.7, marginTop: spacing.xs }}>
              {clientName}
            </BodyText>
          </View>
          
          <View style={styles.chipsContainer}>
            {form1.projectStatus && (
                <Chip
                style={{ backgroundColor: getStatusColor(form1.projectStatus) + '20' }}
                textStyle={{ color: getStatusColor(form1.projectStatus), fontSize: 12 }}
              >
                {form1.projectStatus.toUpperCase()}
              </Chip>
            )}
            
            {onDelete && (
              <IconButton
                icon="delete"
                size={20}
                onPress={onDelete}
                style={styles.deleteButton}
              />
            )}
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsRow}>
          <MaterialCommunityIcons 
            name="calendar" 
            size={16} 
            color={theme.colors.onSurfaceVariant}
            style={styles.icon}
          />
          <BodyText size="small" style={{ marginRight: spacing.md }}>
            {formatEventDate(form1.eventDate)}
          </BodyText>
          
          <MaterialCommunityIcons 
            name="clock-outline" 
            size={16} 
            color={theme.colors.onSurfaceVariant}
            style={styles.icon}
          />
          <BodyText size="small">
            {getDaysUntilEvent(form1.eventDate)}
          </BodyText>
        </View>

        {/* Venue */}
        <View style={styles.detailsRow}>
            <MaterialCommunityIcons 
              name="map-marker" 
              size={16} 
              color={theme.colors.onSurfaceVariant}
              style={styles.icon}
            />
            <BodyText size="small" numberOfLines={1} style={{ flex: 1 }}>
              {venue}
            </BodyText>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <LabelText size="small" style={{ opacity: 0.7 }}>
            Questionnaire Progress
          </LabelText>
          <View style={styles.progressBarWrapper}>
            <View style={[styles.progressBarBackground, {backgroundColor: theme.colors.outline}]}>
              <View style={{
                width: `${getProgressPercentage()}%`,
                height: '100%',
                backgroundColor: theme.colors.primary,
                borderRadius: 2,
              }} />
            </View>
            <LabelText size="small">
              {getProgressPercentage()}%
            </LabelText>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: spacing.sm,
        marginHorizontal: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    headerTextContainer: {
        flex: 1,
        marginRight: spacing.sm,
    },
    chipsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        margin: 0,
        marginLeft: spacing.xs,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    icon: {
        marginRight: spacing.xs,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    progressBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBackground: {
        width: 80,
        height: 6,
        borderRadius: 3,
        marginRight: spacing.sm,
    },
});

export default ProjectCard;

// // In GEM4/components/cards/ProjectCard.tsx

// import React from 'react';
// import { StyleSheet, TouchableOpacity } from 'react-native';
// import { convertFirestoreTimestamp } from '../../services/utils/timestampHelpers';
// import { Project } from '../../types/project';
// import { BodyText, TitleText } from '../ui/Typography';


// interface ProjectCardProps {
//   project: Project;
//   onPress: () => void;
// }

// const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
//   const { form1 } = project;
//   const { projectName, eventDate, personA, personB } = form1;

//   // No longer need to call .toDate() as eventDate is now a Date object
//   // Use a utility or built-in method to format the date string
//   const formattedDate = eventDate ? convertFirestoreTimestamp(eventDate).toLocaleDateString() : 'No date';

//   return (
//     <TouchableOpacity onPress={onPress} style={styles.card}>
//       <TitleText size="large" style={styles.title}>{projectName}</TitleText>
//       <BodyText style={styles.date}>{formattedDate}</BodyText>
//       <BodyText style={styles.names}>{`${personA.firstName} & ${personB.firstName}`}</BodyText>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({  
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   title: {
//     marginBottom: 8,
//     color: 'black'
//   },
//   date: {
//     marginBottom: 4,
//     color: 'black'
//   },
//   names: {
//     color: 'black'
//   },
// });

// export default ProjectCard;

// // import { MaterialCommunityIcons } from '@expo/vector-icons';
// // import { differenceInDays, format } from 'date-fns';
// // import { Timestamp } from 'firebase/firestore';
// // import React from 'react';
// // import { StyleSheet, View, ViewStyle } from 'react-native';
// // import { Card, Chip, IconButton } from 'react-native-paper';
// // import { spacing, useAppTheme } from '../../constants/theme';
// // import { ProjectStatus } from '../../types/enum';
// // import { Project } from '../../types/project';
// // import { BodyText, LabelText, TitleText } from '../ui/Typography';
// //   import { formatDate } from '../../services/utils/dateHelpers';

// // interface ProjectCardProps {
// //   project: Project;
// //   onPress: () => void;
// //   onDelete?: () => void;
// //   style?: ViewStyle;
// //   isActive?: boolean;
// // }

// // export const ProjectCard: React.FC<ProjectCardProps> = ({
// //   project,
// //   onPress,
// //   onDelete,
// //   style,
// //   isActive = false,
// // }) => {
// //   const theme = useAppTheme();

// //   const getStatusColor = (status: ProjectStatus | undefined) => {
// //     switch (status) {
// //       case ProjectStatus.ACTIVE:
// //         return theme.colors.primary;
// //       case ProjectStatus.COMPLETED:
// //         return theme.colors.secondary;
// //       case ProjectStatus.DRAFT:
// //         return theme.colors.tertiary;
// //       case ProjectStatus.CANCELLED:
// //         return theme.colors.error;
// //       default:
// //         return theme.colors.outline;
// //     }
// //   };

// //   const getProgressPercentage = () => {
// //     let completed = 1;
// //     const total = 4;
    
// //     if (project.form2.events && project.form2.events.length > 0) completed++;
// //     if (project.form3.immediateFamily && project.form3.immediateFamily.length > 0) completed++;
// //     if (project.form4.groupShots && project.form4.groupShots.length > 0) completed++;

// //     return Math.round((completed / total) * 100);
// //   };

// //   const formatEventDate = (date: Date | undefined) => {
// //     if (!date) return 'No date set';
// //     return formatDate(date);
// //   };

// //   // const formatEventDate = (date: Timestamp | undefined) => {
// //   //   if (!date) return 'No date set';
// //   //   try {
// //   //     return format(date.toDate(), 'MMM dd, yyyy');
// //   //   } catch {
// //   //     return 'Invalid date';
// //   //   }
// //   // };

// //   const getDaysUntilEvent = (eventDate: Timestamp | undefined) => {
// //     if (!eventDate) return 'N/A';
    
// //     const now = new Date();
// //     const date = eventDate.toDate();
// //     const diffDays = differenceInDays(date, now);
    
// //     if (diffDays < 0) return 'Event passed';
// //     if (diffDays === 0) return 'Today';
// //     if (diffDays === 1) return 'Tomorrow';
// //     return `${diffDays} days left`;
// //   };

// //   const cardStyle: ViewStyle[] = [styles.card, style || {}];
// //   if (isActive) {
// //     cardStyle.push({
// //       borderColor: theme.colors.primary,
// //       borderWidth: 2,
// //     });
// //   }
  
// //   const { form1 } = project;
// //   const clientName = `${form1.personA.firstName} & ${form1.personB.firstName}`;
// //   const venue = form1.locations && form1.locations.length > 0 ? form1.locations[0].locationAddress : 'No venue listed';

// //   return (
// //     <Card style={cardStyle} onPress={onPress}>
// //       <Card.Content>
// //         {/* Header */}
// //         <View style={styles.header}>
// //           <View style={styles.headerTextContainer}>
// //             <TitleText size="large" numberOfLines={1}>
// //               {form1.projectName}
// //             </TitleText>
// //             <BodyText size="medium" style={{ opacity: 0.7, marginTop: spacing.xs }}>
// //               {clientName}
// //             </BodyText>
// //           </View>
          
// //           <View style={styles.chipsContainer}>
// //             <Chip
// //               style={{ backgroundColor: getStatusColor(form1.projectStatus) + '20' }}
// //               textStyle={{ color: getStatusColor(form1.projectStatus), fontSize: 12 }}
// //             >
// //               {form1.projectStatus?.toUpperCase()}
// //             </Chip>
            
// //             {onDelete && (
// //               <IconButton
// //                 icon="delete"
// //                 size={20}
// //                 onPress={onDelete}
// //                 style={styles.deleteButton}
// //               />
// //             )}
// //           </View>
// //         </View>

// //         {/* Event Details */}
// //         <View style={styles.detailsRow}>
// //           <MaterialCommunityIcons 
// //             name="calendar" 
// //             size={16} 
// //             color={theme.colors.onSurfaceVariant}
// //             style={styles.icon}
// //           />
// //           <BodyText size="small" style={{ marginRight: spacing.md }}>
// //             {formatEventDate(form1.eventDate)}
// //           </BodyText>
          
// //           <MaterialCommunityIcons 
// //             name="clock-outline" 
// //             size={16} 
// //             color={theme.colors.onSurfaceVariant}
// //             style={styles.icon}
// //           />
// //           <BodyText size="small">
// //             {getDaysUntilEvent(form1.eventDate)}
// //           </BodyText>
// //         </View>

// //         {/* Venue */}
// //         <View style={styles.detailsRow}>
// //             <MaterialCommunityIcons 
// //               name="map-marker" 
// //               size={16} 
// //               color={theme.colors.onSurfaceVariant}
// //               style={styles.icon}
// //             />
// //             <BodyText size="small" numberOfLines={1} style={{ flex: 1 }}>
// //               {venue}
// //             </BodyText>
// //         </View>

// //         {/* Progress */}
// //         <View style={styles.progressContainer}>
// //           <LabelText size="small" style={{ opacity: 0.7 }}>
// //             Questionnaire Progress
// //           </LabelText>
// //           <View style={styles.progressBarWrapper}>
// //             <View style={[styles.progressBarBackground, {backgroundColor: theme.colors.outline}]}>
// //               <View style={{
// //                 width: `${getProgressPercentage()}%`,
// //                 height: '100%',
// //                 backgroundColor: theme.colors.primary,
// //                 borderRadius: 2,
// //               }} />
// //             </View>
// //             <LabelText size="small">
// //               {getProgressPercentage()}%
// //             </LabelText>
// //           </View>
// //         </View>
// //       </Card.Content>
// //     </Card>
// //   );
// // };

// // const styles = StyleSheet.create({
// //     card: {
// //         marginVertical: spacing.sm,
// //         marginHorizontal: spacing.md,
// //     },
// //     header: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'flex-start',
// //         marginBottom: spacing.sm,
// //     },
// //     headerTextContainer: {
// //         flex: 1,
// //         marginRight: spacing.sm,
// //     },
// //     chipsContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     deleteButton: {
// //         margin: 0,
// //         marginLeft: spacing.xs,
// //     },
// //     detailsRow: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginBottom: spacing.sm,
// //     },
// //     icon: {
// //         marginRight: spacing.xs,
// //     },
// //     progressContainer: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         marginTop: spacing.sm,
// //     },
// //     progressBarWrapper: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     progressBarBackground: {
// //         width: 80,
// //         height: 6,
// //         borderRadius: 3,
// //         marginRight: spacing.sm,
// //     },
// // });


// // // import { MaterialCommunityIcons } from '@expo/vector-icons';
// // // import { format, differenceInDays } from 'date-fns';
// // // import { Timestamp } from 'firebase/firestore';
// // // import React from 'react';
// // // import { StyleSheet, View, ViewStyle } from 'react-native';
// // // import { Card, Chip, IconButton } from 'react-native-paper';
// // // import { spacing, useAppTheme } from '../../constants/theme';
// // // import { ProjectStatus } from '../../types/enum';
// // // import { Project } from '../../types/project'; // **FIXED**: Use the correct Project type
// // // import { BodyText, LabelText, TitleText } from '../ui/Typography';

// // // interface ProjectCardProps {
// // //   project: Project; // **FIXED**: Updated to the main Project type
// // //   onPress: () => void;
// // //   onDelete?: () => void;
// // //   style?: ViewStyle;
// // //   isActive?: boolean;
// // // }

// // // export const ProjectCard: React.FC<ProjectCardProps> = ({
// // //   project,
// // //   onPress,
// // //   onDelete,
// // //   style,
// // //   isActive = false,
// // // }) => {
// // //   const theme = useAppTheme();

// // //   const getStatusColor = (status: ProjectStatus) => {
// // //     switch (status) {
// // //       case ProjectStatus.ACTIVE:
// // //         return theme.colors.primary;
// // //       case ProjectStatus.COMPLETED:
// // //         return theme.colors.secondary;
// // //       case ProjectStatus.DRAFT:
// // //         return theme.colors.tertiary;
// // //       case ProjectStatus.CANCELLED:
// // //         return theme.colors.error;
// // //       default:
// // //         return theme.colors.outline;
// // //     }
// // //   };

// // //   // **FIXED**: Calculate progress based on whether forms have content
// // //   const getProgressPercentage = () => {
// // //     let completed = 1; // form1 is always considered complete if the project exists
// // //     const total = 4;
    
// // //     if (project.form2.events && project.form2.events.length > 0) completed++;
// // //     if (project.form3.immediateFamily && project.form3.immediateFamily.length > 0) completed++;
// // //     if (project.form4.groupShots && project.form4.groupShots.length > 0) completed++;

// // //     return Math.round((completed / total) * 100);
// // //   };

// // //   // **FIXED**: Handle optional Firestore Timestamp
// // //   const formatEventDate = (date: Timestamp | undefined) => {
// // //     if (!date) return 'No date set';
// // //     try {
// // //       return format(date.toDate(), 'MMM dd, yyyy');
// // //     } catch {
// // //       return 'Invalid date';
// // //     }
// // //   };

// // //     // **FIXED**: Calculate days remaining from the event date
// // //   const getDaysUntilEvent = (eventDate: Timestamp | undefined) => {
// // //     if (!eventDate) return 'N/A';
    
// // //     const now = new Date();
// // //     const date = eventDate.toDate();
// // //     const diffDays = differenceInDays(date, now);
    
// // //     if (diffDays < 0) return 'Event passed';
// // //     if (diffDays === 0) return 'Today';
// // //     if (diffDays === 1) return 'Tomorrow';
// // //     return `${diffDays} days left`;
// // //   };

// // //   const cardStyle: ViewStyle[] = [styles.card, style || {}];
// // //   if (isActive) {
// // //     cardStyle.push({
// // //       borderColor: theme.colors.primary,
// // //       borderWidth: 2,
// // //     });
// // //   }
  
// // //   // **FIXED**: Access all data from the nested form objects
// // //   const { form1 } = project;
// // //   const clientName = `${form1.personA.firstName} & ${form1.personB.firstName}`;
// // //   const venue = form1.locations && form1.locations.length > 0 ? form1.locations[0].locationAddress : 'No venue listed';

// // //   return (
// // //     <Card style={cardStyle} onPress={onPress}>
// // //       <Card.Content>
// // //         {/* Header */}
// // //         <View style={styles.header}>
// // //           <View style={styles.headerTextContainer}>
// // //             <TitleText size="large" numberOfLines={1}>
// // //               {form1.name}
// // //             </TitleText>
// // //             <BodyText size="medium" style={{ opacity: 0.7, marginTop: spacing.xs }}>
// // //               {clientName}
// // //             </BodyText>
// // //           </View>
          
// // //           <View style={styles.chipsContainer}>
// // //             <Chip
// // //               style={{ backgroundColor: getStatusColor(form1.status!) + '20' }}
// // //               textStyle={{ color: getStatusColor(form1.status!), fontSize: 12 }}
// // //             >
// // //               {form1.status?.toUpperCase()}
// // //             </Chip>
            
// // //             {onDelete && (
// // //               <IconButton
// // //                 icon="delete"
// // //                 size={20}
// // //                 onPress={onDelete}
// // //                 style={styles.deleteButton}
// // //               />
// // //             )}
// // //           </View>
// // //         </View>

// // //         {/* Event Details */}
// // //         <View style={styles.detailsRow}>
// // //           <MaterialCommunityIcons 
// // //             name="calendar" 
// // //             size={16} 
// // //             color={theme.colors.onSurfaceVariant}
// // //             style={styles.icon}
// // //           />
// // //           <BodyText size="small" style={{ marginRight: spacing.md }}>
// // //             {formatEventDate(form1.eventDate)}
// // //           </BodyText>
          
// // //           <MaterialCommunityIcons 
// // //             name="clock-outline" 
// // //             size={16} 
// // //             color={theme.colors.onSurfaceVariant}
// // //             style={styles.icon}
// // //           />
// // //           <BodyText size="small">
// // //             {getDaysUntilEvent(form1.eventDate)}
// // //           </BodyText>
// // //         </View>

// // //         {/* Venue */}
// // //         <View style={styles.detailsRow}>
// // //             <MaterialCommunityIcons 
// // //               name="map-marker" 
// // //               size={16} 
// // //               color={theme.colors.onSurfaceVariant}
// // //               style={styles.icon}
// // //             />
// // //             <BodyText size="small" numberOfLines={1} style={{ flex: 1 }}>
// // //               {venue}
// // //             </BodyText>
// // //         </View>

// // //         {/* Progress */}
// // //         <View style={styles.progressContainer}>
// // //           <LabelText size="small" style={{ opacity: 0.7 }}>
// // //             Questionnaire Progress
// // //           </LabelText>
// // //           <View style={styles.progressBarWrapper}>
// // //             <View style={[styles.progressBarBackground, {backgroundColor: theme.colors.outline}]}>
// // //               <View style={{
// // //                 width: `${getProgressPercentage()}%`,
// // //                 height: '100%',
// // //                 backgroundColor: theme.colors.primary,
// // //                 borderRadius: 2,
// // //               }} />
// // //             </View>
// // //             <LabelText size="small">
// // //               {getProgressPercentage()}%
// // //             </LabelText>
// // //           </View>
// // //         </View>
// // //       </Card.Content>
// // //     </Card>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //     card: {
// // //         marginVertical: spacing.sm,
// // //         marginHorizontal: spacing.md,
// // //     },
// // //     header: {
// // //         flexDirection: 'row',
// // //         justifyContent: 'space-between',
// // //         alignItems: 'flex-start',
// // //         marginBottom: spacing.sm,
// // //     },
// // //     headerTextContainer: {
// // //         flex: 1,
// // //         marginRight: spacing.sm,
// // //     },
// // //     chipsContainer: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //     },
// // //     deleteButton: {
// // //         margin: 0,
// // //         marginLeft: spacing.xs,
// // //     },
// // //     detailsRow: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         marginBottom: spacing.sm,
// // //     },
// // //     icon: {
// // //         marginRight: spacing.xs,
// // //     },
// // //     progressContainer: {
// // //         flexDirection: 'row',
// // //         justifyContent: 'space-between',
// // //         alignItems: 'center',
// // //         marginTop: spacing.sm,
// // //     },
// // //     progressBarWrapper: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //     },
// // //     progressBarBackground: {
// // //         width: 80,
// // //         height: 6,
// // //         borderRadius: 3,
// // //         marginRight: spacing.sm,
// // //     },
// // // });


// // // // // src/components/cards/ProjectCard.tsx
// // // // import { MaterialCommunityIcons } from '@expo/vector-icons';
// // // // import { format } from 'date-fns';
// // // // import React from 'react';
// // // // import { View, ViewStyle } from 'react-native';
// // // // import { Card, Chip, IconButton } from 'react-native-paper';
// // // // import { spacing, useAppTheme } from '../../constants/theme';
// // // // import { ProjectStatus, ProjectWithProgress } from '../../types/project';
// // // // import { BodyText, LabelText, TitleText } from '../ui/Typography';

// // // // interface ProjectCardProps {
// // // //   project: ProjectWithProgress;
// // // //   onPress: () => void;
// // // //   onDelete?: () => void;
// // // //   style?: ViewStyle;
// // // //   isActive?: boolean;
// // // // }

// // // // export const ProjectCard: React.FC<ProjectCardProps> = ({
// // // //   project,
// // // //   onPress,
// // // //   onDelete,
// // // //   style,
// // // //   isActive = false,
// // // // }) => {
// // // //   const theme = useAppTheme();

// // // //   const getStatusColor = (status: ProjectStatus) => {
// // // //     switch (status) {
// // // //       case ProjectStatus.ACTIVE:
// // // //         return theme.colors.primary;
// // // //       case ProjectStatus.COMPLETED:
// // // //         return theme.colors.secondary;
// // // //       case ProjectStatus.DRAFT:
// // // //         return theme.colors.tertiary;
// // // //       case ProjectStatus.CANCELLED:
// // // //         return theme.colors.error;
// // // //       default:
// // // //         return theme.colors.outline;
// // // //     }
// // // //   };

// // // //   const getProgressPercentage = () => {
// // // //     if (!project.questionnaireProgress) return 0;
    
// // // //     const sections = Object.values(project.questionnaireProgress);
// // // //     const completed = sections.filter(Boolean).length;
// // // //     return Math.round((completed / sections.length) * 100);
// // // //   };

// // // //   const formatEventDate = (date: Date) => {
// // // //     try {
// // // //       return format(date, 'MMM dd, yyyy');
// // // //     } catch {
// // // //       return 'Invalid date';
// // // //     }
// // // //   };

// // // //   const getDaysUntilEvent = () => {
// // // //     // const now = new Date();
// // // //     // const eventDate = project.eventDate.toDate();
// // // //     // const diffTime = eventDate.getTime() - now.getTime();
// // // //     // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
// // // //     // if (diffDays < 0) return 'Past event';
// // // //     // if (diffDays === 0) return 'Today';
// // // //     // if (diffDays === 1) return 'Tomorrow';
// // // //     // return `${diffDays} days`;
// // // //     return '10 days';
// // // //   };

// // // //   const cardStyle: ViewStyle[] = [style || {}];
// // // //   if (isActive) {
// // // //     cardStyle.push({
// // // //       borderColor: theme.colors.primary,
// // // //       borderWidth: 2,
// // // //       backgroundColor: theme.colors.primaryContainer,
// // // //     });
// // // //   }

// // // //   return (
// // // //     <Card style={cardStyle} onPress={onPress}>
// // // //       <Card.Content>
// // // //         {/* Header */}
// // // //         <View style={{ 
// // // //           flexDirection: 'row', 
// // // //           justifyContent: 'space-between', 
// // // //           alignItems: 'flex-start',
// // // //           marginBottom: spacing.sm 
// // // //         }}>
// // // //           <View style={{ flex: 1, marginRight: spacing.sm }}>
// // // //             <TitleText size="large" numberOfLines={1}>
// // // //               {project.projectName}
// // // //             </TitleText>
// // // //             <BodyText size="medium" style={{ opacity: 0.7, marginTop: spacing.xs }}>
// // // //               {project.clientName}
// // // //             </BodyText>
// // // //           </View>
          
// // // //           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
// // // //             <Chip
// // // //               style={{ 
// // // //                 backgroundColor: getStatusColor(project.projectStatus) + '20',
// // // //                 marginRight: spacing.xs 
// // // //               }}
// // // //               textStyle={{ 
// // // //                 color: getStatusColor(project.projectStatus),
// // // //                 fontSize: 12 
// // // //               }}
// // // //             >
// // // //               {project.projectStatus.toUpperCase()}
// // // //             </Chip>
            
// // // //             {onDelete && (
// // // //               <IconButton
// // // //                 icon="delete"
// // // //                 size={20}
// // // //                 onPress={onDelete}
// // // //                 style={{ margin: 0 }}
// // // //               />
// // // //             )}
// // // //           </View>
// // // //         </View>

// // // //         {/* Event Details */}
// // // //         <View style={{ 
// // // //           flexDirection: 'row', 
// // // //           alignItems: 'center', 
// // // //           marginBottom: spacing.sm 
// // // //         }}>
// // // //           <MaterialCommunityIcons 
// // // //             name="calendar" 
// // // //             size={16} 
// // // //             color={theme.colors.onSurfaceVariant}
// // // //             style={{ marginRight: spacing.xs }}
// // // //           />
// // // //           <BodyText size="small" style={{ marginRight: spacing.md }}>
// // // //             {project.projectStatus}
// // // //             {/* {formatEventDate(project.eventDate.toDate())} */}
// // // //           </BodyText>
          
// // // //           <MaterialCommunityIcons 
// // // //             name="clock" 
// // // //             size={16} 
// // // //             color={theme.colors.onSurfaceVariant}
// // // //             style={{ marginRight: spacing.xs }}
// // // //           />
// // // //           <BodyText size="small">
// // // //             {getDaysUntilEvent()}
// // // //           </BodyText>
// // // //         </View>

// // // //         {/* Venue */}
// // // //         {project.venue && (
// // // //           <View style={{ 
// // // //             flexDirection: 'row', 
// // // //             alignItems: 'center', 
// // // //             marginBottom: spacing.sm 
// // // //           }}>
// // // //             <MaterialCommunityIcons 
// // // //               name="map-marker" 
// // // //               size={16} 
// // // //               color={theme.colors.onSurfaceVariant}
// // // //               style={{ marginRight: spacing.xs }}
// // // //             />
// // // //             <BodyText size="small" numberOfLines={1} style={{ flex: 1 }}>
// // // //               {project.venue}
// // // //             </BodyText>
// // // //           </View>
// // // //         )}

// // // //         {/* Progress */}
// // // //         <View style={{ 
// // // //           flexDirection: 'row', 
// // // //           justifyContent: 'space-between', 
// // // //           alignItems: 'center' 
// // // //         }}>
// // // //           <LabelText size="small" style={{ opacity: 0.7 }}>
// // // //             Questionnaire Progress
// // // //           </LabelText>
// // // //           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
// // // //             <View style={{
// // // //               width: 60,
// // // //               height: 4,
// // // //               backgroundColor: theme.colors.outline,
// // // //               borderRadius: 2,
// // // //               marginRight: spacing.xs,
// // // //             }}>
// // // //               <View style={{
// // // //                 width: `${getProgressPercentage()}%`,
// // // //                 height: '100%',
// // // //                 backgroundColor: theme.colors.primary,
// // // //                 borderRadius: 2,
// // // //               }} />
// // // //             </View>
// // // //             <LabelText size="small">
// // // //               {getProgressPercentage()}%
// // // //             </LabelText>
// // // //           </View>
// // // //         </View>
// // // //       </Card.Content>
// // // //     </Card>
// // // //   );
// // // // };