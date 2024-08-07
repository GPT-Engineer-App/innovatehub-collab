import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Kanban, FileText, FolderKanban } from 'lucide-react'
import AIAssistant from '../components/AIAssistant';

const Index = () => {
  const [activeTab, setActiveTab] = useState("projects");

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
              <div className="space-y-2">
                <Label htmlFor="project-name">New Project</Label>
                <Input id="project-name" placeholder="Enter project name" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Create Project</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Create and manage your documents here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="document-name">New Document</Label>
                <Input id="document-name" placeholder="Enter document name" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Create Document</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>Upload and manage your files here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload File</Label>
                <Input id="file-upload" type="file" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Upload File</Button>
            </CardFooter>
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
