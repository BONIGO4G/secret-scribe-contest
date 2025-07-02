import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Copy, Trash2, User, Mail, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeacherAccount {
  id: string;
  name: string;
  email: string;
  subject: string;
  accessCode: string;
  createdAt: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

const TeacherAccountManager = () => {
  const [teachers, setTeachers] = useState<TeacherAccount[]>([
    {
      id: '1',
      name: 'Prof. Martin Dupont',
      email: 'martin.dupont@education.fr',
      subject: 'Mathématiques',
      accessCode: 'CORR-ABC123-XYZ789',
      createdAt: '2024-01-15',
      status: 'active',
      lastLogin: '2024-01-20'
    },
    {
      id: '2',
      name: 'Prof. Sophie Bernard',
      email: 'sophie.bernard@education.fr',
      subject: 'Physique-Chimie',
      accessCode: 'CORR-DEF456-UVW012',
      createdAt: '2024-01-16',
      status: 'active'
    }
  ]);

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    subject: ''
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showCodes, setShowCodes] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const subjects = [
    'Mathématiques',
    'Physique-Chimie',
    'Français',
    'Anglais',
    'Histoire-Géographie',
    'Sciences de la Vie et de la Terre',
    'Philosophie'
  ];

  const generateAccessCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `CORR-${timestamp}-${random}`;
  };

  const handleCreateAccount = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subject) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newAccount: TeacherAccount = {
      id: Date.now().toString(),
      name: newTeacher.name,
      email: newTeacher.email,
      subject: newTeacher.subject,
      accessCode: generateAccessCode(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setTeachers(prev => [...prev, newAccount]);
    setNewTeacher({ name: '', email: '', subject: '' });
    setShowDialog(false);

    toast({
      title: "Compte créé",
      description: `Compte créé pour ${newTeacher.name}. Code d'accès généré.`,
    });
  };

  const copyAccessCode = (code: string, teacherName: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copié",
      description: `Code d'accès de ${teacherName} copié dans le presse-papiers`,
    });
  };

  const toggleCodeVisibility = (teacherId: string) => {
    setShowCodes(prev => ({
      ...prev,
      [teacherId]: !prev[teacherId]
    }));
  };

  const deleteAccount = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    
    toast({
      title: "Compte supprimé",
      description: `Le compte de ${teacher?.name} a été supprimé`,
    });
  };

  const toggleStatus = (teacherId: string) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, status: teacher.status === 'active' ? 'inactive' : 'active' }
        : teacher
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-green-500" />
                Gestion des Comptes Professeurs
              </CardTitle>
              <CardDescription>
                Créez et gérez les comptes des professeurs correcteurs
              </CardDescription>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Nouveau Professeur</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un compte professeur</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations du nouveau professeur
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teacher-name">Nom complet</Label>
                    <Input
                      id="teacher-name"
                      placeholder="Prof. Jean Dupont"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="jean.dupont@education.fr"
                      value={newTeacher.email}
                      onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacher-subject">Matière</Label>
                    <Select value={newTeacher.subject} onValueChange={(value) => setNewTeacher(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une matière" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowDialog(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateAccount}>
                      Créer le compte
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total professeurs</p>
                    <p className="text-2xl font-bold">{teachers.length}</p>
                  </div>
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Comptes actifs</p>
                    <p className="text-2xl font-bold">{teachers.filter(t => t.status === 'active').length}</p>
                  </div>
                  <User className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Dernière connexion</p>
                    <p className="text-2xl font-bold">{teachers.filter(t => t.lastLogin).length}</p>
                  </div>
                  <User className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professeur</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Code d'accès</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {teacher.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center w-fit">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {teacher.subject}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                        {showCodes[teacher.id] ? teacher.accessCode : '••••••••••••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCodeVisibility(teacher.id)}
                      >
                        {showCodes[teacher.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyAccessCode(teacher.accessCode, teacher.name)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={teacher.status === 'active' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(teacher.id)}
                    >
                      {teacher.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {teacher.lastLogin ? (
                      <span className="text-sm text-green-600">
                        {new Date(teacher.lastLogin).toLocaleDateString('fr-FR')}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Jamais connecté</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAccount(teacher.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAccountManager;