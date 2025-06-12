
const API_BASE_URL = 'http://localhost/concours_api.php';

export interface Candidate {
  id?: number;
  anonymousId: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Submission {
  id?: number;
  candidateId: number;
  filename: string;
  filePath: string;
  anonymousId: string;
  status: 'uploaded' | 'processing' | 'ready';
  upload_date?: string;
}

export interface Correction {
  id?: number;
  submissionId: number;
  correctorId: number;
  score: number;
  comments: string;
  correction_date?: string;
}

export class ApiService {
  // Gestion des candidats
  static async createCandidate(candidateData: Omit<Candidate, 'id' | 'created_at'>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData)
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la création du candidat');
    }
    
    return response.json();
  }

  static async getCandidates(): Promise<Candidate[]> {
    const response = await fetch(`${API_BASE_URL}/candidates`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des candidats');
    }
    
    return response.json();
  }

  // Gestion des soumissions
  static async createSubmission(submissionData: Omit<Submission, 'id' | 'upload_date'>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la création de la soumission');
    }
    
    return response.json();
  }

  static async getSubmissions(): Promise<Submission[]> {
    const response = await fetch(`${API_BASE_URL}/submissions`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des soumissions');
    }
    
    return response.json();
  }

  // Upload de fichiers
  static async uploadFile(file: File, candidateId?: number, anonymousId?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (candidateId) formData.append('candidateId', candidateId.toString());
    if (anonymousId) formData.append('anonymousId', anonymousId);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload du fichier');
    }
    
    return response.json();
  }

  // Gestion des corrections
  static async createCorrection(correctionData: Omit<Correction, 'id' | 'correction_date'>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/corrections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(correctionData)
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la création de la correction');
    }
    
    return response.json();
  }

  static async getCorrections(): Promise<Correction[]> {
    const response = await fetch(`${API_BASE_URL}/corrections`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des corrections');
    }
    
    return response.json();
  }
}
