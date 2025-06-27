import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { getEventTypeDetails } from '../../constants/eventTypes';
import { TTimelineEvent } from '../../types/timeline';
import { BodyText, LabelText, TitleText } from '../ui/Typography';

interface TimelineListItemProps {
  item: TTimelineEvent;
  isFirst: boolean;
  isLast: boolean;
}

const TimelineListItem: React.FC<TimelineListItemProps> = ({ item, isFirst, isLast }) => {
  const eventDetails = getEventTypeDetails(item.eventType);

  if (!eventDetails) {
    return null; // Or a fallback view
  }

  const { Icon, displayName } = eventDetails;

  return (
    <View style={styles.container}>
      {/* The vertical line connector */}
      <View style={styles.lineConnector}>
        {!isFirst && <View style={styles.line} />}
        {!isLast && <View style={styles.line} />}
      </View>

      {/* The Icon */}
      <View style={styles.iconContainer}>
        <Icon width={32} height={32} />
      </View>

      {/* The Event Details Card */}
      <View style={styles.detailsContainer}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
          {item.notification !== 'None' && (
                <View style={styles.notificationContainer}>
                    <Ionicons name="notifications" size={16} color="#6200ee" />
                    {/* <LabelText size="small" style={styles.notificationText}>
                        {item.notification}
                    </LabelText> */}
                </View>
            )}
            <LabelText size="medium" style={styles.timeText}>
              {item.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </LabelText>
            <TitleText size="medium" style={styles.displayNameText}>{displayName}</TitleText>
            {item.description && <BodyText size="small">{item.description}</BodyText>}
            {item.location && (
                <View style={styles.locationContainer}>
                    {/* Replace with a proper location icon */}
                    <BodyText size="small" style={styles.locationText}>
                        <Ionicons name="location" size={16} color="black" />
                         {item.location}
                    </BodyText>
                </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        minHeight: 100,
    },
    lineConnector: {
        width: 2,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: '#e0e0e0',
    },
    iconContainer: {
        position: 'absolute',
        left: 6, // (16 padding - 20 icon width / 2) -ish
        top: 20,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 40, // Space for the icon and line
        paddingVertical: 8,
    },
    card: {
        flex: 1,
    },
    cardContent: {
        position: 'relative', // This allows absolute positioning within the card
    },
    notificationContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(98, 0, 238, 0.1)', // Light background for visibility
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        zIndex: 1, // Ensure it appears above other content
    },
    notificationText: {
        color: '#6200ee',
        marginLeft: 4,
        fontSize: 12,
    },
    timeText: {
        fontWeight: 'bold',
        color: '#6200ee', // Your theme's primary color
        marginBottom: 4,
    },
    displayNameText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    locationText: {
        color: '#666',
        marginLeft: 4,
    },
});

export default TimelineListItem;