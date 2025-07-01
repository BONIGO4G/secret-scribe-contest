import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Download, Calculator } from 'lucide-react';
import { toast } from 'sonner';

interface StudentResult {
  id: string;
  nom: string;
  prenom: string;
  matricule: string;
  notes: number[];
  moyenne: number;
  statut: 'admis' | 'echec';
}

const StudentResultsManager = () => {
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    matricule: '',
    note1: '',
    note2: '',
    note3: '',
    note4: ''
  });

  const calculateAverage = (notes: number[]) => {
    return notes.reduce((sum, note) => sum + note, 0) / notes.length;
  };

  const handleAddStudent = () => {
    const { nom, prenom, matricule, note1, note2, note3, note4 } = formData;
    
    if (!nom || !prenom || !matricule || !note1 || !note2 || !note3 || !note4) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const notes = [parseFloat(note1), parseFloat(note2), parseFloat(note3), parseFloat(note4)];
    
    if (notes.some(note => isNaN(note) || note < 0 || note > 20)) {
      toast.error('Les notes doivent être entre 0 et 20');
      return;
    }

    const moyenne = calculateAverage(notes);
    const statut = moyenne >= 10 ? 'admis' : 'echec';

    const newStudent: StudentResult = {
      id: Date.now().toString(),
      nom,
      prenom,
      matricule,
      notes,
      moyenne: Math.round(moyenne * 100) / 100,
      statut
    };

    setStudents(prev => [...prev, newStudent]);
    setFormData({
      nom: '',
      prenom: '',
      matricule: '',
      note1: '',
      note2: '',
      note3: '',
      note4: ''
    });

    toast.success(`Étudiant ajouté - ${statut.toUpperCase()}`);
  };

  const generatePDF = (student: StudentResult) => {
    const pdfContent = `
RÉSULTATS DE L'ÉTUDIANT

Nom: ${student.nom}
Prénom: ${student.prenom}
Matricule: ${student.matricule}

NOTES:
- Note 1: ${student.notes[0]}/20
- Note 2: ${student.notes[1]}/20  
- Note 3: ${student.notes[2]}/20
- Note 4: ${student.notes[3]}/20

MOYENNE: ${student.moyenne}/20

RÉSULTAT: ${student.statut.toUpperCase()}
${student.statut === 'admis' ? 'Félicitations!' : 'Échec - Rattrapage nécessaire'}

Date de génération: ${new Date().toLocaleDateString('fr-FR')}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultats_${student.matricule}_${student.nom}_${student.prenom}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Fichier des résultats téléchargé');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Saisie des résultats</span>
          </CardTitle>
          <CardDescription>
            Ajoutez les données d'un étudiant et ses notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                placeholder="Nom de famille"
              />
            </div>
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                placeholder="Prénom"
              />
            </div>
            <div>
              <Label htmlFor="matricule">Matricule</Label>
              <Input
                id="matricule"
                value={formData.matricule}
                onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                placeholder="Numéro matricule"
              />
            </div>
            <div>
              <Label>Moyenne</Label>
              <div className="flex items-center h-10 px-3 rounded-md border bg-muted text-sm">
                <Calculator className="w-4 h-4 mr-2" />
                Calculée automatiquement
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="note1">Note 1 (/20)</Label>
              <Input
                id="note1"
                type="number"
                min="0"
                max="20"
                step="0.25"
                value={formData.note1}
                onChange={(e) => setFormData({...formData, note1: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="note2">Note 2 (/20)</Label>
              <Input
                id="note2"
                type="number"
                min="0"
                max="20"
                step="0.25"
                value={formData.note2}
                onChange={(e) => setFormData({...formData, note2: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="note3">Note 3 (/20)</Label>
              <Input
                id="note3"
                type="number"
                min="0"
                max="20"
                step="0.25"
                value={formData.note3}
                onChange={(e) => setFormData({...formData, note3: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="note4">Note 4 (/20)</Label>
              <Input
                id="note4"
                type="number"
                min="0"
                max="20"
                step="0.25"
                value={formData.note4}
                onChange={(e) => setFormData({...formData, note4: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>

          <Button onClick={handleAddStudent} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter l'étudiant
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des résultats</CardTitle>
          <CardDescription>
            {students.length} étudiant(s) enregistré(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun résultat enregistré
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono">{student.matricule}</TableCell>
                    <TableCell className="font-medium">{student.nom}</TableCell>
                    <TableCell>{student.prenom}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {student.notes.join(' - ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">{student.moyenne}/20</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={student.statut === 'admis' ? 'default' : 'destructive'}
                      >
                        {student.statut.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => generatePDF(student)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResultsManager;