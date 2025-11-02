import { NodeCustomUser, NodeProgram, NodeSchoolHigherInfo } from "./interfaceGraphql";

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
}

export type TableColumn<T> = {
  header: string;
  accessor?: string;
  responsiveHidden?: boolean;
  hideColumn?: boolean;
  align: 'left' | 'center' | 'right';  // Valid values for alignment
  render?: (item: T, index: number) => React.ReactNode;  // Change the return type to React.ReactNode
};

export interface NodeUserProfileSec {
  id: string;
  customuser: NodeCustomUser;
  series: NodeSeries[];
  classroomsec: NodeClassRoomSec;
  program: NodeProgram;
  session: string;
  active: false;
  infoData: string;
}


export interface NodeSeries {
  id: string;
  name: string;
  classroom: string;
  subjects: { edges: EdgeMainSubjectSec[] };
}


export interface NodeClassRoomSec {
  id: string;
  school: NodeSchoolHigherInfo;
  series: NodeSeries;
  stream: string;
  cycle: string;
  level: string;
  classType: string;
  select: boolean;
  option: string;
  academicYear: string;
  registration: number;
  tuition: number;
  paymentOne: number;
  paymentTwo: number;
  paymentThree: number;
}

export interface NodeMainSubjectSec {
  id: string;
  subjectName: string;
  subjectCode: string;
  language: string;
}

export interface NodeSubjectSec {
  id: string;
  mainsubject: NodeMainSubjectSec;
  classroomsec: NodeClassRoomSec;
  subjectType: string;
  subjectCoefficient: string;
  assigned: boolean;
  hasSubSubjects: boolean;
  dateAssigned: boolean;
  assignedTo: NodeCustomUser;
  assignedToTwo: NodeCustomUser;
  subsubjectList: NodeSubSubjectSec[];
  infoData: {
    submissionPercentage: {
      seq1: number | null;
      seq2: number | null;
      seq3: number | null;
      seq4: number | null;
      seq5: number | null;
      seq6: number | null;
      term1: number | null;
      term2: number | null;
      term3: number | null;
    };
    statistics: {
      overallAvailability: number | null;
      annualHighestStudent: string | null;
      annualLowestStudent: string | null;
      annualSubjectAverage: number | null;
      dateUpdated: string | null;
      gradeDistribution: {
        A: number;
        B: number;
        C: number;
        D: number;
        E: number;
        F: number;
      };
      highestStudentPerSeq: {
        mark: number;
        name: string;
        studentId: string;
        seq: string;
      }[];
      passRate: {
        seq1: number | null;
        seq2: number | null;
        seq3: number | null;
        seq4: number | null;
        seq5: number | null;
        seq6: number | null;
      };
      performanceTrend: {
        seq1: number | null;
        seq2: number | null;
        seq3: number | null;
        seq4: number | null;
        seq5: number | null;
        seq6: number | null;
      };
      seqAverages: number[] | null;
      studentCount: {
        active: number;
        inactive: number;
      };
      lowestStudentPerSeq: {
        mark: number;
        name: string;
        seq: string;
        studentId: string;
      }[];
      generationTimeMs: number | null;
      availabilityPercentage: {
        seq1: number | null;
        seq2: number | null;
        seq3: number | null;
        seq4: number | null;
        seq5: number | null;
        seq6: number | null;
      };
    };
  };
}

export interface NodeSubSubjectSec {
  id: string;
  subjectsec: NodeSubjectSec;
  assignedTo: NodeCustomUser;
}


export interface NodeResultSecondary {
  id: string;
  student: NodeUserProfileSec // Represents the "student" ForeignKey
  subjectsec: NodeSubjectSec | null; // Represents the "subject" ForeignKey
  infoData: string | any; // JSONField structure
  logs: string | any; // JSONField structure
  active?: true;
  createdAt?: string;
  createdBy?: NodeCustomUser;
  updatedAt?: string;
  updatedBy?: NodeCustomUser;
}


export interface NodePublishSecondary {
  id: string;
  classroomsec: NodeClassRoomSec;
  publishTerm: "I" | "II" | "III"; // Restricted to the defined term choices
  portalSeq: string; // JSON structure as key-value pairs (e.g., {"seq_1": false, "seq_2": false})
  publishSeq: string; // JSON structure as key-value pairs (e.g., {"seq_1": false, "seq_2": false})
  updatedAt: string;
  updatedBy: NodeCustomUser;
}


export interface EdgeTransactionsSecSet {
  edges: {
    node: { node: NodeTransactionsSec };
  }[];
}

export interface SetTransactionsSet { id: string, status: string, amount: number, reason: string, paymentMethod: string, ref: string, createdAt: string }
export interface NodeSchoolFeesSec {
  id: string;
  userprofilesec: NodeUserProfileSec;
  platformPaid: boolean,
  idPaid: boolean,
  balance: number,
  transactionssec: SetTransactionsSet[];
  updatedAt: string;
  updatedBy: NodeCustomUser;
}

export interface NodeTransactionsSec {
  id: string;
  schoolfeesec: NodeSchoolFeesSec;
  amount: number,
  reason: string,
  status: string,
  updatedAt: string;
  updatedBy: NodeCustomUser;
}


export interface NodeNotificationSec {
  id: string;
  target: string;
  classroomsSec: {
    edges: EdgeClassRoomSec[];
  };
  subject: string;
  message: string;
  recipients: string;
  academicYear: string;
  notificationType: string;
  scheduledFor: string;
  sent: boolean;
  campus: NodeSchoolHigherInfo;
}

export interface NodeComplainSec {
  id: string;
  userprofilesec: NodeUserProfileSec;
  message: string;
  complainType: string;
  status: string;
  endingAt: string;
}

















// Edge interface
export interface EdgeUserProfileSec {
  node: NodeUserProfileSec;
}

export interface EdgeSeries {
  node: NodeSeries;
}

export interface EdgeClassRoomSec {
  node: NodeClassRoomSec;
}

export interface EdgeMainSubjectSec {
  node: NodeMainSubjectSec;
}

export interface EdgeSubjectSec {
  node: NodeSubjectSec;
}

export interface EdgeSubSubjectSec {
  node: NodeSubSubjectSec;
}

export interface EdgePublishSecondary {
  node: NodePublishSecondary;
}

export interface EdgeResultSecondary {
  node: NodeResultSecondary;
}

export interface EdgeSchoolFeesSec {
  node: NodeSchoolFeesSec;
}

export interface EdgeTransactionsSec {
  node: NodeTransactionsSec;
}


export interface EdgeNotificationSec {
  node: NodeNotificationSec;
}

export interface EdgeComplainSec {
  node: NodeComplainSec;
} 