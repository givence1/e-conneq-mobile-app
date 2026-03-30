import { NodeClassRoomPrim, NodeUserProfilePrim } from "./interfaceGraphqlPrimary";
import { NodeSeries, NodeUserProfileSec } from "./interfaceGraphqlSecondary";

// PageInfo interface
interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
}


export interface NodeTenant {
  id: string;
  schemaName: string;
  schoolName: string;
  schoolType: string;
  isActive: boolean;
  domains: {
    edges: {
      node: {
        id: string;
        domain: string;
      };
    }[];
  };
  user: NodeCustomUser;
}

export interface NodeTenantDomain {
  id: string;
  domain: string;
  isPrimary: boolean;
  tenant: NodeTenant;
}

export interface NodePreInscription {
  id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  matricle: string;
  dob: string;
  pob: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  campus: NodeSchoolHigherInfo;
  fatherName: string;
  motherName: string;
  fatherTelephone: string;
  motherTelephone: string;
  parentAddress: string;
  about: string;
  nationality: string;
  regionOfOrigin: string;
  highestCertificate: string;
  yearObtained: string;
  status: string;
  admissionStatus: boolean;
  program: NodeProgram;
  specialtyOne: NodeMainSpecialty;
  specialtyTwo: NodeMainSpecialty;
  academicYear: string;
  level: string;
  session: string;
}

// User interface
export interface NodeCustomUser {
  id: string;
  prefix: string;
  photo: string;
  role: string;
  matricle: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  dob: string;
  pob: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  title: string;
  fatherName: string;
  motherName: string;
  fatherTelephone: string;
  motherTelephone: string;
  parentAddress: string;
  about: string;
  isSuperuser: string;
  isStaff: string;
  nationality: string;
  regionOfOrigin: string;
  highestCertificate: string;
  yearObtained: string;
  infoData: string | any;
  isActive: boolean;
  password: string;
  passwordSet: boolean;
  createdAt: string;

  page: { edges: EdgePage[] };
  school: { edges: EdgeSchoolHigherInfo[] };
  dept: { edges: EdgeDepartment[] };
  classroomprim: NodeClassRoomPrim[];
  preinscriptionLecturer: NodePreInscriptionLecturer;
  preinscriptionStudent: NodePreInscription;
}

export interface NodePreInscriptionLecturer {
  id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dob: string;
  pob: string;
  sex: string;
  address: string;
  telephone: string;
  email: string;
  campus: NodeSchoolHigherInfo;
  fatherName: string;
  motherName: string;
  fatherTelephone: string;
  motherTelephone: string;
  parentAddress: string;
  about: string;
  nationality: string;
  regionOfOrigin: string;
  highestCertificate: string;
  yearObtained: string;
  status: string;
  admissionStatus: boolean;
  academicYear: string;
  level: string;
  session: string;
  infoData: string;
  nic: string;
  niu: string;
  cv: string;
}


export interface NodePreInscriptionStudent {
  id: string;

  // Flags
  hasHigher: boolean;
  hasSecondary: boolean;
  hasPrimary: boolean;
  hasVocational: boolean;

  section?: string | null;

  // Identity & registration
  language: "en" | "fr";
  registrationNumber: string;
  matricle?: string | null;

  // Personal details
  firstName: string;
  lastName: string;
  fullName: string;
  sex: string;
  address: string;
  pob: string;
  dob: string;

  email?: string | null;
  telephone?: string | null;

  // Family details
  fatherName?: string | null;
  fatherTelephone?: string | null;
  parentAddress?: string | null;
  motherName?: string | null;
  motherTelephone?: string | null;

  // Academic years
  academicYearHigher?: string | null;
  academicYearSecondary?: string | null;
  academicYearPrimary?: string | null;

  // Admission info
  status: string;
  admissionStatus: boolean;
  action: string;

  // Nationality & region
  nationality: string;
  regionOfOrigin?: string | null;

  // Certificates
  highestCertificate?: string | null;
  yearObtained?: string | null;
  grade?: string | null;

  // Documents
  nic?: string | null; // file URL

  // Higher education
  campus?: NodeSchoolHigherInfo | null;
  programHigher?: string | null;
  levelHigher?: string | null;
  sessionHigher?: string | null;
  specialtyOne?: NodeMainSpecialty | null;
  specialtyTwo?: NodeMainSpecialty | null;

  // Secondary education
  programSecondary?: string | null;
  levelSecondary?: string | null;
  sessionSecondary?: string | null;
  stream?: string | null;
  seriesOne?: NodeSeries | null;

  // Primary education
  programPrimary?: string | null;
  levelPrimary?: string | null;

  // Metadata
  createdAt: string;
  updatedAt: string;
}


export interface NodeLecturerProfile {
  id: string;
  customuser: NodeCustomUser;
  specialty: NodeSpecialty;
  department: NodeDomain;
  contractType: string;
  hireDate: string;
  cv: string;
  nui: string;
  cni: string;
  infoData: string | any;
}


export interface NodeUserProfile {
  id: string;
  session: string;
  customuser: NodeCustomUser;
  specialty: NodeSpecialty;
  program: NodeProgram;
  code: string;
  infoData: string | any;
  schoolfees: { id: string, balance: number };
  moratoires: any;
}

// Level interface
export interface NodeLevel {
  id: string,
  level: string;
}

// Department interface
export interface NodeDepartment {
  id: string,
  name: string;
}

// Program interface
export interface NodeProgram {
  id: string,
  name: string;
  description: string;
}

export interface NodePage {
  id: string,
  name: string;
  description: string;
}


export interface InterVersionUpdateStatus {
  expired: boolean
  daysRemaining: number
  installed: string
  latest: string
  sameVersion: boolean
  updateAvailable: boolean
}

export interface InterVersion {
  majorChanges: string[]
  minorChanges: string[]
  rank: string
  metadata: string
  updatedAt: string
  versionNumber: string
}
// SchoolIdentification interface
export interface NodeSchoolIdentification {
  id: string;
  logo: string;
  code: string;
  version: string;
  director: string;
  name: string;
  supportNumberOne: string;
  supportNumberTwo: string;
  status: boolean;
  platformCharges: number;
  idCharges: number;
  messageOne: string;
  messageTwo: string;
  backEnd: string;
  frontEnd: string;
  hasHigher: string;
  hasSecondary: string;
  hasPrimary: string;
  hasVocational: string;
}

// School interface
export interface NodeSchoolHigherInfo {
  id: string;
  schoolIdentification: NodeSchoolIdentification;
  prefix: string;
  moratoireDeadline: string;
  method: number;
  schoolType: string;
  schoolName: string;
  shortName: string;
  mainSchool: boolean;
  address: string;
  region: string;
  town: string;
  country: string;
  poBox: string;
  niu: string;
  website: string;
  latitude: number;
  longitude: number;
  landingMessageMain: string;
  logoCampus: string;
  registrationSeperateTuition: boolean;
  welcome_message: string;
  radius: number;
  email: string;
  telephone: string;
  campus: string;
  schoolfeesControl: string;
  seqLimit: number;
  caLimit: number;
  examLimit: number;
  resitLimit: number;
  bgLogoSlip: string;
  bgLogoTranscript: string;
  colors: string;
  welcomeMessage: string;
  emailNotification: boolean;
  smsNotification: boolean;
  waNotification: boolean;
}


// To be Deleted
export interface NodeSchoolInfoHigher {
  id: string;
  schoolIdentification: NodeSchoolIdentification;
  prefix: string;
  method: number;
  schoolType: string;
  schoolName: string;
  shortName: string;
  mainSchool: boolean;
  address: string;
  region: string;
  town: string;
  country: string;
  poBox: string;
  niu: string;
  website: string;
  latitude: number;
  longitude: number;
  landingMessageMain: string;
  logoCampus: string;
  registrationSeperateTuition: boolean;
  welcome_message: string;
  radius: number;
  email: string;
  telephone: string;
  campus: string;
  schoolfeesControl: string;
  seqLimit: number;
  caLimit: number;
  examLimit: number;
  resitLimit: number;
  bgLogoSlip: string;
  bgLogoTranscript: string;
  colors: string;
  welcomeMessage: string;
  emailNotification: boolean;
  smsNotification: boolean;
  waNotification: boolean;
}

// Domain interface
export interface NodeDomain {
  id: string;
  domainName: string;
   language: string;
  mainSpecialties: NodeMainSpecialty[]
}


// Field interface
export interface NodeField {
  id: string;
  fieldName: string;
  domain: NodeDomain;
}

export interface NodeMainSpecialtyDescription {
  overview: string;
  requirements: string[];
  recommendedCourses: string[];
  salary: string;
}

// MainSpecialty interface
export interface NodeMainSpecialty {
  id: string;
  specialtyName: string;
  specialtyNameShort: string;
  field: NodeField;
  description: {
    intro: string,
    overview: string,
    recommendedCourses: string[],
    requirements: string[],
    salary: string,
  };

}

// Specialty interface
export interface NodeSpecialty {
  id: string;
  mainSpecialty: NodeMainSpecialty,
  academicYear: string;
  resultType: string;
  level: NodeLevel;
  school: NodeSchoolHigherInfo;
  tuition: number;
  registration: number;
  paymentOne: number;
  paymentTwo: number;
  paymentThree: number;
}

// Specialty interface
export interface NodeSpecialty {
  id: string;
  mainSpecialty: NodeMainSpecialty,
  academicYear: string;
  resultType: string;
  level: NodeLevel;
  school: NodeSchoolHigherInfo;
  tuition: number;
  registration: number;
  paymentOne: number;
  paymentTwo: number;
  paymentThree: number;
}

// MainCourse interface
export interface NodeMainCourse {
  id: string;
  courseName: string;
}

// Course interface
export interface NodeCourse {
  id: string;
  mainCourse: NodeMainCourse,
  specialty: NodeSpecialty;
  assignedTo: NodeCustomUser
  percentageCa: number;
  percentageResit: number;
  percentageExam: number;
  courseCode: string;
  courseType: string;
  courseCredit: number;
  semester: string;
  hours: number;
  hoursLeft: number;
  assigned: boolean;
  fileCa: string;
  fileExam: string;
  fileOutline: string;
  fileResit: string;
  fileStatusCa: string;
  fileStatusExam: string;
  fileStatusOutline: string;
  fileStatusResit: string;

  countTotal: number
  countSubmittedCa: number
  countSubmittedExam: number
  countSubmittedResit: number
  countValidated: number
  countFailed: number
  countResit: number
  countMissingAverage: number
  countWithAverage: number
}


export interface ResultSecondaryInfoData {
  [key: string]: number | null;
}

export interface NodeResult {
  publishResit: boolean;
  publishExam: boolean;
  id: string;
  student: NodeUserProfile,
  course: NodeCourse,
  infoData: ResultSecondaryInfoData;
  logs: any; // JSONField structure
}

// Publish interface
export interface NodePublish {
  id: string | number;
  semester: "I" | "II";
  specialty: NodeSpecialty,
  portalCa: boolean
  portalExam: boolean
  portalResit: boolean
  ca: boolean
  exam: boolean
  resit: boolean
}


export interface NodeNotification {
  id: string;
  target: string;
  specialties: {
    edges: EdgeSpecialty[];
  };
  levels: {
    edges: EdgeLevel[];
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

export interface NodeComplain {
  id: string;
  campus: NodeSchoolHigherInfo;
  userprofile: NodeUserProfile;
  userprofilesec: NodeUserProfileSec;
  userprofileprim: NodeUserProfilePrim;
  userprofilevoc: NodeUserProfilePrim;
  message: string;
  response: string;
  complainType: string;
  status: string;
  role: string;
  section: string;
  deleted: boolean;
  deletedBy: NodeCustomUser;
  endingAt: string;
  createdAt: string;
  updatedAt: string;
  customuser: NodeCustomUser;
  resolvedBy: NodeCustomUser;
  createdBy: NodeCustomUser;
  updatedBy: NodeCustomUser;
}







export interface EdgeTransactionsSet {
  edges: {
    node: { node: NodeTransactions };
  }[];

}


export interface Milestone {
  amount: number;
  dueDate: string;
}

export interface NodeMoratoire {
  id: string;
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
  comment?: string;
  requestedSchedule?: Milestone[];
  approvedSchedule?: Milestone[];
  reviewedBy?: string;
  reviewedAt?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  userprofile: NodeUserProfile;
}


export interface SetTransactions { id: string, status: string, amount: number, reason: string, paymentMethod: string, ref: string, createdAt: string }
export interface NodeSchoolFees {
  id: string | number;
  userprofile: NodeUserProfile,
  platformPaid: boolean;
  idPaid: boolean;
  balance: number;
  transactions: SetTransactions[];
  moratoire: NodeMoratoire;
  updatedAt: string;
  updatedBy: NodeCustomUser;
}

// Transactions interface
export interface NodeTransactions {
  id: string | number;
  schoolfees: NodeSchoolFees,
  payerName: string,
  telephone: string,
  status: boolean,
  paymentMethod: string,
  account: string,
  reason: string,
  ref: string,
  operationType: string,
  origin: string,
  amount: number,
  operator: string,
  createdBy: NodeCustomUser,
  updatedBy: NodeCustomUser,
  createdAt: string,
  updatedAt: string,
}


export interface NodeDocumentApplications {
  id: string | number;
  userprofile: NodeUserProfile,
  userprofilelec: NodePreInscriptionLecturer,
  userprofilesec: NodeUserProfileSec,
  userprofileprim: NodeUserProfilePrim,
  document: string,
  printCount: number,
  status: "PENDING" | "APPROVED" | "PRINTED",
  approvedBy: NodeCustomUser,
  approvedAt: string,
  printedBy: NodeCustomUser,
  printedAt: string,
  createdBy: NodeCustomUser,
  updatedBy: NodeCustomUser,
  createdAt: string,
  updatedAt: string,
}

export interface NodeAccount {
  id: string | number;
  name: string,
  year: string,
  status: boolean,
  description: string,
  createdBy: NodeCustomUser,
  updatedBy: NodeCustomUser,
  createdAt: string,
  updatedAt: string,
}

// TranscriptApplications interface
export interface NodeSysCategory {
  id: string | number;
  name: string,
  createdBy: NodeCustomUser,
  updatedBy: NodeCustomUser,
  createdAt: string,
  updatedAt: string,
}

// TranscriptApplications interface
export interface NodeSysConstant {
  id: string | number;
  sysCategory: NodeSysCategory
  name: string,
  createdBy: NodeCustomUser,
  updatedBy: NodeCustomUser,
  createdAt: string,
  updatedAt: string,
}















export interface EdgeTenant {
  node: NodeTenant;
};


export interface EdgeTenantDomain {
  node: NodeTenantDomain;
};



// Edge interface
export interface EdgePreInscription {
  node: NodePreInscription;
}

export interface EdgeCustomUser {
  node: NodeCustomUser;
}

export interface EdgeUserProfile {
  node: NodeUserProfile;
}

export interface EdgeLevel {
  node: NodeLevel;
}

export interface EdgeDepartment {
  node: NodeDepartment;
}

export interface EdgeProgram {
  node: NodeProgram;
}

export interface EdgePage {
  node: NodePage;
}

export interface EdgeSchoolIdentification {
  node: NodeSchoolIdentification;
}

export interface EdgeSchoolHigherInfo {
  node: NodeSchoolHigherInfo;
}

// To be deleted
export interface EdgeSchoolInfoHigher {
  node: NodeSchoolHigherInfo;
}

export interface EdgeDomain {
  node: NodeDomain;
}

export interface EdgeField {
  node: NodeField;
}

export interface EdgeMainSpecialty {
  node: NodeMainSpecialty;
}

export interface EdgeSpecialty {
  node: NodeSpecialty;
}

export interface EdgeMainCourse {
  node: NodeMainCourse;
}

export interface EdgeCourse {
  node: NodeCourse;
}

export interface EdgeResult {
  node: NodeResult;
}

export interface EdgePublish {
  node: NodePublish;
}

export interface EdgeMoratoire {
  node: NodeMoratoire;
}

export interface EdgeSchoolFees {
  node: NodeSchoolFees;
}

export interface EdgeTransactions {
  node: NodeTransactions;
}

export interface EdgeDocumentApplications {
  node: NodeDocumentApplications;
}

export interface EdgeAccount {
  node: NodeAccount;
}

export interface EdgeSysCategory {
  node: NodeSysCategory;
}

export interface EdgeSysConstants {
  node: NodeSysConstant;
}


export interface EdgeNotification {
  node: NodeNotification;
}

export interface EdgeComplain {
  node: NodeComplain;
}








// Query response interface
export interface allCustomusersResponse {
  allCustomusers: {
    edges: EdgeCustomUser[];
    pageinfoData: PageInfo;
  };
}

export interface AllUserProfilesResponse {
  allUserProfiles: {
    edges: EdgeUserProfile[];
    pageinfoData: PageInfo;
  };
}

export interface AllLevelsResponse {
  allLevels: {
    edges: EdgeLevel[];
    pageinfoData: PageInfo;
  };
}

export interface AllDepartmentsResponse {
  allDepartments: {
    edges: EdgeDepartment[];
    pageinfoData: PageInfo;
  };
}

export interface AllProgramsResponse {
  allPrograms: {
    edges: EdgeProgram[];
    pageinfoData: PageInfo;
  };
}

export interface AllSchoolIdentificationsResponse {
  allSchoolIdentifications: {
    edges: EdgeSchoolIdentification[];
    pageinfoData: PageInfo;
  };
}

export interface AllSchoolIdentificationsResponse {
  allSchoolIdentifications: {
    edges: EdgeSchoolIdentification[];
    pageinfoData: PageInfo;
  };
}

export interface AllDomainsResponse {
  allDomains: {
    edges: EdgeDomain[];
    pageinfoData: PageInfo;
  };
}

export interface AllFieldsResponse {
  allFields: {
    edges: EdgeField[];
    pageinfoData: PageInfo;
  };
}

export interface AllMainSpecialtiesResponse {
  allMainSpecialties: {
    edges: EdgeMainSpecialty[];
    pageinfoData: PageInfo;
  };
}

export interface AllSpecialtiesResponse {
  allSpecialties: {
    edges: EdgeSpecialty[];
    pageinfoData: PageInfo;
  };
}

export interface AllMainCoursesResponse {
  allMainCourses: {
    edges: EdgeMainCourse[];
    pageinfoData: PageInfo;
  };
}

export interface AllCoursesResponse {
  allCourses: {
    edges: EdgeCourse[];
    pageinfoData: PageInfo;
  };
}



export interface NodeHall {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  school: NodeSchoolHigherInfo;
}

export interface EdgeHall {
  node: NodeHall
}

export interface Slot {
  assignedToId: number;
  assignedToName: string;
  status: "Pending" | "LoggedIn" | "LoggedOut" | "Completed" | "Suspended";
  start: string;
  end: string;
  hours: number;
  courseId: number;
  courseName: string;
  session: string;
  hall: string;
  hallName: string;

  byId: number;
  byName: string;
  loginTime: string;
  logoutTime: string;
  duration: number;
  hallUsed: string;
  remarks: string;
}

export interface Period {
  date: string;
  slots: Slot[];
}


export interface NodeTimeTable {
  id: string;
  specialty: NodeSpecialty;
  year: number;
  month: number;
  monthName: string;
  published: boolean;
  period: Period[];
}


export interface NodeAvailabilitySlot {
  date: string;
  slots: {
    start: string,
    end: string,
  }[]
}

export interface NodeLecturerAvailability {
  id: string;
  availabilitySlots: NodeAvailabilitySlot[];
  year: number;
  month: number;
  monthName: string;
  customuser: NodeCustomUser;
  createdBy: NodeCustomUser;
  createdAt: string;
  updatedBy: NodeCustomUser;
  updatedAt: string;
}

export interface NodeNotification {
  id: string;
  subject: string;
  message: string;
  target: string;
  recipients: string;
  user?: NodeCustomUser | null;
  specialties: { edges: EdgeSpecialty[] };
  levels: { edges: EdgeLevel[] };
  academic_year?: string | null;
  notification_type: "general" | "urgent" | "event" | string;
  scheduled_for: string;
  sent: boolean;
  createdAt: string;
  createdBy: NodeCustomUser;
  updatedAt: string;
  updatedBy: NodeCustomUser;
  campus: NodeSchoolHigherInfo; 
}





export interface EdgeTimeTable {
  node: NodeTimeTable;
}

export interface EdgeLecturerAvailability {
  node: NodeLecturerAvailability;
}