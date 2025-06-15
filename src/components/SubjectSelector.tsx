
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calculator, Flask, Globe, PenTool } from 'lucide-react';

export type Subject = 'maths' | 'physique-chimie' | 'francais' | 'anglais';

interface SubjectInfo {
  id: Subject;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const subjects: SubjectInfo[] = [
  {
    id: 'maths',
    name: 'Mathématiques',
    icon: <Calculator className="w-6 h-6" />,
    color: 'bg-blue-100 text-blue-800',
    description: 'Copies de mathématiques'
  },
  {
    id: 'physique-chimie',
    name: 'Physique-Chimie',
    icon: <Flask className="w-6 h-6" />,
    color: 'bg-green-100 text-green-800',
    description: 'Copies de physique-chimie'
  },
  {
    id: 'francais',
    name: 'Français',
    icon: <PenTool className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-800',
    description: 'Copies de français'
  },
  {
    id: 'anglais',
    name: 'Anglais',
    icon: <Globe className="w-6 h-6" />,
    color: 'bg-orange-100 text-orange-800',
    description: 'Copies d\'anglais'
  }
];

interface SubjectSelectorProps {
  onSubjectSelect: (subject: Subject) => void;
  selectedSubject?: Subject;
}

const SubjectSelector = ({ onSubjectSelect, selectedSubject }: SubjectSelectorProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Sélection de la matière</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedSubject === subject.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSubjectSelect(subject.id)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-full ${subject.color.replace('text-', 'bg-').replace('bg-', 'bg-').replace('-800', '-200')}`}>
                  {subject.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                </div>
                {selectedSubject === subject.id && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    Sélectionnée
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {selectedSubject && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Matière sélectionnée :</strong> {subjects.find(s => s.id === selectedSubject)?.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectSelector;
