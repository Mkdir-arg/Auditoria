import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

interface InputProps extends TextInputProps {
  error?: boolean;
}

export function Input({ error, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, error && styles.error]}
      placeholderTextColor={colors.gray[400]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.base,
    backgroundColor: colors.white,
    color: colors.gray[900],
  },
  error: {
    borderColor: colors.danger,
  },
});
