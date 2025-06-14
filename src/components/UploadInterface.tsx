
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

const UploadInterface = () => {
  return (
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
  );
};

export default UploadInterface;
