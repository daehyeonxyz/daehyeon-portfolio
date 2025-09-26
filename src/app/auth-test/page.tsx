'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch debug info
    fetch('/api/auth/debug')
      .then(res => res.json())
      .then(data => setDebugInfo(data))
      .catch(err => setError(err.message));
  }, [session]);

  const handleSignIn = async () => {
    try {
      const result = await signIn('github', { 
        callbackUrl: '/portfolio',
        redirect: true 
      });
      console.log('Sign in result:', result);
    } catch (error: any) {
      setError(error.message);
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 로그인 테스트 페이지</h1>
        
        {/* 상태 표시 */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">현재 상태</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">인증 상태:</span>{' '}
              <span className={`px-2 py-1 rounded text-sm ${
                status === 'authenticated' ? 'bg-green-100 text-green-800' :
                status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {status}
              </span>
            </p>
            {session && (
              <>
                <p><span className="font-medium">이메일:</span> {session.user?.email}</p>
                <p><span className="font-medium">이름:</span> {session.user?.name}</p>
                <p><span className="font-medium">Admin:</span> {session.user?.isAdmin ? '✅ Yes' : '❌ No'}</p>
              </>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">액션</h2>
          <div className="flex gap-4">
            {status === 'authenticated' ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                GitHub로 로그인
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              새로고침
            </button>
          </div>
        </div>

        {/* 디버그 정보 */}
        {debugInfo && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">디버그 정보</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-50 p-6 rounded-lg shadow border border-red-200">
            <h2 className="text-xl font-semibold mb-2 text-red-700">오류</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 도움말 */}
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">🔍 문제 해결 가이드</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>GitHub OAuth 앱의 callback URL이 올바른지 확인</li>
            <li>.env.local 파일의 환경변수가 모두 설정되었는지 확인</li>
            <li>GitHub 유저네임이 ADMIN_GITHUB_USERNAME과 일치하는지 확인</li>
            <li>서버를 재시작 (Ctrl+C 후 npm run dev)</li>
            <li>브라우저 캐시와 쿠키 삭제 후 재시도</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
