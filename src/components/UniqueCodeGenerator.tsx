
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Download, Hash, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedCode {
  id: string;
  code: string;
  type: string;
  timestamp: string;
  used: boolean;
}

const UniqueCodeGenerator = () => {
  const [codeType, setCodeType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [prefix, setPrefix] = useState<string>("");
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const codeTypes = [
    { value: "candidate", label: "Code Candidat", prefix: "CAND" },
    { value: "session", label: "Code Session", prefix: "SESS" },
    { value: "corrector", label: "Code Correcteur", prefix: "CORR" },
    { value: "exam", label: "Code Examen", prefix: "EXAM" },
    { value: "access", label: "Code d'Accès", prefix: "ACC" },
  ];

  const generateCode = (type: string, customPrefix?: string) => {
    const selectedType = codeTypes.find(t => t.value === type);
    const basePrefix = customPrefix || selectedType?.prefix || "CODE";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${basePrefix}-${timestamp}-${random}`;
  };

  const handleGenerate = async () => {
    if (!codeType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de code",
        variant: "destructive",
      });
      return;
    }

    if (quantity < 1 || quantity > 1000) {
      toast({
        title: "Erreur",
        description: "La quantité doit être entre 1 et 1000",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulation de génération asynchrone
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newCodes: GeneratedCode[] = [];
    for (let i = 0; i < quantity; i++) {
      newCodes.push({
        id: Date.now().toString() + i,
        code: generateCode(codeType, prefix || undefined),
        type: codeTypes.find(t => t.value === codeType)?.label || codeType,
        timestamp: new Date().toLocaleString('fr-FR'),
        used: false
      });
    }

    setGeneratedCodes(prev => [...newCodes, ...prev]);
    setIsGenerating(false);

    toast({
      title: "Codes générés",
      description: `${quantity} code(s) généré(s) avec succès`,
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copié",
      description: "Le code a été copié dans le presse-papiers",
    });
  };

  const copyAllCodes = () => {
    const allCodes = generatedCodes.map(gc => gc.code).join('\n');
    navigator.clipboard.writeText(allCodes);
    toast({
      title: "Tous les codes copiés",
      description: `${generatedCodes.length} codes copiés dans le presse-papiers`,
    });
  };

  const exportCodes = () => {
    const csvContent = [
      'Code,Type,Date de génération,Statut',
      ...generatedCodes.map(gc => `${gc.code},${gc.type},${gc.timestamp},${gc.used ? 'Utilisé' : 'Disponible'}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `codes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export réussi",
      description: "Les codes ont été exportés en CSV",
    });
  };

  const markAsUsed = (id: string) => {
    setGeneratedCodes(prev => 
      prev.map(gc => gc.id === id ? { ...gc, used: !gc.used } : gc)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Hash className="w-5 h-5 mr-2 text-purple-500" />
            Générateur de Codes Uniques
          </CardTitle>
          <CardDescription>
            Générez des codes uniques sécurisés pour différents usages du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="code-type">Type de code</Label>
              <Select value={codeType} onValueChange={setCodeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {codeTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <Label htmlFor="prefix">Préfixe personnalisé (optionnel)</Label>
              <Input
                id="prefix"
                placeholder="ex: CONC2024"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                maxLength={10}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !codeType}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Hash className="w-4 h-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      {generatedCodes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total généré</p>
                  <p className="text-2xl font-bold">{generatedCodes.length}</p>
                </div>
                <Hash className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Codes utilisés</p>
                  <p className="text-2xl font-bold">{generatedCodes.filter(gc => gc.used).length}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Codes disponibles</p>
                  <p className="text-2xl font-bold">{generatedCodes.filter(gc => !gc.used).length}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des codes générés */}
      {generatedCodes.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Codes générés</CardTitle>
                <CardDescription>
                  Gérez et suivez l'utilisation de vos codes
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={copyAllCodes}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copier tout
                </Button>
                <Button variant="outline" onClick={exportCodes}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {generatedCodes.map((gc) => (
                <div key={gc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm">
                      {gc.code}
                    </code>
                    <Badge variant={gc.used ? "default" : "outline"}>
                      {gc.type}
                    </Badge>
                    <span className="text-sm text-gray-500">{gc.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={gc.used ? "destructive" : "secondary"}>
                      {gc.used ? "Utilisé" : "Disponible"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode(gc.code)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsUsed(gc.id)}
                    >
                      {gc.used ? "Marquer disponible" : "Marquer utilisé"}
                    </Button>
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

export default UniqueCodeGenerator;
