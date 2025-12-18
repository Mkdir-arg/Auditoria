import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../styles/theme';

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioButton({ label, selected, onPress }: RadioButtonProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.radio}>
        {selected && <View style={styles.radioSelected} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderRadius: 12,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: fontSize.base,
    color: colors.gray[700],
    flex: 1,
  },
});
