
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, User, Clock, CheckCircle, ArrowLeft, Upload, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/services/apiService";
import EvaluationGrid from "./EvaluationGrid";
import ExportReports from "./ExportReports";

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

  const getStatusBadge = (status: Copy['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />À corriger</Badge>;
      case 'in_progress':
        return <Badge variant="secondary"><User className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'corrected':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
    }
  };

  const correctedCount = copies.filter(c => c.status === 'corrected').length;
  const progressPercentage = copies.length > 0 ? (correctedCount / copies.length) * 100 : 0;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Copies à corriger</p>
                <p className="text-2xl font-bold">{copies.filter(c => c.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold">{copies.filter(c => c.status === 'in_progress').length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Corrigées</p>
                <p className="text-2xl font-bold">{correctedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Progression globale</h3>
            <span className="text-sm text-muted-foreground">{correctedCount}/{copies.length}</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </CardContent>
      </Card>

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
          <Card>
            <CardHeader>
              <CardTitle>Copies assignées</CardTitle>
              <CardDescription>
                Toutes les identités sont anonymisées pour garantir l'impartialité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {copies.map((copy) => (
                  <div key={copy.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-mono text-sm font-medium">{copy.anonymousId}</p>
                        <p className="text-sm text-muted-foreground">{copy.filename}</p>
                        <p className="text-sm text-muted-foreground">{copy.uploadDate}</p>
                        {copy.score !== undefined && (
                          <p className="text-sm font-medium text-green-600">Note: {copy.score}/20</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(copy.status)}
                      <Button 
                        size="sm" 
                        onClick={() => startCorrection(copy)}
                        variant={copy.status === 'corrected' ? 'outline' : 'default'}
                      >
                        {copy.status === 'corrected' ? 'Voir/Modifier' : 'Corriger'}
                      </Button>
                    </div>
                  </div>
                ))}
                {copies.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Aucune copie à corriger pour le moment
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Interface d'upload</CardTitle>
              <CardDescription>
                Téléchargez des documents PDF ou ZIP contenant les copies à corriger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Fonctionnalité en développement</h3>
                <p className="text-muted-foreground mb-4">
                  L'interface d'upload pour les documents PDF et ZIP sera bientôt disponible
                </p>
                <Button disabled variant="outline">
                  Sélectionner des fichiers
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ExportReports corrections={correctedCopies} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorrectorDashboard;
