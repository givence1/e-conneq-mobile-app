import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export function getWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // Monday = 0
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = target.getTime() - firstThursday.getTime();
  return 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
}

function toWeekString(date: Date): string {
  const week = getWeekNumber(date);
  return `${date.getFullYear()}-W${week.toString().padStart(2, '0')}`;
}

function getWeekRange(weekString: string) {
  const [yearStr, weekStr] = weekString.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);

  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = (simple.getDay() + 6) % 7;
  const monday = new Date(simple);
  monday.setDate(simple.getDate() - dow);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    monday,
    sunday,
    label: `${monday.toLocaleDateString()} → ${sunday.toLocaleDateString()}`,
  };
}

interface WeekPickerProps {
  mode?: 'current' | 'from-now' | 'all' | 'limited' | 'teacher' | 'from-current';
  label?: string;
  onChange?: (week: string) => void;
  defaultValue?: string;
}

const WeekPicker: React.FC<WeekPickerProps> = ({
  mode = 'all',
  label = 'Select week',
  onChange,
  defaultValue,
}) => {
  const { t } = useTranslation("common");
  const now = new Date();
  const currentWeekString = toWeekString(now);
  const [selectedWeek, setSelectedWeek] = useState(
    mode === 'limited' ? '' : defaultValue || currentWeekString
  );

  const limitedWeeks = useMemo(() => {
    if (mode !== 'limited' && mode !== 'teacher') return [];
    const currentWeek = getWeekNumber(now);
    const year = now.getFullYear();
    const weeks = [];
    for (let i = 0; i < (mode === 'limited' ? 3 : mode === 'teacher' ? 2 : 4); i++) {
      const weekNum = currentWeek + i;
      const weekStr = `${year}-W${weekNum.toString().padStart(2, '0')}`;
      const range = getWeekRange(weekStr);
      weeks.push({ weekStr, label: range.label });
    }
    return weeks;
  }, [mode, now]);

  const handleSelectWeek = (weekStr: string) => {
    setSelectedWeek(weekStr);
    onChange?.(weekStr);
  };

  const range = getWeekRange(selectedWeek);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={20} color="#1D4ED8" />
        <Text style={styles.label}>{label}</Text>
      </View>

      {mode === 'limited' || mode === 'teacher' ? (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedWeek}
            onValueChange={(value) => handleSelectWeek(value)}
            style={styles.picker}
          >
            <Picker.Item label="----------------" value="" />
            {limitedWeeks.map((w) => (
              <Picker.Item key={w.weekStr} label={w.label} value={w.weekStr} />
            ))}
          </Picker>
        </View>
      ) : (
        <View style={styles.weekDisplay}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>&lt;</Text>
          </TouchableOpacity>

          <View style={styles.weekInfo}>
            <Text style={styles.weekText}>{selectedWeek}</Text>
            <Text style={styles.rangeText}>{range.label}</Text>
          </View>

          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>&gt;</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default WeekPicker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    width: '100%',
  },
  weekDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  rangeText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
