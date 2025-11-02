import { useAuthStore } from '@/store/authStore';
import { decodeUrlID } from '@/utils/functions';
import { EdgeResult, NodeCourse } from '@/utils/schemas/interfaceGraphql';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const StudentResultsUpload = (
  {
    results,
    onSubmit,
    type,
    course,
    dataToSubmit,
    setDataToSubmit,
  }: {
    results: EdgeResult[];
    onSubmit: any;
    type: string;
    course: NodeCourse;
    dataToSubmit: any;
    setDataToSubmit: any;
  }
) => {
  const { t } = useTranslation();
  const { campusInfo } = useAuthStore();
  const [studentMarks, setStudentMarks] = useState<Record<string, string>>({});
  const [originalMarks, setOriginalMarks] = useState<Record<string, string>>({});
  const [modifiedEntries, setModifiedEntries] = useState<Set<string>>(new Set());


  useEffect(() => {
    const initialMarks: Record<string, string> = {};
    const originalMarksData: Record<string, string> = {};

    results.forEach(({ node }) => {
      try {
        const infoData = node.infoData ? node.infoData : {};
        const mark =
          type === 'ca'
            ? infoData.ca
            : type === 'exam'
              ? infoData.exam
              : type === 'resit'
                ? infoData.resit
                : null;

        const markValue = mark !== null && mark !== undefined ? String(mark) : '';
        initialMarks[node.id] = markValue;
        originalMarksData[node.id] = markValue;
      } catch (error) {
        console.error('Error parsing infoData:', error);
        initialMarks[node.id] = '';
        originalMarksData[node.id] = '';
      }
    });

    setStudentMarks(initialMarks);
    setOriginalMarks(originalMarksData);
    setModifiedEntries(new Set());
  }, [results, type]);


  const handleMarkChange = (resultId: string, value: string, index: number) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      value = Math.max(
        0,
        Math.min(
          type === "ca"
            ? campusInfo?.caLimit || 30
            : type === "exam"
              ? campusInfo?.examLimit || 70
              : campusInfo?.resitLimit || 70,
          // Math.abs(parseFloat(value || "0"))
          (parseFloat(value || "0"))
        )
      ).toString();
      setStudentMarks((prev) => ({ ...prev, [resultId]: value }));

      const originalValue = originalMarks[resultId] || '';
      const isModified = value !== originalValue;

      setModifiedEntries((prev) => {
        const newSet = new Set(prev);
        if (isModified) {
          newSet.add(resultId);
        } else {
          newSet.delete(resultId);
        }
        return newSet;
      });

      const infoData = sortedResults[index].node.infoData;
      const studentId = parseInt(decodeUrlID(sortedResults[index].node?.student?.id || "") || "");

      const updatedInfoData = {
        ...infoData,
        studentId,
        newInfoData: { [type]: value },
      };

      setDataToSubmit((prev: any) => {
        const existingIndex = prev.findIndex((r: any) => parseInt(r.studentId) === studentId);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = updatedInfoData;
          return updated;
        } else {
          return [...prev, updatedInfoData];
        }
      });
    }
  };

  const isModified = modifiedEntries.size > 0;


  const handleSubmit = () => {
    const updatedResults: any[] = [];

    results.forEach(({ node }) => {
      if (modifiedEntries.has(node.id)) {
        const currentMark = studentMarks[node.id] || '';

        try {
          const existingData = node.infoData ? node.infoData : {};

          const updatedData = {
            ...existingData,
            [type]: currentMark === '' ? null : parseFloat(currentMark),
          };

          updatedResults.push({
            ...node,
            infoData: JSON.stringify(updatedData),
          });
        } catch (error) {
          console.error('Error processing result:', error);
          updatedResults.push(node);
        }
      }
    });

    onSubmit(updatedResults);
    setModifiedEntries(new Set());
    Alert.alert(
      t('results.successTitle'),
      t('results.successMessage', { count: updatedResults.length })
    );
  };

  const sortedResults = [...results].sort((a, b) => {
    const nameA = a.node.student.customuser.fullName?.toUpperCase() || '';
    const nameB = b.node.student.customuser.fullName?.toUpperCase() || '';
    return nameA.localeCompare(nameB);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('results.enterMarks')}</Text>
        <Text style={styles.subtitle}>
          {t('results.course')}:{" "}
          <Text style={styles.typeText}>
            {course?.mainCourse?.courseName?.toUpperCase()}
          </Text>
        </Text>
        <Text style={styles.subtitle}>
          {t('results.level')}:{" "}
          <Text style={styles.typeText}>
            {course?.specialty?.level?.level}
          </Text>{" "}
          {t('results.semester')}{" "}
          <Text style={styles.typeText}>{course?.semester}</Text>
        </Text>
        <Text style={styles.subtitle}>
          {t('results.assessmentType')}:{" "}
          <Text style={styles.typeText}>{type.toUpperCase()}</Text>
        </Text>
        {isModified && (
          <Text style={styles.modifiedText}>
            {t('results.modifiedEntries', {
              count: modifiedEntries.size,
            })}
          </Text>
        )}
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.nameHeader]}>
          {t('results.studentName')}
        </Text>
        <Text style={[styles.headerCell, styles.markHeader]}>
          {t('results.mark')}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {sortedResults.map(({ node }, index: number) => {
          const isModifiedEntry = modifiedEntries.has(node.id);

          return (
            <View
              key={node.id}
              style={[
                styles.studentRow,
                isModifiedEntry && styles.modifiedRow,
              ]}
            >
              <View style={styles.nameContainer}>
                <Text style={styles.studentName}>
                  {node.student.customuser.fullName}
                </Text>
                <Text style={styles.matricule}>
                  {node.student.customuser.matricle}
                </Text>
              </View>

              <TextInput
                style={[
                  styles.markInput,
                  isModifiedEntry && styles.modifiedInput,
                ]}
                value={studentMarks[node.id] || ''}
                onChangeText={(value) => handleMarkChange(node.id, value, index)}
                placeholder="0"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton,
          !dataToSubmit?.length && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!dataToSubmit?.length}
      >
        <Text style={styles.submitButtonText}>
          {dataToSubmit?.length
            ? t('results.saveMarks', { count: modifiedEntries.size })
            : t('results.noChanges')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 4 },
  typeText: { fontWeight: 'bold', color: '#2196F3' },
  modifiedText: { fontSize: 14, color: '#FF9500', fontWeight: '500' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerCell: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  nameHeader: { width: '66%' },
  markHeader: { width: '33%', textAlign: 'right', paddingRight: 8 },
  scrollView: { flex: 1 },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modifiedRow: { backgroundColor: '#FFF9E6' },
  nameContainer: { width: '66%', paddingRight: 12 },
  studentName: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 2 },
  matricule: { fontSize: 14, color: '#666' },
  markInput: {
    width: '33%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    fontWeight: '500',
  },
  modifiedInput: { borderColor: '#FF9500', backgroundColor: '#FFF4E0' },
  submitButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#ccc' },
  submitButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default StudentResultsUpload;