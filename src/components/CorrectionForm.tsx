
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Download, FileText, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CorrectionFormProps {
  onClose: () => void;
}

const CorrectionForm = ({ onClose }: CorrectionFormProps) => {
  const [formData, setFormData] = useState({
    matricule: '',
    centreComposition: '',
    nomProf: '',
    prenomProf: '',
    etablissementProf: '',
    matiere: 'MATHS',
    note: '',
    fichier: null as File | null,
    copyId: generateUniqueId()
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copies, setCopies] = useState<any[]>([]);
  const [matriculeValid, setMatriculeValid] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Générer le code-barres (simulation - dans un vrai projet, utilisez une vraie lib)
  useEffect(() => {
    const barcodeValue = `${formData.copyId}-${formData.matricule}`;
    if (barcodeValue && barcodeValue.length >= 3 && matriculeValid) {
      setIsGenerating(true);
      // Simulation d'un code-barres
      setTimeout(() => {
        setBarcodeData(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`);
        setIsGenerating(false);
      }, 500);
    } else {
      setBarcodeData(null);
    }
  }, [formData.matricule, formData.copyId, matriculeValid]);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });

    if (name === 'matricule') {
      const isValid = validateMatricule(value);
      setMatriculeValid(isValid || value === '');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 15 * 1024 * 1024) {
      setError('Le fichier doit être inférieur à 15 Mo.');
      return;
    }
    setFormData({ ...formData, fichier: file || null });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    // Validation
    const validations: [boolean, string][] = [
      [!formData.fichier, 'Veuillez sélectionner un fichier.'],
      [parseFloat(formData.note) < 0 || parseFloat(formData.note) > 20, 'La note doit être entre 0 et 20.'],
      [!formData.matricule, 'Le matricule est requis.'],
      [!validateMatricule(formData.matricule), 'Le matricule doit contenir 8 chiffres suivis d\'une lettre (ex: 12345678A).'],
      [!formData.centreComposition, 'Le centre de composition est requis.'],
      [!formData.nomProf || !formData.prenomProf, 'Le nom et prénom du professeur sont requis.'],
      [!formData.etablissementProf, 'L\'établissement du professeur est requis.']
    ];

    for (const [condition, message] of validations) {
      if (condition) {
        setError(message);
        setIsSubmitting(false);
        return;
      }
    }

    // Création de l'objet copie
    const nouvelleCopie = {
      id: formData.copyId,
      matricule: formData.matricule,
      centreComposition: formData.centreComposition,
      nomProf: formData.nomProf,
      prenomProf: formData.prenomProf,
      etablissementProf: formData.etablissementProf,
      matiere: formData.matiere,
      note: parseFloat(formData.note),
      date: new Date().toISOString(),
      barcode: barcodeData
    };

    setCopies([...copies, nouvelleCopie]);

    setTimeout(() => {
      setSuccess(`Copie enregistrée - ID: ${formData.copyId}`);
      toast({
        title: "Copie enregistrée",
        description: `ID: ${formData.copyId}`,
      });
      
      setFormData({
        matricule: '',
        centreComposition: '',
        nomProf: formData.nomProf,
        prenomProf: formData.prenomProf,
        etablissementProf: formData.etablissementProf,
        matiere: 'MATHS',
        note: '',
        fichier: null,
        copyId: generateUniqueId()
      });
      setBarcodeData(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const exportToCSV = () => {
    if (copies.length === 0) {
      setError('Aucune donnée à exporter');
      return;
    }

    const csvData = copies.map(copie => ({
      'ID Copie': copie.id,
      'Matricule Étudiant': copie.matricule,
      'Centre Composition': copie.centreComposition,
      'Professeur': `${copie.prenomProf} ${copie.nomProf}`,
      'Établissement Professeur': copie.etablissementProf,
      'Matière': copie.matiere,
      'Note': copie.note,
      'Date': new Date(copie.date).toLocaleString()
    }));

    // Conversion simple en CSV
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csv = headers + '\n' + rows;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resultats-copies_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Correcteur de Copies</CardTitle>
              <CardDescription className="text-slate-200 mt-1">
                Système de gestion des copies d'examen
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-white hover:bg-white/20 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Messages d'alerte */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="font-medium text-red-800">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="font-medium text-green-800">{success}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Professeur */}
            <div className="space-y-4">
              <h3 className="font-medium text-slate-700">Informations du Professeur</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Nom</Label>
                  <Input
                    value={formData.nomProf}
                    onChange={(e) => handleChange('nomProf', e.target.value)}
                    required
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <Label>Prénom</Label>
                  <Input
                    value={formData.prenomProf}
                    onChange={(e) => handleChange('prenomProf', e.target.value)}
                    required
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <Label>Établissement</Label>
                  <Input
                    value={formData.etablissementProf}
                    onChange={(e) => handleChange('etablissementProf', e.target.value)}
                    required
                    placeholder="Votre établissement"
                  />
                </div>
              </div>
            </div>
            
            {/* Section Étudiant */}
            <div className="space-y-4">
              <h3 className="font-medium text-slate-700">Informations de la Copie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Matricule Étudiant</Label>
                  <Input
                    value={formData.matricule}
                    onChange={(e) => handleChange('matricule', e.target.value)}
                    required
                    className={!matriculeValid && formData.matricule ? 'border-red-500' : ''}
                    placeholder="12345678A"
                    maxLength={9}
                  />
                  {!matriculeValid && formData.matricule && (
                    <p className="mt-1 text-xs text-red-500">Format: 8 chiffres + 1 lettre</p>
                  )}
                </div>
                <div>
                  <Label>Centre de Composition</Label>
                  <Select value={formData.centreComposition} onValueChange={(value) => handleChange('centreComposition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un centre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LYON">Lyon</SelectItem>
                      <SelectItem value="PARIS">Paris</SelectItem>
                      <SelectItem value="MARSEILLE">Marseille</SelectItem>
                      <SelectItem value="TOULOUSE">Toulouse</SelectItem>
                      <SelectItem value="NANTES">Nantes</SelectItem>
                      <SelectItem value="STRASBOURG">Strasbourg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Matière</Label>
                  <Select value={formData.matiere} onValueChange={(value) => handleChange('matiere', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MATHS">Mathématiques</SelectItem>
                      <SelectItem value="FR">Français</SelectItem>
                      <SelectItem value="PC">Physique-Chimie</SelectItem>
                      <SelectItem value="HG">Histoire-Géo</SelectItem>
                      <SelectItem value="ANG">Anglais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Note (0-20)</Label>
                  <Input
                    type="number"
                    value={formData.note}
                    onChange={(e) => handleChange('note', e.target.value)}
                    required
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="15.5"
                  />
                </div>
              </div>
            </div>
            
            {/* ID de la copie */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">ID de la copie:</span>
              <Badge variant="outline">{formData.copyId}</Badge>
            </div>
            
            {/* Code-barres */}
            {(formData.matricule || formData.copyId) && (
              <div className="space-y-2">
                <Label>Code-barres</Label>
                <div className="bg-white p-4 border rounded-lg">
                  {barcodeData ? (
                    <div className="text-center">
                      <div className="bg-gray-200 h-12 flex items-center justify-center rounded">
                        Code-barres: {formData.copyId}-{formData.matricule}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-sm">
                      {(!matriculeValid || formData.matricule.length < 9) 
                        ? "Entrez un matricule valide pour générer le code-barres" 
                        : "Génération en cours..."}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Fichier */}
            <div className="space-y-2">
              <Label>Fichier de la copie (max 15 Mo)</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="mb-1 text-sm text-slate-500">
                  <span className="font-medium">Cliquez pour télécharger</span> ou glissez-déposez
                </p>
                <p className="text-xs text-slate-400">PDF, JPG, PNG (MAX. 15MB)</p>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="mt-2"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              {formData.fichier && (
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Fichier sélectionné:</span> {formData.fichier.name}
                </p>
              )}
            </div>
            
            {/* Boutons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer la copie'}
              </Button>
              
              <Button
                type="button"
                onClick={exportToCSV}
                disabled={copies.length === 0}
                variant="outline"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
              
              <Button
                type="button"
                disabled={copies.length === 0}
                variant="outline"
                className="bg-slate-600 hover:bg-slate-700 text-white"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Générer PDF
              </Button>
            </div>
          </form>
          
          {/* Liste des copies */}
          {copies.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-slate-700">Copies enregistrées ({copies.length})</h3>
                <span className="text-sm text-slate-500">
                  Dernière: {new Date(copies[copies.length-1].date).toLocaleTimeString()}
                </span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">ID</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Matricule</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Matière</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Note</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Centre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...copies].reverse().map((copie, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-2 text-sm font-mono">{copie.id}</td>
                        <td className="px-4 py-2 text-sm font-mono">{copie.matricule}</td>
                        <td className="px-4 py-2 text-sm">{copie.matiere}</td>
                        <td className="px-4 py-2 text-sm font-bold">{copie.note}/20</td>
                        <td className="px-4 py-2 text-sm">{copie.centreComposition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Canvas caché pour le code-barres */}
      <canvas ref={canvasRef} style={{display: 'none'}} />
    </div>
  );
};

// Fonction pour générer un ID unique pour chaque copie
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${randomPart}`.toUpperCase();
};

// Fonction pour valider le format du matricule (8 chiffres + 1 lettre)
const validateMatricule = (matricule: string) => {
  const regex = /^\d{8}[A-Za-z]$/;
  return regex.test(matricule);
};

export default CorrectionForm;
