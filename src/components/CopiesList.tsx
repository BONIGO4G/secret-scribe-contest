
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Clock, CheckCircle } from "lucide-react";

interface Copy {
  id: string;
  anonymousId: string;
  filename: string;
  uploadDate: string;
  status: 'pending' | 'in_progress' | 'corrected';
  score?: number;
  comments?: string;
}

interface CopiesListProps {
  copies: Copy[];
  onStartCorrection: (copy: Copy) => void;
}

const CopiesList = ({ copies, onStartCorrection }: CopiesListProps) => {
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

  return (
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
                  onClick={() => onStartCorrection(copy)}
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
  );
};

export default CopiesList;
