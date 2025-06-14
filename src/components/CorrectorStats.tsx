
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, CheckCircle } from "lucide-react";

interface Copy {
  id: string;
  anonymousId: string;
  filename: string;
  uploadDate: string;
  status: 'pending' | 'in_progress' | 'corrected';
  score?: number;
  comments?: string;
}

interface CorrectorStatsProps {
  copies: Copy[];
}

const CorrectorStats = ({ copies }: CorrectorStatsProps) => {
  const pendingCount = copies.filter(c => c.status === 'pending').length;
  const inProgressCount = copies.filter(c => c.status === 'in_progress').length;
  const correctedCount = copies.filter(c => c.status === 'corrected').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Copies à corriger</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
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
              <p className="text-2xl font-bold">{inProgressCount}</p>
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
  );
};

export default CorrectorStats;
