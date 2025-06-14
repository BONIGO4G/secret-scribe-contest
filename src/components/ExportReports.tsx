
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BarChart3, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportReportsProps {
  corrections: Array<{
    id: string;
    anonymousId: string;
    score: number;
    comments: string;
    filename: string;
  }>;
}

const ExportReports = ({ corrections }: ExportReportsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const generateCSVReport = () => {
    const headers = ['ID Anonyme', 'Note', 'Commentaires', 'Fichier'];
    const csvContent = [
      headers.join(','),
      ...corrections.map(c => [
        c.anonymousId,
        c.score,
        `"${c.comments.replace(/"/g, '""')}"`,
        c.filename
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `corrections_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const generateDetailedReport = () => {
    setIsExporting(true);
    
    const statistics = {
      totalCopies: corrections.length,
      averageScore: corrections.reduce((sum, c) => sum + c.score, 0) / corrections.length,
      maxScore: Math.max(...corrections.map(c => c.score)),
      minScore: Math.min(...corrections.map(c => c.score)),
      passRate: corrections.filter(c => c.score >= 10).length / corrections.length * 100
    };

    const reportContent = `
RAPPORT DE CORRECTION DÉTAILLÉ
================================

Date de génération : ${new Date().toLocaleString('fr-FR')}

STATISTIQUES GÉNÉRALES
----------------------
Nombre total de copies : ${statistics.totalCopies}
Note moyenne : ${statistics.averageScore.toFixed(2)}/20
Note maximale : ${statistics.maxScore}/20
Note minimale : ${statistics.minScore}/20
Taux de réussite : ${statistics.passRate.toFixed(1)}%

DÉTAIL DES CORRECTIONS
======================
${corrections.map(c => `
ID Anonyme : ${c.anonymousId}
Note : ${c.score}/20
Fichier : ${c.filename}
Commentaires : ${c.comments}
${'='.repeat(50)}
`).join('')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rapport_detaille_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();

    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Rapport généré",
        description: "Le rapport détaillé a été téléchargé avec succès.",
      });
    }, 1000);
  };

  const statistics = corrections.length > 0 ? {
    totalCopies: corrections.length,
    averageScore: corrections.reduce((sum, c) => sum + c.score, 0) / corrections.length,
    maxScore: Math.max(...corrections.map(c => c.score)),
    minScore: Math.min(...corrections.map(c => c.score)),
    passRate: corrections.filter(c => c.score >= 10).length / corrections.length * 100
  } : null;

  return (
    <div className="space-y-6">
      {/* Statistiques en temps réel */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Copies corrigées</p>
                  <p className="text-2xl font-bold">{statistics.totalCopies}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Moyenne générale</p>
                  <p className="text-2xl font-bold">{statistics.averageScore.toFixed(1)}/20</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux de réussite</p>
                  <p className="text-2xl font-bold">{statistics.passRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Notes extrêmes</p>
                  <p className="text-lg font-bold">{statistics.minScore} - {statistics.maxScore}</p>
                </div>
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Options d'export */}
      <Card>
        <CardHeader>
          <CardTitle>Export des résultats</CardTitle>
          <CardDescription>
            Générez et téléchargez les rapports de correction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Export CSV</h4>
              <p className="text-sm text-muted-foreground">
                Exportez les données au format CSV pour Excel ou autres tableurs
              </p>
              <Button 
                onClick={generateCSVReport}
                disabled={corrections.length === 0}
                className="w-full"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger CSV
              </Button>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Rapport détaillé</h4>
              <p className="text-sm text-muted-foreground">
                Générez un rapport complet avec statistiques et détails
              </p>
              <Button 
                onClick={generateDetailedReport}
                disabled={corrections.length === 0 || isExporting}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isExporting ? 'Génération...' : 'Rapport détaillé'}
              </Button>
            </div>
          </div>
          
          {corrections.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                Aucune correction disponible pour l'export. Corrigez au moins une copie pour activer les exports.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportReports;
