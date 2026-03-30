import { useAuthStore } from '@/store/authStore';
import { capitalizeEachWord, decodeUrlID, removeUnderscoreKeys } from '@/utils/functions';
import { EdgeResultSecondary, EdgeUserProfileSec, NodeSubjectSec, NodeSubSubjectSec } from '@/utils/schemas/interfaceGraphqlSecondary';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
    subjectsec,
    dataToSubmit,
    setDataToSubmit,
    apiProfiles
  }: {
    results: EdgeResultSecondary[];
    onSubmit: any;
    type: string;
    subjectsec: NodeSubjectSec;
    dataToSubmit: any;
    setDataToSubmit: any;
    apiProfiles: EdgeUserProfileSec[];
  }
) => {

  const { t } = useTranslation();
  const { campusInfo, user } = useAuthStore();
  const [studentMarks, setStudentMarks] = useState<Record<string, string>>({});
  const [originalMarks, setOriginalMarks] = useState<Record<string, string>>({});
  const [modifiedEntries, setModifiedEntries] = useState<Set<string>>(new Set());

  const markLetter = ["a", "b", "c", "d", "e", "f"]

  // FOR MINOR SUBJECTS
  const sortedSubSubject = subjectsec?.subsubjectList
    ?.slice()
    .sort((a: NodeSubSubjectSec, b: NodeSubSubjectSec) =>
      parseInt(decodeUrlID(a?.id || "") || "") - parseInt(decodeUrlID(b?.id || "") || "")
    );
  const letter = markLetter[sortedSubSubject?.findIndex(
    (item: NodeSubSubjectSec) => decodeUrlID(item.assignedTo?.id) === user?.user_id?.toString()
  )];

  const filteredProfiles = useMemo(() => {
    if (apiProfiles && results) {
      return apiProfiles.filter(
        (bitem: EdgeUserProfileSec) => !results.some(
          (aitem: EdgeResultSecondary) => aitem?.node.student.id === bitem?.node.id
        )
      );
    }
  }, [apiProfiles, results]);

  const listNewResults = useMemo(() =>
    filteredProfiles?.map((item: EdgeUserProfileSec, index: number) => {
      const student = item.node;
      const node = {
        id: index + 1 + "x",
        subjectsec,
        student,
        infoData: "{}",
        newInfoData: {},
        new: true
      }
      return { node };
    })|| [],
    [filteredProfiles?.sort((a, b) => a.node?.customuser?.preinscriptionStudent?.fullName > a.node?.customuser?.preinscriptionStudent?.fullName ? 1 : a.node?.customuser?.preinscriptionStudent?.fullName < a.node?.customuser?.preinscriptionStudent?.fullName ? -1 : 0) ]
  );

  useEffect(() => {
    const initialMarks: Record<string, string> = {};
    const originalMarksData: Record<string, string> = {};

    [...results, ...listNewResults].forEach(({ node }: any) => {
      try {
        const infoData = node.infoData ? node.infoData : {};
        console.log(infoData);
        const mark =
          type === 'seq_1'
            ? infoData["seq1" + (letter || "")]
            : type === 'seq_2'
              ? infoData["seq2" + (letter || "")]
              : type === 'seq_3'
                ? infoData["seq3" + (letter || "")]
                : type === 'seq_4'
                  ? infoData["seq4" + (letter || "")]
                  : type === 'seq_5'
                    ? infoData["seq5" + (letter || "")]
                    : type === 'seq_6'
                      ? infoData["seq6" + (letter || "")]
                      : null;

        const markValue = mark !== null && mark !== undefined ? String(mark) : '';
        initialMarks[node?.id] = markValue;
        originalMarksData[node?.id] = markValue;
      } catch (error) {
        initialMarks[node?.id] = '';
        originalMarksData[node?.id] = '';
      }
    });

    setStudentMarks(initialMarks);
    setOriginalMarks(originalMarksData);
    setModifiedEntries(new Set());
  }, [results, type, listNewResults]);


  const handleMarkChange = (resultId: string, value: string, index: number) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      value = Math.max(
        0,
        Math.min(
          type.includes("seq")
            ? campusInfo?.seqLimit || 20
            : 20,
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
      const infoData = removeUnderscoreKeys(combinedRes[index].node.infoData);
      const studentId = parseInt(decodeUrlID(combinedRes[index].node?.student?.id || "") || "");

      const updatedInfoData = {
        ...infoData,
        studentId,
        newInfoData: { [type + (letter || "")]: value },
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
          const existingData = node.infoData ? removeUnderscoreKeys(node.infoData) : {};

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
  };

  const sortedResults = [...results].sort((a, b) => {
    const nameA = a.node.student.customuser.fullName?.toUpperCase() || '';
    const nameB = b.node.student.customuser.fullName?.toUpperCase() || '';
    return nameA.localeCompare(nameB);
  });

  const combinedRes = [...sortedResults, ...listNewResults]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('results.enterMarks')}</Text>
        <Text style={styles.subtitle}>
          {t('results.course')}:{" "}
          <Text style={styles.typeText}>
            {subjectsec?.mainsubject?.subjectName?.toUpperCase()}
          </Text>
        </Text>
        <Text style={styles.subtitle}>
          {t('results.level')}:{" "}
          <Text style={styles.typeText}>
            {subjectsec?.classroomsec?.level}
          </Text>{" "}
          {t('results.semester')}{" "}
          <Text style={styles.typeText}>{subjectsec?.classroomsec?.classType}</Text>
        </Text>
        <Text style={styles.subtitle}>
          {t('results.assessmentType')}:{" "}
          <Text style={styles.typeText}>{type.toUpperCase()}</Text>
        </Text>
        {isModified && (
          <Text style={styles.modifiedText}>
            {capitalizeEachWord(t('results.modifiedEntries'))} - {modifiedEntries.size}
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
        {combinedRes?.map(({ node }: any, index: number) => {
          const isModifiedEntry = modifiedEntries.has(node?.id);

          return (
            <View
              key={node?.id}
              style={[
                styles.studentRow,
                isModifiedEntry && styles.modifiedRow,
                { backgroundColor: `${node?.new ? "#f355551c" : "white"}` }
              ]}
            >
              <View style={styles.nameContainer}>
                <Text style={styles.studentName}>
                  {node.student.customuser?.preinscriptionStudent.fullName}
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