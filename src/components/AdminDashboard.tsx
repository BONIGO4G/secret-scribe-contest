
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, Upload, Users, BarChart3, Hash, ArrowLeft } from 'lucide-react';
import UploadInterface from './UploadInterface';
import ExportReports from './ExportReports';
import UniqueCodeGenerator from './UniqueCodeGenerator';
import TeacherAccountManager from './TeacherAccountManager';
import { Copy } from '../App';

interface AdminDashboardProps {
  onReturn: () => void;
}

const AdminDashboard = ({ onReturn }: AdminDashboardProps) => {
  const [mockCorrections] = useState<Array<{
    id: string;
    anonymousId: string;
    score: number;
    comments: string;
    filename: string;
  }>>([
    { id: '1', anonymousId: 'ANON-ABC123', score: 15, comments: 'Très bon travail', filename: 'copie1.pdf' },
    { id: '2', anonymousId: 'ANON-DEF456', score: 12, comments: 'Travail correct', filename: 'copie2.pdf' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Administration</h2>
            <p className="text-gray-600">
              Interface complète de gestion du système de concours
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={onReturn}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Professeurs</span>
          </TabsTrigger>
          <TabsTrigger value="codes" className="flex items-center space-x-2">
            <Hash className="w-4 h-4" />
            <span>Codes</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Rapports</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <UploadInterface />
        </TabsContent>

        <TabsContent value="teachers">
          <TeacherAccountManager />
        </TabsContent>

        <TabsContent value="codes">
          <UniqueCodeGenerator />
        </TabsContent>

        <TabsContent value="reports">
          <ExportReports corrections={mockCorrections} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du système</CardTitle>
              <CardDescription>
                Configuration générale de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interface de paramètres en développement
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
