import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, FileText } from 'lucide-react';

declare global {
  interface Window {
    JsBarcode: any;
    Papa: any;
    jsPDF: any;
  }
}

interface FormData {
  matricule: string;
  centreComposition: string;
  nomProf: string;
  prenomProf: string;
  etablissementProf: string;
  notes: {
    maths: string;
    francais: string;
    physiqueChimie: string;
    histoireGeo: string;
    anglais: string;
  };
  fichier: File | null;
  copyId: string;
}

interface Copy {
  id: string;
  matricule: string;
  centreComposition: string;
  nomProf: string;
  prenomProf: string;
  etablissementProf: string;
  notes: {
    maths: number;
    francais: number;
    physiqueChimie: number;
    histoireGeo: number;
    anglais: number;
  };
  moyenne: number;
  mention: string;
  statut: string;
  date: string;
  barcode?: string;
}

const CorrectorInterface = () => {
  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomPart}`.toUpperCase();
  };

  const validateMatricule = (matricule: string) => {
    const regex = /^\d{8}[A-Za-z]$/;
    return regex.test(matricule);
  };

  const calculateMoyenne = (notes: any) => {
    const notesValues = Object.values(notes).map(note => parseFloat(note as string) || 0);
    return notesValues.reduce((sum, note) => sum + note, 0) / notesValues.length;
  };

  const getMention = (moyenne: number) => {
    if (moyenne >= 16) return "Très Bien";
    if (moyenne >= 14) return "Bien";
    if (moyenne >= 12) return "Assez Bien";
    if (moyenne >= 10) return "Passable";
    return "Insuffisant";
  };

  const getStatut = (moyenne: number) => {
    return moyenne >= 12 ? "ADMIS" : "REFUSÉ";
  };

  const [formData, setFormData] = useState<FormData>({
    matricule: '',
    centreComposition: '',
    nomProf: '',
    prenomProf: '',
    etablissementProf: '',
    notes: {
      maths: '',
      francais: '',
      physiqueChimie: '',
      histoireGeo: '',
      anglais: ''
    },
    fichier: null,
    copyId: generateUniqueId()
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copies, setCopies] = useState<Copy[]>([]);
  const [matriculeValid, setMatriculeValid] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculer la moyenne en temps réel
  const currentMoyenne = calculateMoyenne(formData.notes);
  const currentMention = getMention(currentMoyenne);
  const currentStatut = getStatut(currentMoyenne);

  // Charger les scripts externes
  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js');
      } catch (error) {
        console.error('Error loading external scripts:', error);
      }
    };

    loadScripts();
  }, []);

  // Générer le code-barres
  useEffect(() => {
    const barcodeValue = `${formData.copyId}-${formData.matricule}`;
    if (barcodeValue && barcodeValue.length >= 3 && canvasRef.current && matriculeValid && window.JsBarcode) {
      setIsGenerating(true);
      try {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          window.JsBarcode(canvasRef.current, barcodeValue, {
            format: "CODE128",
            displayValue: true,
            fontSize: 14,
            height: 40,
            width: 2,
            margin: 10,
            background: "#ffffff",
            lineColor: "#334155"
          });
          
          const dataURL = canvasRef.current.toDataURL('image/png');
          setBarcodeData(dataURL);
        }
      } catch (e) {
        setError("Erreur lors de la génération du code-barres");
        console.error(e);
      } finally {
        setIsGenerating(false);
      }
    } else {
      setBarcodeData(null);
    }
  }, [formData.matricule, formData.copyId, matriculeValid]);

  const handleChange = (name: string, value: string) => {
    if (name.startsWith('notes.')) {
      const noteField = name.split('.')[1];
      setFormData({ 
        ...formData, 
        notes: { ...formData.notes, [noteField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

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
      [!formData.matricule, 'Le matricule est requis.'],
      [!validateMatricule(formData.matricule), 'Le matricule doit contenir 8 chiffres suivis d\'une lettre (ex: 12345678A).'],
      [!formData.centreComposition, 'Le centre de composition est requis.'],
      [!formData.nomProf || !formData.prenomProf, 'Le nom et prénom du professeur sont requis.'],
      [!formData.etablissementProf, 'L\'établissement du professeur est requis.']
    ];

    // Vérifier qu'au moins une note est saisie
    const hasAnyNote = Object.values(formData.notes).some(note => note !== '');
    if (!hasAnyNote) {
      setError('Veuillez saisir au moins une note.');
      setIsSubmitting(false);
      return;
    }

    // Vérifier que toutes les notes saisies sont valides (0-20)
    for (const [matiere, note] of Object.entries(formData.notes)) {
      if (note !== '') {
        const noteValue = parseFloat(note);
        if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
          setError(`La note de ${matiere} doit être un nombre entre 0 et 20.`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    for (const [condition, message] of validations) {
      if (condition) {
        setError(message);
        setIsSubmitting(false);
        return;
      }
    }

    // Conversion des notes en nombres
    const notesConverted = Object.fromEntries(
      Object.entries(formData.notes).map(([key, value]) => [key, value === '' ? 0 : parseFloat(value)])
    );

    // Création de l'objet copie
    const nouvelleCopie: Copy = {
      id: formData.copyId,
      matricule: formData.matricule,
      centreComposition: formData.centreComposition,
      nomProf: formData.nomProf,
      prenomProf: formData.prenomProf,
      etablissementProf: formData.etablissementProf,
      notes: notesConverted as any,
      moyenne: currentMoyenne,
      mention: currentMention,
      statut: currentStatut,
      date: new Date().toISOString(),
      barcode: barcodeData || undefined
    };

    setCopies([...copies, nouvelleCopie]);

    setTimeout(() => {
      setSuccess(`Copie enregistrée - ID: ${formData.copyId} - Statut: ${currentStatut}`);
      setFormData({
        matricule: '',
        centreComposition: '',
        nomProf: formData.nomProf,
        prenomProf: formData.prenomProf,
        etablissementProf: formData.etablissementProf,
        notes: {
          maths: '',
          francais: '',
          physiqueChimie: '',
          histoireGeo: '',
          anglais: ''
        },
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

    if (!window.Papa) {
      setError('Erreur: PapaParse n\'est pas chargé');
      return;
    }

    const csvData = copies.map(copie => ({
      'ID Copie': copie.id,
      'Matricule Étudiant': copie.matricule,
      'Centre Composition': copie.centreComposition,
      'Professeur': `${copie.prenomProf} ${copie.nomProf}`,
      'Établissement Professeur': copie.etablissementProf,
      'Mathématiques': copie.notes.maths,
      'Français': copie.notes.francais,
      'Physique-Chimie': copie.notes.physiqueChimie,
      'Histoire-Géo': copie.notes.histoireGeo,
      'Anglais': copie.notes.anglais,
      'Moyenne': copie.moyenne.toFixed(2),
      'Mention': copie.mention,
      'Statut': copie.statut,
      'Date': new Date(copie.date).toLocaleString()
    }));

    const csv = window.Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resultats-copies_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (copies.length === 0) {
      setError('Aucune donnée à exporter');
      return;
    }

    if (!window.jsPDF) {
      setError('Erreur: jsPDF n\'est pas chargé');
      return;
    }

    const { jsPDF } = window;
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(16);
    doc.setTextColor(51, 65, 85);
    doc.text('Rapport des Résultats d\'Examen', 148, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Professeur: ${copies[0].prenomProf} ${copies[0].nomProf}`, 14, 25);
    doc.text(`Établissement: ${copies[0].etablissementProf}`, 14, 30);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 148, 30, { align: 'center' });
    
    const headers = [['ID', 'Matricule', 'Centre', 'Maths', 'Français', 'PC', 'HG', 'Anglais', 'Moyenne', 'Mention', 'Statut']];
    const data = copies.map(copie => [
      copie.id,
      copie.matricule,
      copie.centreComposition,
      copie.notes.maths,
      copie.notes.francais,
      copie.notes.physiqueChimie,
      copie.notes.histoireGeo,
      copie.notes.anglais,
      copie.moyenne.toFixed(2),
      copie.mention,
      copie.statut
    ]);
    
    doc.autoTable({
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      margin: { top: 40 }
    });
    
    doc.save(`rapport-resultats_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-6xl">
        <CardHeader className="bg-slate-700 text-white">
          <CardTitle className="text-2xl text-center">Saisie des Résultats d'Examen</CardTitle>
          <p className="text-slate-200 text-center text-sm">
            Système de gestion des notes et résultats
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Professeur */}
            <div className="space-y-2">
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
            <div className="space-y-2">
              <h3 className="font-medium text-slate-700">Informations de l'Étudiant</h3>
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
            </div>
            
            {/* Section Notes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-700">Notes par Matière</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Limite: 0 - 20 points
                  </Badge>
                  <span className="text-xs text-slate-500">Décimales autorisées</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Mathématiques</Label>
                  <Input
                    type="number"
                    value={formData.notes.maths}
                    onChange={(e) => handleChange('notes.maths', e.target.value)}
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="0.00 - 20.00"
                    className="text-center"
                  />
                  <p className="text-xs text-slate-500 mt-1">Sur 20 points</p>
                </div>
                <div>
                  <Label>Français</Label>
                  <Input
                    type="number"
                    value={formData.notes.francais}
                    onChange={(e) => handleChange('notes.francais', e.target.value)}
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="0.00 - 20.00"
                    className="text-center"
                  />
                  <p className="text-xs text-slate-500 mt-1">Sur 20 points</p>
                </div>
                <div>
                  <Label>Physique-Chimie</Label>
                  <Input
                    type="number"
                    value={formData.notes.physiqueChimie}
                    onChange={(e) => handleChange('notes.physiqueChimie', e.target.value)}
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="0.00 - 20.00"
                    className="text-center"
                  />
                  <p className="text-xs text-slate-500 mt-1">Sur 20 points</p>
                </div>
                <div>
                  <Label>Histoire-Géographie</Label>
                  <Input
                    type="number"
                    value={formData.notes.histoireGeo}
                    onChange={(e) => handleChange('notes.histoireGeo', e.target.value)}
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="0.00 - 20.00"
                    className="text-center"
                  />
                  <p className="text-xs text-slate-500 mt-1">Sur 20 points</p>
                </div>
                <div>
                  <Label>Anglais</Label>
                  <Input
                    type="number"
                    value={formData.notes.anglais}
                    onChange={(e) => handleChange('notes.anglais', e.target.value)}
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="0.00 - 20.00"
                    className="text-center"
                  />
                  <p className="text-xs text-slate-500 mt-1">Sur 20 points</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Instructions:</strong> Saisissez les notes obtenues dans chaque matière. 
                  Chaque note doit être comprise entre 0 et 20 points. Les décimales sont autorisées (ex: 15.5).
                </p>
              </div>
            </div>

            {/* Résultats calculés */}
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium text-slate-700">Résultats Calculés</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Moyenne</p>
                  <p className="text-2xl font-bold text-slate-700">{currentMoyenne.toFixed(2)}/20</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600">Mention</p>
                  <Badge variant={currentMoyenne >= 12 ? "default" : "secondary"} className="text-sm">
                    {currentMention}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600">Statut</p>
                  <Badge variant={currentStatut === "ADMIS" ? "default" : "destructive"} className="text-sm">
                    {currentStatut}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* ID de la copie */}
            <div className="flex items-center text-sm">
              <span className="text-slate-600 mr-2">ID de la copie:</span>
              <Badge variant="outline">{formData.copyId}</Badge>
            </div>
            
            {/* Code-barres */}
            {(formData.matricule || formData.copyId) && (
              <div className="space-y-2">
                <Label>Code-barres</Label>
                <Card className="p-4">
                  {barcodeData ? (
                    <img src={barcodeData} alt="Code-barres" className="max-w-full" />
                  ) : (
                    <div className="py-6 text-center text-slate-400 text-sm">
                      {(!matriculeValid || formData.matricule.length < 9) 
                        ? "Entrez un matricule valide pour générer le code-barres" 
                        : "Génération en cours..."}
                    </div>
                  )}
                </Card>
              </div>
            )}
            
            {/* Fichier */}
            <div className="space-y-2">
              <Label>Fichier de la copie (max 15 Mo)</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 mb-1">
                  <span className="font-medium">Cliquez pour télécharger</span> ou glissez-déposez
                </p>
                <p className="text-xs text-slate-400">PDF, JPG, PNG (MAX. 15MB)</p>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  required 
                  className="mt-2" 
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
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les résultats'}
              </Button>
              
              <Button
                type="button"
                onClick={exportToCSV}
                disabled={copies.length === 0}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
              
              <Button
                type="button"
                onClick={exportToPDF}
                disabled={copies.length === 0}
                variant="outline"
                className="border-slate-600 text-slate-600 hover:bg-slate-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                Générer PDF
              </Button>
            </div>
          </form>
          
          {/* Liste des copies */}
          {copies.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-slate-700">Résultats enregistrés ({copies.length})</h3>
                <span className="text-sm text-slate-500">Dernière: {new Date(copies[copies.length-1].date).toLocaleTimeString()}</span>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Matricule</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Centre</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Moyenne</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Mention</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-700">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...copies].reverse().map((copie, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-2 text-sm font-mono">{copie.matricule}</td>
                        <td className="px-4 py-2 text-sm">{copie.centreComposition}</td>
                        <td className="px-4 py-2 text-sm font-bold">{copie.moyenne.toFixed(2)}/20</td>
                        <td className="px-4 py-2 text-sm">
                          <Badge variant={copie.moyenne >= 12 ? "default" : "secondary"} className="text-xs">
                            {copie.mention}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <Badge variant={copie.statut === "ADMIS" ? "default" : "destructive"} className="text-xs">
                            {copie.statut}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <canvas ref={canvasRef} style={{display: 'none'}} width={400} height={100} />
    </div>
  );
};

export default CorrectorInterface;
