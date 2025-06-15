
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Archive, CheckCircle, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  anonymousCode: string;
}

const UploadInterface = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateAnonymousCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'DOC-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['application/pdf', 'application/zip', 'application/x-zip-compressed'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.zip')) {
      return 'Format de fichier non supporté. Seuls les fichiers PDF et ZIP sont acceptés.';
    }

    if (file.size > maxSize) {
      return 'Fichier trop volumineux. Taille maximale : 50 MB.';
    }

    return null;
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f)
        );
      } else {
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, progress } : f)
        );
      }
    }, 200);
  };

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Erreur de fichier",
          description: error,
          variant: "destructive",
        });
        return;
      }

      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const anonymousCode = generateAnonymousCode();
      
      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        progress: 0,
        status: 'uploading',
        anonymousCode
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      simulateUpload(fileId);

      toast({
        title: "Upload démarré",
        description: `Fichier ${file.name} en cours de téléchargement...`,
      });
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-500" />
            Interface d'Upload Avancée
          </CardTitle>
          <CardDescription>
            Téléchargez vos documents PDF ou archives ZIP de manière sécurisée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-medium mb-2">
              {isDragging ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
            </h3>
            <p className="text-gray-500 mb-4">
              ou cliquez pour sélectionner des fichiers
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-600">
              <span>• PDF jusqu'à 50MB</span>
              <span>• ZIP jusqu'à 50MB</span>
              <span>• Upload multiple supporté</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.zip"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fichiers téléchargés</CardTitle>
            <CardDescription>
              Suivez le progrès de vos uploads et récupérez les codes anonymes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {uploadedFile.file.type === 'application/pdf' ? (
                        <FileText className="w-8 h-8 text-red-500" />
                      ) : (
                        <Archive className="w-8 h-8 text-orange-500" />
                      )}
                      <div>
                        <p className="font-medium truncate max-w-xs">{uploadedFile.file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadedFile.status === 'completed' && (
                        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Terminé
                        </Badge>
                      )}
                      {uploadedFile.status === 'error' && (
                        <Badge variant="outline" className="text-red-700 border-red-200 bg-red-50">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Erreur
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadedFile.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {uploadedFile.status === 'uploading' && (
                    <Progress value={uploadedFile.progress} className="mb-2" />
                  )}
                  
                  {uploadedFile.status === 'completed' && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <Label className="text-sm font-medium text-blue-800">
                        Code anonyme généré
                      </Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={uploadedFile.anonymousCode}
                          readOnly
                          className="font-mono text-sm bg-white"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(uploadedFile.anonymousCode);
                            toast({
                              title: "Code copié",
                              description: "Le code anonyme a été copié dans le presse-papiers",
                            });
                          }}
                        >
                          Copier
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadInterface;
