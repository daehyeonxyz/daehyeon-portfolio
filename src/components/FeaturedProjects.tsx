'use client'

import { useEffect, useState } from 'react'
import { Code, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  link?: string
  github?: string
  image?: string
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?featured=true')
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-white">
            <Code className="inline mr-2" />
            주요 프로젝트
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-white">
            <Code className="inline mr-2" />
            주요 프로젝트
          </h2>
          <div className="text-center text-gray-400">
            <p>아직 등록된 프로젝트가 없습니다.</p>
            <Link href="/portfolio" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
              전체 포트폴리오 보기 →
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-white">
          <Code className="inline mr-2" />
          주요 프로젝트
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div 
              key={project.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 transition-all duration-300 hover:border-blue-500 hover:transform hover:scale-105"
            >
              {project.image && (
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-gray-300">
                    <Github size={18} />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            href="/portfolio" 
            className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-all text-white font-medium"
          >
            모든 프로젝트 보기 →
          </Link>
        </div>
      </div>
    </section>
  )
}
