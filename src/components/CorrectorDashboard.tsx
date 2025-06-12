import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, User, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/services/apiService";

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
  const [correctionData, setCorrectionData] = useState({ score: '', comments: '' });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger les soumissions depuis l'API
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const submissions = await ApiService.getSubmissions();
        const formattedCopies: Copy[] = submissions.map(sub => ({
          id: sub.id?.toString() || '',
          anonymousId: sub.anonymousId,
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
    setCorrectionData({
      score: copy.score?.toString() || '',
      comments: copy.comments || ''
    });
  };

  const submitCorrection = async () => {
    if (!selectedCopy) return;
    
    try {
      const correctionResult = await ApiService.createCorrection({
        submissionId: parseInt(selectedCopy.id),
        correctorId: 1, // ID du correcteur connecté
        score: parseFloat(correctionData.score),
        comments: correctionData.comments
      });

      if (correctionResult.success) {
        // Mettre à jour la copie localement
        setCopies(prevCopies =>
          prevCopies.map(copy =>
            copy.id === selectedCopy.id
              ? { ...copy, status: 'corrected' as const, score: parseFloat(correctionData.score), comments: correctionData.comments }
              : copy
          )
        );

        toast({
          title: "Correction enregistrée",
          description: `Note attribuée : ${correctionData.score}/20`,
        });
        
        setSelectedCopy(null);
        setCorrectionData({ score: '', comments: '' });
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Chargement des copies...</p>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Liste des copies */}
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
                      <p className="text-sm text-muted-foreground">{copy.uploadDate}</p>
                      {copy.score && (
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
                      {copy.status === 'corrected' ? 'Voir' : 'Corriger'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interface de correction */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCopy ? `Correction - ${selectedCopy.anonymousId}` : 'Grille de correction'}
            </CardTitle>
            <CardDescription>
              {selectedCopy ? 'Attribuez une note et des commentaires' : 'Sélectionnez une copie pour commencer la correction'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCopy ? (
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Copie sélectionnée</h4>
                  <p className="font-mono text-sm">{selectedCopy.anonymousId}</p>
                  <p className="text-sm text-muted-foreground">{selectedCopy.filename}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="score">Note sur 20</Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      placeholder="18.5"
                      value={correctionData.score}
                      onChange={(e) => setCorrectionData({ ...correctionData, score: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="comments">Commentaires détaillés</Label>
                    <Textarea
                      id="comments"
                      placeholder="Points forts, axes d'amélioration, remarques constructives..."
                      rows={6}
                      value={correctionData.comments}
                      onChange={(e) => setCorrectionData({ ...correctionData, comments: e.target.value })}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={submitCorrection} className="flex-1">
                      Enregistrer la correction
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedCopy(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Sélectionnez une copie dans la liste pour commencer la correction
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CorrectorDashboard;
