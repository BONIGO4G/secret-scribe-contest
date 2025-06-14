
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Copy {
  id: string;
  anonymousId: string;
  filename: string;
  uploadDate: string;
  status: 'pending' | 'in_progress' | 'corrected';
  score?: number;
  comments?: string;
}

interface CorrectorProgressProps {
  copies: Copy[];
}

const CorrectorProgress = ({ copies }: CorrectorProgressProps) => {
  const correctedCount = copies.filter(c => c.status === 'corrected').length;
  const progressPercentage = copies.length > 0 ? (correctedCount / copies.length) * 100 : 0;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Progression globale</h3>
          <span className="text-sm text-muted-foreground">{correctedCount}/{copies.length}</span>
        </div>
        <Progress value={progressPercentage} className="w-full" />
      </CardContent>
    </Card>
  );
};

export default CorrectorProgress;
