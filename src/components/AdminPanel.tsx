import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';

interface ContentItem {
  id: string;
  page: string;
  section: string;
  content: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tools: string[];
  created_at: string;
  updated_at: string;
  start_date: string;
  delivery_date?: string;
  status: string;
  client_satisfaction: boolean;
  is_delivered_on_time: boolean;
}

const AdminPanel = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    tools: ''
  });
  const [showNewProject, setShowNewProject] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContent();
    fetchProjects();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('page', { ascending: true });

      if (error) {
        console.error('Error fetching content:', error);
        return;
      }

      setContentItems(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects((data || []).map(project => ({
        ...project,
        tools: (project as any).tools || []
      })));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const startEditContent = (item: ContentItem) => {
    setEditingContent(item.id);
    setEditValues({ [item.id]: item.content });
  };

  const saveContentEdit = async (item: ContentItem) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ content: editValues[item.id] })
        .eq('id', item.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update content",
          variant: "destructive"
        });
        return;
      }

      setContentItems(prev => 
        prev.map(content => 
          content.id === item.id 
            ? { ...content, content: editValues[item.id] }
            : content
        )
      );

      setEditingContent(null);
      setEditValues({});
      
      toast({
        title: "Success",
        description: "Content updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelContentEdit = () => {
    setEditingContent(null);
    setEditValues({});
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive"
        });
        return;
      }

      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      toast({
        title: "Success",
        description: "Project deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addProject = async () => {
    if (!newProject.title || !newProject.category) {
      toast({
        title: "Error",
        description: "Title and category are required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const toolsArray = newProject.tools.split(',').map(tool => tool.trim()).filter(Boolean);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: newProject.title,
          description: newProject.description,
          category: newProject.category,
          tools: toolsArray,
          status: 'completed',
          client_satisfaction: true,
          is_delivered_on_time: true
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add project",
          variant: "destructive"
        });
        return;
      }

      setProjects(prev => [{...data, tools: (data as any).tools || []}, ...prev]);
      setNewProject({
        title: '',
        description: '',
        category: '',
        tools: ''
      });
      setShowNewProject(false);
      
      toast({
        title: "Success",
        description: "Project added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const groupedContent = contentItems.reduce((acc, item) => {
    if (!acc[item.page]) {
      acc[item.page] = [];
    }
    acc[item.page].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Admin Panel</h1>
        <p className="text-muted-foreground">Manage site content and projects</p>
      </div>

      {/* Content Management */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Site Content</h2>
        
        {Object.entries(groupedContent).map(([page, items]) => (
          <Card key={page}>
            <CardHeader>
              <CardTitle className="capitalize">{page} Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{item.section.replace('_', ' ')}</h4>
                    {editingContent === item.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveContentEdit(item)}
                          disabled={loading}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelContentEdit}
                          disabled={loading}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditContent(item)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  
                  {editingContent === item.id ? (
                    item.section === 'content' ? (
                      <Textarea
                        value={editValues[item.id] || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="min-h-[200px]"
                      />
                    ) : (
                      <Input
                        value={editValues[item.id] || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, [item.id]: e.target.value }))}
                      />
                    )
                  ) : (
                    <div className="text-muted-foreground">
                      {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Project Management</h2>
          <Button onClick={() => setShowNewProject(!showNewProject)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Add New Project Form */}
        {showNewProject && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              />
              <Input
                placeholder="Category"
                value={newProject.category}
                onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
              />
              <Input
                placeholder="Tools (comma separated)"
                value={newProject.tools}
                onChange={(e) => setNewProject(prev => ({ ...prev, tools: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button onClick={addProject} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
                <Button variant="outline" onClick={() => setShowNewProject(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-muted-foreground mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {project.category}
                      </span>
                      {project.tools && project.tools.map((tool, index) => (
                        <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;