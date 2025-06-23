// constants/styles.ts
import { StyleSheet } from 'react-native';
import { borderRadius, elevation, spacing } from './theme';

/**
 * Reusable style definitions for consistent UI across the EyeDooApp
 * These styles are theme-agnostic and should be combined with theme colors
 * when used in components for proper light/dark mode support
 */
export const commonStyles = StyleSheet.create({
  // ===================
  // LAYOUT CONTAINERS
  // ===================
  
  /** Main app container - full screen flex layout */
  container: {
    flex: 1,
  },
  
  /** Content wrapper with standard padding */
  content: {
    flex: 1,
    padding: spacing.md,
  },
  
  /** Content wrapper with large padding for forms and important content */
  contentLarge: {
    flex: 1,
    padding: spacing.lg,
  },
  
  /** Centered content container for loading states, empty states, etc. */
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /** Loading container with centered spinner */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  // ===================
  // FORM LAYOUTS
  // ===================
  
  /** Form container with consistent spacing between elements */
  form: {
    gap: spacing.md,
  },
  
  /** Form container with large spacing for important forms */
  formLarge: {
    gap: spacing.lg,
  },
  
  /** Input field with bottom margin for legacy layouts */
  input: {
    marginBottom: spacing.md,
  },
  
  /** Input field with large bottom margin */
  inputLarge: {
    marginBottom: spacing.lg,
  },

  // ===================
  // BUTTON LAYOUTS
  // ===================
  
  /** Horizontal button container with equal spacing */
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  
  /** Large horizontal button container */
  buttonContainerLarge: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  
  /** Individual button in a container that should take equal space */
  button: {
    flex: 1,
  },
  
  /** Vertical button stack */
  buttonStack: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  // ===================
  // CARD LAYOUTS
  // ===================
  
  /** Standard card with bottom margin and elevation */
  card: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    elevation: elevation.sm,
  },
  
  /** Large card with more spacing */
  cardLarge: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    elevation: elevation.md,
  },
  
  /** Card content padding */
  cardContent: {
    padding: spacing.md,
  },
  
  /** Large card content padding */
  cardContentLarge: {
    padding: spacing.lg,
  },

  // ===================
  // TEXT LAYOUTS
  // ===================
  
  /** Centered text alignment */
  textCenter: {
    textAlign: 'center',
  },
  
  /** Left text alignment */
  textLeft: {
    textAlign: 'left',
  },
  
  /** Right text alignment */
  textRight: {
    textAlign: 'right',
  },
  
  /** Page title with bottom margin and center alignment */
  title: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  
  /** Section title with bottom margin */
  sectionTitle: {
    marginBottom: spacing.md,
  },
  
  /** Placeholder text styling for empty states */
  placeholder: {
    textAlign: 'center',
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  
  /** Error text styling */
  errorText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  
  /** Helper text styling */
  helperText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },

  // ===================
  // LIST LAYOUTS
  // ===================
  
  /** List item with consistent padding */
  listItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  
  /** List item content with horizontal layout */
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  /** List item with card-like appearance */
  listItemCard: {
    margin: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    elevation: elevation.sm,
  },

  // ===================
  // SPACING UTILITIES
  // ===================
  
  /** Small margin top */
  marginTopSm: {
    marginTop: spacing.sm,
  },
  
  /** Medium margin top */
  marginTopMd: {
    marginTop: spacing.md,
  },
  
  /** Large margin top */
  marginTopLg: {
    marginTop: spacing.lg,
  },
  
  /** Small margin bottom */
  marginBottomSm: {
    marginBottom: spacing.sm,
  },
  
  /** Medium margin bottom */
  marginBottomMd: {
    marginBottom: spacing.md,
  },
  
  /** Large margin bottom */
  marginBottomLg: {
    marginBottom: spacing.lg,
  },
  
  /** Small padding */
  paddingSm: {
    padding: spacing.sm,
  },
  
  /** Medium padding */
  paddingMd: {
    padding: spacing.md,
  },
  
  /** Large padding */
  paddingLg: {
    padding: spacing.lg,
  },

  // ===================
  // FLEX UTILITIES
  // ===================
  
  /** Horizontal row layout */
  row: {
    flexDirection: 'row',
  },
  
  /** Horizontal row with center alignment */
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  /** Horizontal row with space between */
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  /** Horizontal row with center justification */
  rowCenterJustify: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /** Vertical column layout */
  column: {
    flexDirection: 'column',
  },
  
  /** Vertical column with center alignment */
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  // ===================
  // AUTH SPECIFIC STYLES
  // ===================
  
  /** Auth screen container with constrained width */
  authContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    // padding: spacing.md,
  },
  
  /** Auth form header section */
  authHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  
  /** Auth links container */
  authLinks: {
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  
  /** Auth divider with spacing */
  authDivider: {
    width: '100%',
    marginVertical: spacing.sm,
  },
  
  /** Auth signup row layout */
  authSignupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  // ===================
  // PROJECTS SPECIFIC STYLES
  // ===================
  
  /** Projects screen container with constrained width */
  projectsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    // padding: spacing.md,
  },

  /** Projects list header section */
  projectsListHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  projectsList: {
    flex: 1,
    justifyContent: 'flex-start',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: spacing.sm,
    width: '100%',
  },

  projectsFAB: {
    position: 'absolute',
    margin: spacing.md,
    right: spacing.md,
  },

  projectsSignoutBtn :{
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    zIndex: 1,
  },

  projectsFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    // borderTopWidth: 1,
    // borderTopColor: '#e0e0e0'
},


  
  /** Projects form header section */
  // projectsHeader: {
  //   alignItems: 'center',
  //   marginBottom: spacing.xxl,
  // },
  
  /** Projects links container */
  // projectsLinks: {
  //   alignItems: 'center',
  //   marginTop: spacing.lg,
  //   gap: spacing.md,
  // },
  
  /** Projects divider with spacing */
  // projectsDivider: {
  //   width: '100%',
  //   marginVertical: spacing.sm,
  // },
  

});


/**
 * Helper function to create theme-aware styles
 * Use this in your components to combine common styles with theme colors
 * 
 * @param theme - The current theme object from useAppTheme()
 * @returns StyleSheet with theme-aware colors applied
 */
export const createThemedStyles = (theme: any) => StyleSheet.create({
  // Container styles with theme colors
  container: {
    ...commonStyles.container,
    backgroundColor: theme.colors.background,
  },
  
  content: {
    ...commonStyles.content,
    backgroundColor: theme.colors.background,
  },
  
  // Card styles with theme colors
  card: {
    ...commonStyles.card,
    backgroundColor: theme.colors.surface,
  },
  
  cardLarge: {
    ...commonStyles.cardLarge,
    backgroundColor: theme.colors.surface,
  },
  
  // Text styles with theme colors
  title: {
    ...commonStyles.title,
    color: theme.colors.primary,
  },
  
  placeholder: {
    ...commonStyles.placeholder,
    color: theme.colors.onSurfaceVariant,
  },
  
  errorText: {
    ...commonStyles.errorText,
    color: theme.colors.error,
  },
  
  helperText: {
    ...commonStyles.helperText,
    color: theme.colors.onSurfaceVariant,
  },
  
  // List styles with theme colors
  listItem: {
    ...commonStyles.listItem,
    borderBottomColor: theme.colors.outline,
  },
  
  listItemCard: {
    ...commonStyles.listItemCard,
    backgroundColor: theme.colors.surface,
  },
  
  // Auth specific themed styles
  authDivider: {
    ...commonStyles.authDivider,
    backgroundColor: theme.colors.outline,
  },
  
  brandText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

/**
 * Usage example:
 * 
 * import { useAppTheme } from '../constants/theme';
 * import { commonStyles, createThemedStyles } from '../constants/styles';
 * 
 * const MyComponent = () => {
 *   const theme = useAppTheme();
 *   const themedStyles = createThemedStyles(theme);
 *   
 *   return (
 *     <View style={[commonStyles.container, themedStyles.container]}>
 *       <Text style={[commonStyles.textCenter, themedStyles.title]}>Hello</Text>
 *     </View>
 *   );
 * };
 */

// import { StyleSheet } from 'react-native';

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFBFE',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     marginBottom: 24,
//     textAlign: 'center',
//     color: '#6750A4',
//   },
//   card: {
//     marginBottom: 16,
//     elevation: 2,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 16,
//   },
//   button: {
//     flex: 1,
//   },
//   placeholder: {
//     textAlign: 'center',
//     marginTop: 16,
//     fontStyle: 'italic',
//     color: '#49454F',
//   },
//   form: {
//     gap: 16,
//   },
//   input: {
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#BA1A1A',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   brandText: {
//     color: '#6750A4',
//     fontWeight: 'bold',
//   },
// });