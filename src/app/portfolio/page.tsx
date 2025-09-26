'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Github, Calendar, Loader2, Clock, Award } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  content?: string;
  image?: string;
  thumbnailImage?: string;
  startDate?: string;
  endDate?: string;
  tech: string[];
  link?: string;
  github?: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function PortfolioPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Fetch projects
  useEffect(() => {
    if (status !== 'loading') {
      fetchProjects();
    }
  }, [status, session]);

  const fetchProjects = async () => {
    try {
      // If user is admin, fetch all projects from admin endpoint
      const endpoint = session?.user?.isAdmin ? '/api/admin/projects' : '/api/projects';
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        const sortedProjects = data
          .map((p: any) => ({
            ...p,
            tech: JSON.parse(p.tech || '[]')
          }))
          .sort((a: Project, b: Project) => {
            // Sort by order first, then by date
            if (a.order !== b.order) return a.order - b.order;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        setProjects(sortedProjects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Project deleted successfully');
        fetchProjects();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      toast.error('Error deleting project');
    }
  };

  const togglePublish = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !project.published }),
      });

      if (res.ok) {
        toast.success(project.published ? 'Project unpublished' : 'Project published');
        fetchProjects();
      }
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const filteredProjects = projects.filter(p => {
    if (!session && !p.published) return false;
    if (filter === 'published') return p.published;
    if (filter === 'draft') return !p.published;
    return true;
  });

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return null;
    const start = format(new Date(startDate), 'MMM yyyy');
    const end = endDate ? format(new Date(endDate), 'MMM yyyy') : 'Present';
    return start === end ? start : `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-6 lg:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl lg:text-7xl font-thin mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Portfolio
          </h1>
          <p className="text-gray-600 text-lg">
            A collection of projects and experiments
          </p>
        </motion.div>

        {/* Admin Controls */}
        {status === 'authenticated' && session && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Signed in as {session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Filter */}
                <div className="flex gap-2">
                  {(['all', 'published', 'draft'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 text-sm rounded-full transition-all ${
                        filter === f
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>

                <Link
                  href="/admin/projects/new"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sign In Button for non-authenticated users */}
        {status === 'unauthenticated' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 text-center"
          >
            <button
              onClick={() => signIn('github')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Admin Login →
            </button>
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => setSelectedProject(project)}
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Award size={12} />
                    Featured
                  </div>
                )}

                {/* Draft indicator */}
                {!project.published && session && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    Draft
                  </div>
                )}

                {/* Thumbnail Image - 16:9 aspect ratio */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {(project.thumbnailImage || project.image) ? (
                    <>
                      <img
                        src={project.thumbnailImage || project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('image-error');
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-400">{project.title.substring(0, 2).toUpperCase()}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Subtitle & Date */}
                  <div className="mb-3">
                    {project.subtitle && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">
                          {project.subtitle}
                        </span>
                      </div>
                    )}
                    {formatDateRange(project.startDate, project.endDate) && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{formatDateRange(project.startDate, project.endDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full border border-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-xs px-3 py-1 text-gray-400">
                        +{project.tech.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                          onClick={e => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                          onClick={e => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Show created date only if no project dates are set */}
                    {!project.startDate && !project.endDate && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {format(new Date(project.createdAt), 'MMM yyyy')}
                      </span>
                    )}
                  </div>

                  {/* Admin Actions */}
                  {session && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePublish(project);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                      >
                        {project.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        onClick={e => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-400 mb-4 text-lg">No projects yet</p>
            {session && (
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Create your first project
              </Link>
            )}
          </motion.div>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && !session && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Image - 16:9 aspect ratio */}
              {(selectedProject.thumbnailImage || selectedProject.image) && (
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={selectedProject.thumbnailImage || selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {selectedProject.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Award size={12} />
                      Featured Project
                    </div>
                  )}
                </div>
              )}

              <div className="p-8">
                {/* Modal Header */}
                <div className="mb-6">
                  {selectedProject.subtitle && (
                    <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                      {selectedProject.subtitle}
                    </span>
                  )}
                  <h2 className="text-3xl font-bold text-gray-900 mt-2">{selectedProject.title}</h2>
                  {formatDateRange(selectedProject.startDate, selectedProject.endDate) && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDateRange(selectedProject.startDate, selectedProject.endDate)}
                    </p>
                  )}
                </div>

                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{selectedProject.description}</p>
                
                {selectedProject.content && (
                  <div className="prose prose-gray max-w-none mb-6">
                    <ReactMarkdown 
                      className="markdown-content"
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-medium mt-4 mb-2 text-gray-700" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 text-gray-600 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 text-gray-600" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 text-gray-600" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600" {...props} />,
                        code: ({node, ...props}) => {
                          const isInline = !props.children?.toString().includes('\n');
                          return isInline
                            ? <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm" {...props} />
                            : <code className="block bg-gray-100 rounded p-4 mb-4 font-mono text-sm overflow-x-auto" {...props} />;
                        },
                        pre: ({node, ...props}) => <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto" {...props} />,
                      }}
                    >
                      {selectedProject.content}
                    </ReactMarkdown>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tech.map(tech => (
                    <span
                      key={tech}
                      className="text-sm px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full border border-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                  )}
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg rounded-lg transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
