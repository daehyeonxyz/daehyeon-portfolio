'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, Home, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Project {
  id: string
  title: string
  description: string
  featured: boolean
  published: boolean
  createdAt: string
  tech: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user?.isAdmin) {
      router.push('/')
      return
    }
    fetchProjects()
  }, [session, status, router])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus })
      })
      
      if (res.ok) {
        toast.success('Project updated')
        fetchProjects()
      }
    } catch (error) {
      toast.error('Failed to update project')
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentStatus })
      })
      
      if (res.ok) {
        toast.success('Project updated')
        fetchProjects()
      }
    } catch (error) {
      toast.error('Failed to update project')
    }
  }

  const deleteProject = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        toast.success('Project deleted')
        fetchProjects()
      }
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                Logged in as {session.user.name || session.user.email}
              </span>
              <Link href="/">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors flex items-center gap-2">
                  <Home size={16} />
                  Home
                </button>
              </Link>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Add New Project Button */}
        <div className="mb-8">
          <Link href="/admin/projects/new">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors flex items-center gap-2">
              <Plus size={20} />
              Add New Project
            </button>
          </Link>
        </div>

        {/* Projects Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Projects ({projects.length})</h2>
          </div>
          
          {projects.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p>No projects yet</p>
              <Link href="/admin/projects/new">
                <button className="mt-4 text-blue-400 hover:text-blue-300">
                  Create your first project
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {projects.map((project) => {
                    const techList = project.tech ? JSON.parse(project.tech) : []
                    return (
                      <tr key={project.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{project.title}</div>
                          {techList.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {techList.map((tech: string) => (
                                <span key={tech} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          {project.description}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleFeatured(project.id, project.featured)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              project.featured 
                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                                : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                            }`}
                          >
                            {project.featured ? 'Featured' : 'Regular'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => togglePublished(project.id, project.published)}
                            className={`p-2 rounded-lg transition-colors ${
                              project.published 
                                ? 'text-green-400 hover:bg-green-500/20' 
                                : 'text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            {project.published ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/admin/projects/${project.id}/edit`}>
                              <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                                <Edit size={18} />
                              </button>
                            </Link>
                            <button
                              onClick={() => deleteProject(project.id, project.title)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
