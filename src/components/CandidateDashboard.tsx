import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/services/apiService";

interface Submission {
  id: string;
  filename: string;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'ready';
  anonymousId: string;
}

interface CandidateDashboardProps {
  onReturnToHome?: () => void;
}

const CandidateDashboard = ({ onReturnToHome }: CandidateDashboardProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.includes('pdf') && !file.type.includes('zip')) {
      toast({
        title: "Format non supporté",
        description: "Seuls les fichiers PDF et ZIP sont acceptés.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      // Génération d'un ID anonyme
      const anonymousId = `ANON-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Upload du fichier via l'API
      const uploadResult = await ApiService.uploadFile(file, undefined, anonymousId);
      
      if (uploadResult.success) {
        const newSubmission: Submission = {
          id: uploadResult.submissionId.toString(),
          filename: file.name,
          uploadDate: new Date().toLocaleString('fr-FR'),
          status: 'uploaded',
          anonymousId
        };
        
        setSubmissions([newSubmission, ...submissions]);
        
        toast({
          title: "Copie envoyée avec succès",
          description: `Identifiant anonyme généré : ${anonymousId}`,
        });
      } else {
        throw new Error('Erreur lors de l\'upload');
      }
      
      // Reset input
      event.target.value = '';
    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur d'upload",
        description: "Une erreur est survenue lors de l'envoi du fichier.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Espace Candidat</h2>
          <p className="text-muted-foreground">
            Déposez vos copies pour le concours. Un identifiant anonyme sera généré automatiquement.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Zone d'upload */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Déposer une copie</span>
              </CardTitle>
              <CardDescription>
                Formats acceptés : PDF, ZIP (max 10 MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-lg font-medium">Cliquez pour sélectionner un fichier</span>
                  <br />
                  <span className="text-sm text-muted-foreground">ou glissez-déposez votre fichier ici</span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.zip"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="mt-4">
                    <Progress value={66} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Téléchargement en cours...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations importantes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informations importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Anonymisation</h4>
                <p className="text-sm text-blue-700">
                  Votre identité sera complètement masquée aux correcteurs grâce à un identifiant anonyme unique.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Sécurité</h4>
                <p className="text-sm text-green-700">
                  Toutes les données sont chiffrées et stockées de manière sécurisée.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Délai</h4>
                <p className="text-sm text-orange-700">
                  Date limite de dépôt : 15 Décembre 2024 à 23h59
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Liste des copies déposées */}
      {submissions.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Mes copies déposées</CardTitle>
            <CardDescription>
              Historique de vos dépôts avec les identifiants anonymes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium">{submission.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        Déposé le {submission.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-mono text-sm font-medium">{submission.anonymousId}</p>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Reçu
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateDashboard;
