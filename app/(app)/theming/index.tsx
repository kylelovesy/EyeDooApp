import { Switch, View } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Banner,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  Divider,
  IconButton,
  List,
  Modal,
  Portal,
  ProgressBar,
  RadioButton,
  Snackbar,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper';

import React from 'react';
import { Screen } from '../../../components/ui/Screen';
import { commonStyles } from '../../../constants/styles';
import { typography } from '../../../constants/typography';
import { useThemeContext } from '../../../contexts/ThemeContext';

// import TimelineListItem from '../../../components/cards/TimelineListItemCard';

// import { Timestamp } from 'firebase/firestore';
import { TimelineEventForm } from '../../../components/timeline/TimelineEventForm';
// import { EventType } from '../../../constants/eventTypes';
import { TimelineProvider } from '../../../contexts/TimelineContext';

export default function ThemingTestScreen() {
  const theme = useTheme();
  const { toggleTheme, isDarkMode } = useThemeContext();
  const [showDialog, setShowDialog] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(true);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [showTimelineForm, setShowTimelineForm] = React.useState(false);
  // const [showTimelineCard, setShowTimelineCard] = React.useState(false);


  return (
    <Screen scrollable padding="lg" edges={['bottom', 'left', 'right']}>
       {/* Component Preview Section */}
       <View style={[commonStyles.marginBottomLg, { gap: 8 }]}>
        <Text variant="titleLarge">Component Previews</Text>
        <View style={[commonStyles.rowCenter, { gap: 8 }]}>
          <Button 
            mode="outlined" 
            onPress={() => setShowTimelineForm(true)}
            icon="plus"
          >
            Timeline Form
          </Button>
          {/* <Button 
            mode="outlined" 
            onPress={() => setShowTimelineCard(true)}
            icon="view-list"
          >
            Timeline Cards
          </Button> */}
        </View>
      </View>

      <Divider style={commonStyles.marginBottomLg} />
      <View style={commonStyles.rowBetween}>
        <Text variant="headlineSmall">Theming & Components</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
      <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
        Use this screen to test theme colors, fonts, and component styling.
      </Text>

      <Divider style={commonStyles.marginBottomLg} />

      {/* Typography Section */}
      <View style={commonStyles.marginBottomLg}>
        <Text variant="titleLarge" style={commonStyles.marginBottomMd}>
          Typography
        </Text>
        {Object.keys(typography).map((key) => {
          const variant = typography[key as keyof typeof typography];
          const fontFileName = `${variant.fontFamily}.ttf`;
          return (
            <View key={key} style={[commonStyles.rowBetween, { marginBottom: 8 }]}>
              <Text style={variant}>{key}</Text>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontFamily: 'monospace' }}>
                {fontFileName}
              </Text>
            </View>
          );
        })}
      </View>

      <Divider style={commonStyles.marginBottomLg} />

      {/* Components Section */}
      <View style={{ gap: 16 }}>
        <Text variant="titleLarge">Components</Text>

        {/* Buttons */}
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Buttons</Text>
          <Button mode="contained">Contained (Primary)</Button>
          <Button mode="contained" buttonColor={theme.colors.secondary}>Contained (Secondary)</Button>
          <Button mode="contained" disabled>Contained Disabled</Button>
          <Button mode="outlined">Outlined</Button>
          <Button mode="text">Text</Button>
          <Button mode="elevated">Elevated</Button>
          <Button mode="contained-tonal">Contained Tonal</Button>
        </View>

        {/* Cards */}
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Cards</Text>
          <Card>
            <Card.Title title="Default Card"/>
            <Card.Content><Text>Uses surface color</Text></Card.Content>
          </Card>
          <Card mode="elevated">
            <Card.Title title="Elevated Card"/>
            <Card.Content><Text>More pronounced shadow</Text></Card.Content>
          </Card>
          <Card mode="outlined">
            <Card.Title title="Outlined Card"/>
            <Card.Content><Text>Border instead of shadow</Text></Card.Content>
          </Card>
        </View>
        
        {/* Inputs */}
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Text Inputs</Text>
          <TextInput label="Outlined Input" placeholder="Placeholder text" />
          <TextInput label="Flat Input" mode="flat" />
          <TextInput label="Outlined Disabled" disabled />
          <TextInput label="Outlined With Error" error />
        </View>

         {/* Chips */}
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Chips</Text>
          <View style={commonStyles.rowCenter}>
            <Chip icon="information" selected>Selected</Chip>
            <Chip icon="heart" style={{ marginLeft: 8 }}>Not Selected</Chip>
            <Chip icon="close" onClose={() => {}} style={{ marginLeft: 8 }}>Closable</Chip>
            <Chip disabled style={{ marginLeft: 8 }}>Disabled</Chip>
          </View>
        </View>

        {/* Selection */}
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Selection Controls</Text>
          <View style={commonStyles.rowCenter}><Checkbox status="checked" /><Text>Checked</Text></View>
          <View style={commonStyles.rowCenter}><Checkbox status="unchecked" /><Text>Unchecked</Text></View>
          <View style={commonStyles.rowCenter}><Checkbox status="indeterminate" /><Text>Indeterminate</Text></View>
          <RadioButton.Group value="first" onValueChange={() => {}}>
            <View style={commonStyles.rowCenter}><RadioButton value="first" /><Text>Radio 1</Text></View>
            <View style={commonStyles.rowCenter}><RadioButton value="second" /><Text>Radio 2</Text></View>
          </RadioButton.Group>
        </View>

        {/* Progress Indicators */}
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Progress</Text>
          <ProgressBar progress={0.5} />
          <ProgressBar progress={0.7} color={theme.colors.secondary} />
          <ActivityIndicator animating={true} />
          <ActivityIndicator animating={true} color={theme.colors.tertiary} />
        </View>

        {/* Lists */}
        <List.Section>
          <List.Subheader>Lists</List.Subheader>
          <List.Item
            title="First Item"
            description="Item description"
            left={props => <List.Icon {...props} icon="folder" />}
          />
          <List.Item
            title="Second Item"
            description="Another item"
            left={props => <List.Icon {...props} icon="album" />}
            right={props => <IconButton {...props} icon="dots-vertical" onPress={() => {}}/>}
          />
        </List.Section>

        {/* Overlays */}
        <View style={{ gap: 8 }}>
          <Text variant="titleMedium">Overlays</Text>
          <Button mode="outlined" onPress={() => setShowDialog(true)}>Show Dialog</Button>
          <Button mode="outlined" onPress={() => setShowModal(true)}>Show Modal</Button>
          <Button mode="outlined" onPress={() => setShowSnackbar(val => !val)}>Toggle Snackbar</Button>
        </View>

      </View>

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">This is a dialog.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
        <Modal visible={showModal} onDismiss={() => setShowModal(false)} contentContainerStyle={{backgroundColor: theme.colors.surface, padding: 20, margin: 20}}>
          <Text>Example Modal</Text>
        </Modal>

        {/* Timeline Form Preview Modal */}
        <Modal 
          visible={showTimelineForm} 
          onDismiss={() => setShowTimelineForm(false)} 
          contentContainerStyle={{
            backgroundColor: theme.colors.surface, 
            margin: 20,
            borderRadius: 8,
            maxHeight: '85%'
          }}
        >
          {/* <TimelineEventForm
            projectDate={new Date(2024, 5, 15, 12, 0)}
            onSubmit={handleTimelineFormSubmit}
            onCancel={() => setShowTimelineForm(false)}
          /> */}
            <TimelineProvider>
            <TimelineEventForm
              projectDate={new Date()}
              onSubmit={(event) => console.log('Event created:', event)}
              onCancel={() => console.log('Cancelled')}
            />
          </TimelineProvider>
        </Modal>

        {/* Timeline Cards Preview Modal */}
        {/* <Modal 
          visible={showTimelineCard} 
          onDismiss={() => setShowTimelineCard(false)} 
          contentContainerStyle={{
            backgroundColor: theme.colors.surface, 
            margin: 20,
            borderRadius: 8,
            maxHeight: '80%'
          }}
        >
          <View style={{ padding: 16 }}>
            <Text variant="headlineSmall" style={{ marginBottom: 16 }}>Timeline Cards Preview</Text>
            {dummyTimelineEvents.map((event, index) => (
              <TimelineListItem
                key={event.eventId}
                item={event}
                isFirst={index === 0}
                isLast={index === dummyTimelineEvents.length - 1}
              />
            ))}
            <Button 
              mode="contained" 
              onPress={() => setShowTimelineCard(false)}
              style={{ marginTop: 16 }}
            >
              Close
            </Button>
          </View>
        </Modal> */}
      </Portal>
      
      <Banner
        visible={showBanner}
        actions={[
          {
            label: 'Fix it',
            onPress: () => setShowBanner(false),
          },
          {
            label: 'Learn more',
            onPress: () => setShowBanner(false),
          },
        ]}
        icon={({size}) => (
          <Avatar.Icon size={size} icon="information" />
        )}>
        There was a problem with your request.
      </Banner>
      
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: 'Undo',
          onPress: () => {},
        }}>
        Timeline Event Form submitted successfully!
      </Snackbar>

    </Screen>
  );
} 