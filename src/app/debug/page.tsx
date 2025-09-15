'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DebugPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Session Info</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Logged In:</strong> {session ? 'Yes' : 'No'}</p>
            {session && (
              <>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Name:</strong> {session.user?.name}</p>
                <p><strong>Is Admin:</strong> {session.user?.isAdmin ? 'Yes' : 'No'}</p>
                <p><strong>User ID:</strong> {session.user?.id}</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Raw Session Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4 flex-wrap">
            {!session ? (
              <button
                onClick={() => signIn('github')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign In with GitHub
              </button>
            ) : (
              <>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
                <Link href="/admin">
                  <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Go to Admin
                  </button>
                </Link>
                <Link href="/admin/projects/new">
                  <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                    New Project
                  </button>
                </Link>
              </>
            )}
            <Link href="/">
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Home
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Links</h2>
          <div className="space-y-2">
            <p><Link href="/" className="text-blue-500 hover:underline">/ (Home)</Link></p>
            <p><Link href="/portfolio" className="text-blue-500 hover:underline">/portfolio</Link></p>
            <p><Link href="/admin" className="text-blue-500 hover:underline">/admin (Protected)</Link></p>
            <p><Link href="/admin/projects/new" className="text-blue-500 hover:underline">/admin/projects/new (Protected)</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
