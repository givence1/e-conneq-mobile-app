import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Linking } from "react-native";
import COLORS from "@/constants/colors";
import { capitalizeEachWord, decodeUrlID } from "@/utils/functions";
import { NodeCourse } from "@/utils/schemas/interfaceGraphql";
import { gql } from "@apollo/client";
import { ApiFactory } from "@/utils/graphql/ApiFactory";
import { useAuthStore } from "@/store/authStore";

interface Props {
    course: NodeCourse;
    refetch: any;
    setShowDetail?: any;
}

interface FileState {
    name: string;
    uri: string;
    size: number;
}

type FileType = "fileCa" | "fileExam" | "fileOutline" | "fileResit";

const Detail = ({ course, setShowDetail, refetch }: Props) => {

    const { token } = useAuthStore();
    console.log(course);

    const originalFiles: Record<FileType, string | null> = {
        fileCa: course.fileCa || null,
        fileExam: course.fileExam || null,
        fileOutline: course.fileOutline || null,
        fileResit: course.fileResit || null,
    };

    const [files, setFiles] = useState<Record<FileType, FileState | null>>({
        fileCa: course.fileCa ? { name: course.fileCa.split("/").pop() || "", uri: course.fileCa, size: 0 } : null,
        fileExam: course.fileExam ? { name: course.fileExam.split("/").pop() || "", uri: course.fileExam, size: 0 } : null,
        fileOutline: course.fileOutline ? { name: course.fileOutline.split("/").pop() || "", uri: course.fileOutline, size: 0 } : null,
        fileResit: course.fileResit ? { name: course.fileResit.split("/").pop() || "", uri: course.fileResit, size: 0 } : null,
    });

    const pickFile = async (type: FileType) => {
        if (Platform.OS === "web") return;
        try {
            const DocumentPicker = (await import("react-native-document-picker")).default;
            const { types } = await import("react-native-document-picker");
            const res = await DocumentPicker.pickSingle({ type: [types.pdf] });

            if (res.size && res.size > 4 * 1024 * 1024) {
                Alert.alert("File too large", "Please select a PDF smaller than 4MB.");
                return;
            }

            setFiles((prev) => ({
                ...prev,
                [type]: {
                    name: res.name ?? "",
                    uri: res.uri ?? "",
                    size: res.size ?? 0,
                },
            }));
        } catch (err: any) {
            if (err?.message?.includes("cancel")) return;
            console.error(err);
            Alert.alert("Error", "Could not pick file.");
        }
    };

    const handleWebFile = (type: FileType, e: React.ChangeEvent<HTMLInputElement>) => {
        const fileObj = e.target.files?.[0];
        if (!fileObj) return;

        if (fileObj.size > 4 * 1024 * 1024) {
            alert("File too large, max 4MB");
            return;
        }

        setFiles((prev) => ({
            ...prev,
            [type]: {
                name: fileObj.name,
                uri: URL.createObjectURL(fileObj), // for preview
                size: fileObj.size,
                rawFile: fileObj, // ✅ store the actual File object
            } as FileState & { rawFile: File },
        }));
    };



    // ✅ Submit all changed files together
    const submitAllFiles = async () => {
        const changedFiles: Partial<Record<FileType, FileState>> = Object.fromEntries(
            Object.entries(files).filter(
                ([type, file]) => file && file.uri !== originalFiles[type as FileType]
            )
        ) as Partial<Record<FileType, FileState>>;

        if (Object.keys(changedFiles).length === 0) {
            Alert.alert("No changes", "No files have been changed to submit.");
            return;
        }

        const fileMap: Record<string, File> = {};
        (Object.keys(changedFiles) as FileType[]).forEach((key) => {
            const file = changedFiles[key];
            if (!file) return;

            if (Platform.OS === "web") {
                fileMap[key] = (file as any).rawFile;
            } else {
                fileMap[key] = {
                    uri: file.uri,
                    name: file.name,
                    type: "application/pdf",
                } as any;

            }
        });

        const editData = {
            id: course?.id ? decodeUrlID(course?.id) : "",
            fileStatusCa: changedFiles["fileCa"] ? "PENDING" : (course?.fileStatusCa || "WAITING"),
            fileStatusExam: changedFiles["fileExam"] ? "PENDING" : (course?.fileStatusExam || "WAITING"),
            fileStatusResit: changedFiles["fileResit"] ? "PENDING" : (course?.fileStatusResit || "WAITING"),
            fileStatusOutline: changedFiles["fileOutline"] ? "PENDING" : (course?.fileStatusOutline || "WAITING"),
            delete: false
        }

        try {

            const res = await ApiFactory({
                newData: editData,
                editData,
                mutationName: "createUpdateDeleteCourse",
                modelName: "course",
                successField: "id",
                query,
                router: null,
                params: null,
                redirect: false,
                reload: false,
                returnResponseField: true,
                redirectPath: ``,
                actionLabel: "processing",
                token,
                getFileMap: () => fileMap,
            });

            console.log(res);
            if (res?.length > 10) {
                refetch()
                Alert.alert("Success", `Submitted ${Object.keys(changedFiles).length} file(s) successfully!`);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            Alert.alert("Error", "Failed to submit files.");
        }

    };

    const fileTypes: FileType[] = ["fileCa", "fileExam", "fileResit", "fileOutline"];

    // Check if any file changed
    const anyFileChanged = fileTypes.some(
        (type) => (files[type]?.uri ?? null) !== (originalFiles[type] ?? null)
    );

    return (
        <View style={styles.container}>
            {setShowDetail && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setShowDetail({ show: false, selectedItem: null })}
                >
                    <Text>{capitalizeEachWord("back")}</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.courseName}>{course.mainCourse?.courseName}</Text>
            <Text style={styles.specialtyLevel}>
                {course?.specialty?.mainSpecialty?.specialtyName} - {course?.specialty?.level?.level}
            </Text>

            {fileTypes.map((type) => {
                const file = files[type];
                const hasFile = Boolean(file?.uri);

                return (
                    <View
                        key={type}
                        style={[
                            styles.section,
                            { backgroundColor: hasFile ? "#a3eebeb7" : "#ffffff" },
                        ]}
                    >
                        <Text style={styles.label}>{`${capitalizeEachWord(type.replace("file", "file - "))}`}</Text>

                        {file?.uri && (
                            <TouchableOpacity onPress={() => Linking.openURL(file.uri)}>
                                <Text style={styles.fileLink}>{file.name}</Text>
                            </TouchableOpacity>
                        )}

                        {Platform.OS === "web" ? (
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleWebFile(type, e)}
                            />
                        ) : (
                            <TouchableOpacity
                                style={styles.fileInput}
                                onPress={() => pickFile(type)}
                            >
                                <Text>{file ? file.name : "Select PDF file"}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}

            {/* ✅ Single Bulk Submit Button */}
            {anyFileChanged && (
                <TouchableOpacity
                    style={[styles.submitButton, { marginTop: 20 }]}
                    onPress={submitAllFiles}
                >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>Submit All Changes</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};


export const query = gql`
  mutation CreateUpdateDeleteCourse (
    $id: ID
    $delete: Boolean!
    $fileCa: Upload
    $fileExam: Upload
    $fileResit: Upload
    $fileOutline: Upload
    $fileStatusCa: String!
    $fileStatusExam: String!
    $fileStatusResit: String!
    $fileStatusOutline: String!
  ) {
    createUpdateDeleteCourse(
      id: $id
      delete: $delete
      fileCa: $fileCa
      fileExam: $fileExam
      fileResit: $fileResit
      fileOutline: $fileOutline
      fileStatusCa: $fileStatusCa
      fileStatusExam: $fileStatusExam
      fileStatusResit: $fileStatusResit
      fileStatusOutline: $fileStatusOutline
    ) {
      course {
        id
      }
    }
  }
`;


export default Detail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.background,
    },
    backButton: { marginBottom: 6 },
    courseName: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
        textAlign: "center",
    },
    specialtyLevel: {
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 10,
        textAlign: "center",
    },
    section: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
    },
    label: {
        fontWeight: "600",
        marginBottom: 8,
    },
    fileLink: {
        color: COLORS.primary,
        textDecorationLine: "underline",
        marginBottom: 6,
    },
    fileInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#f2f2f2",
    },
    submitButton: {
        marginTop: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: "center",
    },
});
