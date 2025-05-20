/**
 * Ubix conductor
 *
 * @format
 * @flow
 */

// Dependencies
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/dist/Ionicons';

// Config
const ICON_COLOR = '#010203';
const ICON_SIZE = 22;

// Styles
const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    textAlign: 'center',
  },
});

// Props
type Props = {
  color: string,
  name: string,
  size: number,
};

// Icon
const Icon = ({ color = ICON_COLOR, name, size = ICON_SIZE }: Props) => {
  const iconSize = Platform.OS === 'ios' ? size + 2 : size;

  return (
    <Ionicon
      name={name}
      color={color}
      size={iconSize}
      style={[
        {
          height: iconSize,
          width: iconSize,
        },
        styles.icon,
      ]}
    />
  );
};

export default Icon;
