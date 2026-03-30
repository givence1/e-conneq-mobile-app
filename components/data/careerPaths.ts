export interface BackendSpecialtyDescription {
  overview: string;
  requirements: string[];
  recommendedCourses: string[];
  salary: string;
}

export interface BackendSpecialty {
  id: string;
  specialtyName: string;
  description: BackendSpecialtyDescription;
}

export interface BackendSpecialtyEdge {
  node: BackendSpecialty;
}

export interface BackendSpecialtyResponse {
  allMainSpecialties: {
    edges: BackendSpecialtyEdge[];
  };
}
