// components/InputAccessoryBar.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { BASE_COLORS, MOOD_COLORS } from '../constants/colors'; // Assuming colors are defined here

interface InputAccessoryBarProps {
  onGoDeeper: () => void;
  onFinishEntry: () => void;
  goDeeperLabel?: string;
  finishEntryLabel?: string;
  goDeeperDisabled?: boolean;
  finishEntryDisabled?: boolean;
}

const InputAccessoryBar: React.FC<InputAccessoryBarProps> = ({
  onGoDeeper,
  onFinishEntry,
  goDeeperLabel = "Go deeper",
  finishEntryLabel = "Finish entry",
  goDeeperDisabled = false,
  finishEntryDisabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={onGoDeeper}
        style={[styles.button, styles.goDeeperButton, goDeeperDisabled && styles.disabledButton]}
        labelStyle={styles.goDeeperLabel}
        contentStyle={styles.buttonContent}
        disabled={goDeeperDisabled}
      >
        {goDeeperLabel}
      </Button>
      <Button
        mode="outlined"
        onPress={onFinishEntry}
        style={[styles.button, styles.finishButton, finishEntryDisabled && styles.disabledButton]}
        labelStyle={[styles.finishLabel, finishEntryDisabled && styles.disabledLabel]}
        contentStyle={styles.buttonContent}
        textColor={finishEntryDisabled ? '#aaa' : MOOD_COLORS.neutral.secondary || '#6b7280'}
        disabled={finishEntryDisabled}
      >
        {finishEntryLabel}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0', 
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd',
  },
  button: {
    flex: 1, 
    marginHorizontal: 4, 
    borderRadius: 20, 
  },
  buttonContent: {
    paddingVertical: 4, 
    paddingHorizontal: 8, 
  },
  goDeeperButton: {
    backgroundColor: BASE_COLORS.accent || '#2E8B57', 
    borderColor: BASE_COLORS.accent || '#2E8B57',
  },
  goDeeperLabel: {
    color: '#fff',
    fontSize: 14, 
    fontWeight: '600',
  },
  finishButton: {
     borderColor: MOOD_COLORS.neutral.secondary || '#6b7280',
  },
  finishLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6, 
  },
  disabledLabel: {
    color: '#aaa', 
  },
});

export default InputAccessoryBar;
