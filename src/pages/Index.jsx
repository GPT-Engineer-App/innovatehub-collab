import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Kanban, FileText, FolderKanban } from 'lucide-react'
import AIAssistant from '../components/AIAssistant';
import { supabase } from '../lib/supabase';

const Index = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    fetchProjects();
    fetchDocuments();
    fetchFiles();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) console.error('Error fetching projects:', error);
    else setProjects(data);
  };

  const fetchDocuments = async () => {
    const { data, error } = await supabase.from('documents').select('*');
    if (error) console.error('Error fetching documents:', error);
    else setDocuments(data);
  };

  const fetchFiles = async () => {
    const { data, error } = await supabase.from('files').select('*');
    if (error) console.error('Error fetching files:', error);
    else setFiles(data);
  };

  const createProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name: newProjectName }]);
    if (error) console.error('Error creating project:', error);
    else {
      setNewProjectName('');
      fetchProjects();
    }
  };

  const createDocument = async () => {
    const { data, error } = await supabase
      .from('documents')
      .insert([{ name: newDocumentName }]);
    if (error) console.error('Error creating document:', error);
    else {
      setNewDocumentName('');
      fetchDocuments();
    }
  };

  const uploadFile = async () => {
    if (!newFile) return;
    const { data, error } = await supabase.storage
      .from('files')
      .upload(`${Date.now()}_${newFile.name}`, newFile);
    if (error) console.error('Error uploading file:', error);
    else {
      setNewFile(null);
      fetchFiles();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-primary">InnovateHub Collab</h1>
        <p className="text-xl text-center text-gray-600 mt-2">Your all-in-one workspace for innovation</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-2/3">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">
            <Kanban className="mr-2 h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="files">
            <FolderKanban className="mr-2 h-4 w-4" />
            Files
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage your projects and tasks here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">New Project</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
                <Button onClick={createProject}>Create Project</Button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Your Projects</h3>
                <ul className="list-disc pl-5 mt-2">
                  {projects.map((project) => (
                    <li key={project.id}>{project.name}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Create and manage your documents here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-name">New Document</Label>
                  <Input
                    id="document-name"
                    placeholder="Enter document name"
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                  />
                </div>
                <Button onClick={createDocument}>Create Document</Button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Your Documents</h3>
                <ul className="list-disc pl-5 mt-2">
                  {documents.map((document) => (
                    <li key={document.id}>{document.name}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>Upload and manage your files here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setNewFile(e.target.files[0])}
                  />
                </div>
                <Button onClick={uploadFile}>Upload File</Button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Your Files</h3>
                <ul className="list-disc pl-5 mt-2">
                  {files.map((file) => (
                    <li key={file.id}>{file.name}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
        <div className="w-full md:w-1/3">
          <AIAssistant />
        </div>
      </div>
    </div>
  );
};

export default Index;
