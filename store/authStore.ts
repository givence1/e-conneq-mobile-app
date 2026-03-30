import { client } from '@/utils/graphql/client';
import i18n from '@/utils/i18n';
import { JwtPayload } from '@/utils/interfaces';
import { NodeSchoolHigherInfo, NodeSchoolIdentification } from '@/utils/schemas/interfaceGraphql';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

interface AuthStore {
  user: JwtPayload | null;
  feesId: number | null;
  profileId: number | null;
  classId: number | null;
  level: number | string | null;
  parentNumber: number | string | null;
  token: string | null; 
  section: "higher" | "secondary" | "primary" | "vocational" | null; 
  isCheckingAuth: boolean;
  isLoading: boolean;
  schoolIdentification: NodeSchoolIdentification | null;
  campusInfo: NodeSchoolHigherInfo | null;
  role: "student" | "teacher" | "parent" | "admin" | any;
  language: string;

  login: (loginData?: any) => Promise<{ token: string, refresh?: string }>;
  logout: () => void;
  checkAuth: () => void;
  storeFeesId: (id: number) => void;
  storeProfileId: (id: number) => void;
  storeClassId: (id: number) => void;
  storeLevel: (id: number | string) => void;
  storeParentNumber: (id: number | string) => void;
  storeRegistrationId: (field: "registration_lec_id" | "registration_hig_id" | "registration_sec_id" | "registration_pri_id", value: number) => void;
  storeCampusInfo: (data: NodeSchoolHigherInfo) => void;
  storeSection: (section: "higher" | "secondary" | "primary" | "vocational" | null) => void;
  setLanguage: (lang: string) => void;
  loadLanguage: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  section: null,
  user: null,
  feesId: null,
  profileId: null,
  classId: null,
  level: null,
  parentNumber: null,
  token: null,
  isCheckingAuth: false,
  isLoading: false,
  schoolIdentification: null,
  campusInfo: null,
  role: "student",
  language: "en",

  storeFeesId: async (feesId: number) => { set({ feesId }) },
  storeProfileId: async (profileId: number) => { set({ profileId }) },
  storeClassId: async (classId: number) => { set({ classId }) },
  storeLevel: async (level: number | string) => { set({ level }) },
  storeParentNumber: async (parentNumber: number | string) => { set({ parentNumber }) },
  storeCampusInfo: async (campusInfo: NodeSchoolHigherInfo) => { set({ campusInfo }) },

  storeRegistrationId: (field, value) => {
    const currentUser = get().user;
    set({
      [field]: value,
      user: currentUser ? { ...currentUser, [field]: value } : currentUser,
    });
  },

  login: async (loginData: any) => {
    set({ isLoading: true });
    try {
      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          matricle: loginData.matricle,
          password: loginData.password,
          parent: loginData.parent || false,
        },
      });

      const result = data?.login;

      if (result?.token) {
        const user: JwtPayload = jwtDecode(result.token)
        set({
          token: result.token,
          user: user,
          isLoading: false,
          role: loginData.parent ? "parent" : user?.role?.toLowerCase()
        });
        return result;
      } else {
        set({ isLoading: false });
        return { token: "", refresh: "Login failed. No token returned." };
      }
    } catch (error) {
      console.error("Login mutation error:", error);
      set({ isLoading: false });
      return { token: "", refresh: "Login failed due to server error." };
    }
  },

  logout: () => set({ user: null, token: null, feesId: null, profileId: null, classId: null }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await client.query({ query: querySchool });
      const school = data?.allSchoolInfos?.edges?.[0]?.node?.schoolIdentification;

      await new Promise((res) => setTimeout(res, 1000));

      set({
        schoolIdentification: school,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.error("School info fetch failed", error);
      set({ schoolIdentification: null, isCheckingAuth: false });
    }
  },

  setLanguage: (lang: string) => {
    set({ language: lang });
    i18n.changeLanguage(lang);
    AsyncStorage.setItem("appLanguage", lang);
  },

  storeSection: (section: "higher" | "secondary" | "primary" | "vocational" | null ) => {
    set({ section });
  },

  loadLanguage: async () => {
    const savedLang = await AsyncStorage.getItem("appLanguage");
    if (savedLang) {
      set({ language: savedLang });
      i18n.changeLanguage(savedLang);
    }
  },
}));

const querySchool = gql`
  query {
    allSchoolInfos(first: 1) {
      edges {
        node {
          schoolName
          schoolIdentification {
            name
            logo
            platformCharges idCharges
            supportNumberOne
            hasHigher
            hasSecondary
            hasPrimary
            hasVocational
            version {
              mobile {
                majorChanges
                metadata
                minorChanges
                rank
                updatedAt
                versionNumber
              }
            }
          }
        }
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login(
    $matricle: String!,
    $password: String!,
    $parent: Boolean!
  ) {
    login(matricle: $matricle, password: $password, parent: $parent) {
      token
      refresh
    }
  }
`;