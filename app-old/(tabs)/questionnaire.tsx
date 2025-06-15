import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Screen } from '../../components/ui/Screen';
import { Typography } from '../../components/ui/Typography';

const QuestionnaireIndexScreen: React.FC = () => {
  const theme = useTheme();
  const { projectId } = useLocalSearchParams();

  if (!projectId) {
    return (
      <Screen style={styles.container}>
        <Typography variant="headlineSmall">No Project Selected</Typography>
        <Typography variant="bodyMedium">Please select a project to view its questionnaire.</Typography>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <Typography variant="headlineMedium" style={styles.title}>Questionnaire for Project {projectId}</Typography>
      
      <Link href={{ pathname: '/essential-info', params: { projectId } }} asChild>
        <Button mode="contained" style={styles.button}>
          Essential Information
        </Button>
      </Link>

      {/* Add links to other questionnaire sections as they are developed */}
      <Button mode="outlined" style={styles.button} disabled>
        Timeline Review (Coming Soon)
      </Button>
      <Button mode="outlined" style={styles.button} disabled>
        Key People & Roles (Coming Soon)
      </Button>
      <Button mode="outlined" style={styles.button} disabled>
        Photography Plan (Coming Soon)
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    marginBottom: 15,
  },
});

export default QuestionnaireIndexScreen;

// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Button, useTheme } from 'react-native-paper';
// import { Screen } from '../../src/components/ui/Screen';
// import { Typography } from '../../src/components/ui/Typography';
// import { Link, useLocalSearchParams } from 'expo-router';

// const QuestionnaireIndexScreen: React.FC = () => {
//   const theme = useTheme();
//   const { projectId } = useLocalSearchParams();

//   if (!projectId) {
//     return (
//       <Screen style={styles.container}>
//         <Typography variant="headlineSmall">No Project Selected</Typography>
//         <Typography variant="bodyMedium">Please select a project to view its questionnaire.</Typography>
//       </Screen>
//     );
//   }

//   return (
//     <Screen style={styles.container}>
//       <Typography variant="headlineMedium" style={styles.title}>Questionnaire for Project {projectId}</Typography>
      
//       <Link href={{ pathname: '/essential-info', params: { projectId } }} asChild>
//         <Button mode="contained" style={styles.button}>
//           Essential Information
//         </Button>
//       </Link>

//       <Link href={{ pathname: '/timeline-review', params: { projectId } }} asChild>
//         <Button mode="contained" style={styles.button}>
//           Timeline Review
//         </Button>
//       </Link>

//       <Link href={{ pathname: '/key-people', params: { projectId } }} asChild>
//         <Button mode="contained" style={styles.button}>
//           Key People & Roles
//         </Button>
//       </Link>

//       {/* Add links to other questionnaire sections as they are developed */}
//       <Button mode="outlined" style={styles.button} disabled>
//         Photography Plan (Coming Soon)
//       </Button>
//     </Screen>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   button: {
//     width: '80%',
//     marginBottom: 15,
//   },
// });

// export default QuestionnaireIndexScreen;