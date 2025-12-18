import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../styles/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backgroundColor?: string;
  rightComponent?: React.ReactNode;
}

export function Header({ title, subtitle, onBack, backgroundColor = colors.white, rightComponent }: HeaderProps) {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <View style={styles.headerContent}>
        {onBack && (
          <TouchableOpacity onPress={onBack}>
            <Text style={[styles.backButton, backgroundColor !== colors.white && styles.backButtonLight]}>
              ← Volver
            </Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, backgroundColor !== colors.white && styles.headerTitleLight]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.headerSubtitle, backgroundColor !== colors.white && styles.headerSubtitleLight]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing['3xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  backButton: {
    color: colors.primary,
    fontSize: fontSize.base,
    marginBottom: spacing.sm,
  },
  backButtonLight: {
    color: colors.white,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  headerTitleLight: {
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  headerSubtitleLight: {
    color: '#e0e7ff',
  },
  rightComponent: {
    marginLeft: spacing.md,
  },
});
