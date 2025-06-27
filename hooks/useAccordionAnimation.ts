import { useCallback, useState } from 'react';
import { Animated } from 'react-native';

export const useAccordionAnimation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [accordionAnimation] = useState(new Animated.Value(0));

  const toggleAccordion = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.timing(accordionAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, accordionAnimation]);

  return {
    isExpanded,
    accordionAnimation,
    toggleAccordion,
  };
};