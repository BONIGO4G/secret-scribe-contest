import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Minus, Save } from "lucide-react";

interface Criterion {
  id: string;
  name: string;
  maxPoints: number;
  score: number;
  comments: string;
}

interface EvaluationGridProps {
  copyInfo: {
    id: string;
    anonymousId: string;
    filename: string;
  };
  onSave: (score: number, comments: string) => void;
  onCancel: () => void;
  initialScore?: number;
  initialComments?: string;
}

const EvaluationGrid = ({ 
  copyInfo, 
  onSave, 
  onCancel, 
  initialScore = 0, 
  initialComments = "" 
}: EvaluationGridProps) => {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: '1', name: 'Contenu et exactitude', maxPoints: 8, score: 0, comments: '' },
    { id: '2', name: 'Méthodologie', maxPoints: 6, score: 0, comments: '' },
    { id: '3', name: 'Présentation et clarté', maxPoints: 4, score: 0, comments: '' },
    { id: '4', name: 'Respect des consignes', maxPoints: 2, score: 0, comments: '' }
  ]);
  
  const [globalComments, setGlobalComments] = useState(initialComments);

  const updateCriterionScore = (id: string, score: number) => {
    setCriteria(prev => prev.map(c => 
      c.id === id ? { ...c, score: Math.max(0, Math.min(score, c.maxPoints)) } : c
    ));
  };

  const updateCriterionComments = (id: string, comments: string) => {
    setCriteria(prev => prev.map(c => 
      c.id === id ? { ...c, comments } : c
    ));
  };

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  const maxTotalScore = criteria.reduce((sum, c) => sum + c.maxPoints, 0);
  const scorePercentage = (totalScore / maxTotalScore) * 100;

  const handleSave = () => {
    const allComments = [
      globalComments,
      ...criteria.filter(c => c.comments.trim()).map(c => `${c.name}: ${c.comments}`)
    ].filter(Boolean).join('\n\n');
    
    onSave(totalScore, allComments);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec informations de la copie */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Grille d'évaluation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Copie: {copyInfo.anonymousId} • {copyInfo.filename}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                <span className={getScoreColor(totalScore, maxTotalScore)}>
                  {totalScore}/{maxTotalScore}
                </span>
              </div>
              <Progress value={scorePercentage} className="w-32 mt-1" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Critères d'évaluation */}
      <div className="space-y-4">
        {criteria.map((criterion) => (
          <Card key={criterion.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium">{criterion.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Maximum: {criterion.maxPoints} points
                  </p>
                </div>
                <Badge variant="outline" className={getScoreColor(criterion.score, criterion.maxPoints)}>
                  {criterion.score}/{criterion.maxPoints}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`score-${criterion.id}`}>Note attribuée</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateCriterionScore(criterion.id, criterion.score - 0.5)}
                      disabled={criterion.score <= 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      id={`score-${criterion.id}`}
                      type="number"
                      min="0"
                      max={criterion.maxPoints}
                      step="0.5"
                      value={criterion.score}
                      onChange={(e) => updateCriterionScore(criterion.id, parseFloat(e.target.value) || 0)}
                      className="text-center w-20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateCriterionScore(criterion.id, criterion.score + 0.5)}
                      disabled={criterion.score >= criterion.maxPoints}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`comments-${criterion.id}`}>Commentaires spécifiques</Label>
                  <Textarea
                    id={`comments-${criterion.id}`}
                    placeholder="Remarques pour ce critère..."
                    value={criterion.comments}
                    onChange={(e) => updateCriterionComments(criterion.id, e.target.value)}
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Commentaires généraux */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Commentaires généraux</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Commentaires généraux sur la copie, remarques d'ensemble, conseils pour l'étudiant..."
            value={globalComments}
            onChange={(e) => setGlobalComments(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Enregistrer la correction ({totalScore}/20)</span>
        </Button>
      </div>
    </div>
  );
};

export default EvaluationGrid;
