
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ArrowLeft, Upload, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/services/apiService";
import EvaluationGrid from "./EvaluationGrid";
import ExportReports from "./ExportReports";
import CorrectorStats from "./CorrectorStats";
import CorrectorProgress from "./CorrectorProgress";
import CopiesList from "./CopiesList";
import UploadInterface from "./UploadInterface";

interface Copy {
  id: string;
  anonymousId: string;
  filename: string;
  uploadDate: string;
  status: 'pending' | 'in_progress' | 'corrected';
  score?: number;
  comments?: string;
}

interface CorrectorDashboardProps {
  onReturnToHome?: () => void;
}

const CorrectorDashboard = ({ onReturnToHome }: CorrectorDashboardProps) => {
  const [copies, setCopies] = useState<Copy[]>([]);
  const [selectedCopy, setSelectedCopy] = useState<Copy | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("copies");
  const { toast } = useToast();

  // Générer un identifiant anonyme unique pour chaque copie
  const generateAnonymousId = (index: number) => {
    const prefix = "COPY";
    const timestamp = Date.now().toString().slice(-4);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${(index + 1).toString().padStart(3, '0')}-${timestamp}${randomSuffix}`;
  };

  // Charger les soumissions depuis l'API
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const submissions = await ApiService.getSubmissions();
        const formattedCopies: Copy[] = submissions.map((sub, index) => ({
          id: sub.id?.toString() || '',
          anonymousId: generateAnonymousId(index),
          filename: sub.filename,
          uploadDate: sub.upload_date || '',
          status: 'pending' as const
        }));
        setCopies(formattedCopies);
      } catch (error) {
        console.error('Erreur lors du chargement des soumissions:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les soumissions.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  const startCorrection = (copy: Copy) => {
    setSelectedCopy(copy);
    // Marquer la copie comme en cours
    setCopies(prevCopies =>
      prevCopies.map(c =>
        c.id === copy.id ? { ...c, status: 'in_progress' as const } : c
      )
    );
  };

  const submitCorrection = async (score: number, comments: string, criteria: any[]) => {
    if (!selectedCopy) return;
    
    try {
      const correctionResult = await ApiService.createCorrection({
        submissionId: parseInt(selectedCopy.id),
        correctorId: 1, // ID du correcteur connecté
        score: score,
        comments: comments
      });

      if (correctionResult.success) {
        // Mettre à jour la copie localement
        setCopies(prevCopies =>
          prevCopies.map(copy =>
            copy.id === selectedCopy.id
              ? { ...copy, status: 'corrected' as const, score: score, comments: comments }
              : copy
          )
        );

        toast({
          title: "Correction enregistrée",
          description: `Note attribuée : ${score}/20`,
        });
        
        setSelectedCopy(null);
        setActiveTab("copies");
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible d'enregistrer la correction.",
        variant: "destructive"
      });
    }
  };

  const cancelCorrection = () => {
    if (selectedCopy) {
      // Remettre le statut à pending si la correction n'était pas terminée
      setCopies(prevCopies =>
        prevCopies.map(c =>
          c.id === selectedCopy.id && c.status === 'in_progress' 
            ? { ...c, status: 'pending' as const } 
            : c
        )
      );
    }
    setSelectedCopy(null);
  };

  const correctedCopies = copies.filter(c => c.status === 'corrected' && c.score !== undefined).map(c => ({
    id: c.id,
    anonymousId: c.anonymousId,
    score: c.score!,
    comments: c.comments || '',
    filename: c.filename
  }));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Chargement des copies...</p>
        </div>
      </div>
    );
  }

  // Interface de correction individuelle
  if (selectedCopy) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={cancelCorrection}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la liste</span>
          </Button>
        </div>
        
        <EvaluationGrid
          copyInfo={selectedCopy}
          onSave={submitCorrection}
          onCancel={cancelCorrection}
          initialScore={selectedCopy.score}
          initialComments={selectedCopy.comments}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Espace Correcteur</h2>
          <p className="text-muted-foreground">
            Interface de correction anonyme pour les copies de concours
          </p>
        </div>
        {onReturnToHome && (
          <Button 
            variant="outline" 
            onClick={onReturnToHome}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Button>
        )}
      </div>

      {/* Statistiques */}
      <CorrectorStats copies={copies} />

      {/* Barre de progression */}
      <CorrectorProgress copies={copies} />

      {/* Interface à onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="copies" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Copies</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Rapports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copies" className="mt-6">
          <CopiesList copies={copies} onStartCorrection={startCorrection} />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <UploadInterface />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ExportReports corrections={correctedCopies} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorrectorDashboard;
