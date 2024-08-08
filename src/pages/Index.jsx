import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Kanban, FileText, FolderKanban, Loader } from 'lucide-react'
import AIAssistant from '../components/AIAssistant';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Index = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [newProjectName, setNewProjectName] = useState('');
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newFile, setNewFile] = useState(null);
  const queryClient = useQueryClient();

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from('projects').select('id, name, description, created_at');
    if (error) throw error;
    return data;
  }, []);

  const fetchDocuments = useCallback(async () => {
    const { data, error } = await supabase.from('documents').select('id, name, created_at');
    if (error) throw error;
    return data;
  }, []);

  const fetchFiles = useCallback(async () => {
    const { data, error } = await supabase.from('files').select('id, name, file_type, created_at');
    if (error) throw error;
    return data;
  }, []);

  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const { data: documents, isLoading: documentsLoading, error: documentsError } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });

  const { data: files, isLoading: filesLoading, error: filesError } = useQuery({
    queryKey: ['files'],
    queryFn: fetchFiles,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (name) => {
      const { error } = await supabase.from('projects').insert([{ name }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewProjectName('');
    },
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (name) => {
      const { error } = await supabase.from('documents').insert([{ name }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setNewDocumentName('');
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file) => {
      const { error } = await supabase.storage.from('files').upload(`${Date.now()}_${file.name}`, file);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setNewFile(null);
    },
  });

  const isLoading = projectsLoading || documentsLoading || filesLoading;
  const error = projectsError || documentsError || filesError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">An error occurred. Please try again later.</p>
      </div>
    );
  }

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
                <Button onClick={() => createProjectMutation.mutate(newProjectName)} disabled={createProjectMutation.isLoading}>
                  {createProjectMutation.isLoading ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Your Projects</h3>
                <ul className="list-disc pl-5 mt-2">
                  {projects && projects.map((project) => (
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
                <Button onClick={() => createDocumentMutation.mutate(newDocumentName)} disabled={createDocumentMutation.isLoading}>
                  {createDocumentMutation.isLoading ? 'Creating...' : 'Create Document'}
                </Button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Your Documents</h3>
                <ul className="list-disc pl-5 mt-2">
                  {documents && documents.map((document) => (
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
                <Button onClick={() => uploadFileMutation.mutate(newFile)} disabled={uploadFileMutation.isLoading || !newFile}>
                  {uploadFileMutation.isLoading ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Your Files</h3>
                <ul className="list-disc pl-5 mt-2">
                  {files && files.map((file) => (
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
