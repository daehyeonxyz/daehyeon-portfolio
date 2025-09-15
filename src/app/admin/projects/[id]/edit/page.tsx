'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X, Plus, Calendar, Image } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProjectPage({ params }: PageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projectId, setProjectId] = useState<string | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [techInput, setTechInput] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    content: '',
    image: '',
    thumbnailImage: '',
    startDate: '',
    endDate: '',
    link: '',
    github: '',
    tech: [] as string[],
    featured: false,
    published: true,
    order: 0,
  })

  useEffect(() => {
    // params를 풀어서 ID 가져오기
    params.then(p => setProjectId(p.id))
  }, [params])

  useEffect(() => {
    if (status === 'loading' || !projectId) return
    if (!session?.user?.isAdmin) {
      router.push('/')
      return
    }
    fetchProject()
  }, [session, status, projectId])

  const fetchProject = async () => {
    if (!projectId) return
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`)
      if (res.ok) {
        const project = await res.json()
        setFormData({
          title: project.title || '',
          subtitle: project.subtitle || '',
          description: project.description || '',
          content: project.content || '',
          image: project.image || '',
          thumbnailImage: project.thumbnailImage || '',
          startDate: project.startDate ? project.startDate.split('T')[0] : '',
          endDate: project.endDate ? project.endDate.split('T')[0] : '',
          link: project.link || '',
          github: project.github || '',
          tech: project.tech ? JSON.parse(project.tech) : [],
          featured: project.featured || false,
          published: project.published || true,
          order: project.order || 0,
        })
      } else {
        toast.error('Project not found')
        router.push('/admin')
      }
    } catch (error) {
      toast.error('Failed to load project')
      router.push('/admin')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return null
  }

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tech: [...prev.tech, techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.filter(t => t !== tech)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tech: JSON.stringify(formData.tech),
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      toast.success('Project updated successfully!')
      router.push('/portfolio')
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/portfolio">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
              <ArrowLeft size={20} />
              Back to Portfolio
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-white">Edit Project</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Project Title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="e.g., KHU Valley Program, LG CNS Optimization Grand Challenge"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Brief description of the project"
                  required
                />
              </div>
            </div>
          </div>

          {/* Media & Dates */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Media & Timeline</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Image size={16} className="inline mr-2" />
                  Thumbnail Image URL (16:9 ratio recommended)
                </label>
                <input
                  type="url"
                  value={formData.thumbnailImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnailImage: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="https://example.com/thumbnail.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 1920x1080 or 1280x720 pixels for best display
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Detailed Content (Markdown)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors resize-none font-mono text-sm"
                  placeholder="# Project Details&#10;&#10;Detailed description in Markdown format...&#10;&#10;## Features&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Technical Details&#10;..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first in the portfolio
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Links</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Technologies</h2>
            
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTech()
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Add technology (e.g., React, TypeScript)"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-900/50 text-blue-500"
                />
                <span className="text-gray-300">Mark as Featured Project</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-900/50 text-blue-500"
                />
                <span className="text-gray-300">Published</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Link href="/portfolio">
              <button
                type="button"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all text-white"
              >
                Cancel
              </button>
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-all text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
