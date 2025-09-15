# 🔐 GitHub OAuth 설정 가이드

## 1. GitHub OAuth 앱 생성

1. GitHub에 로그인
2. [Settings > Developer settings > OAuth Apps](https://github.com/settings/developers) 접속
3. **"New OAuth App"** 클릭

## 2. OAuth 앱 정보 입력

### 개발 환경 (로컬)
- **Application name**: Daehyeon Portfolio (Dev)
- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

### 프로덕션 환경 (Vercel)
- **Application name**: Daehyeon Portfolio
- **Homepage URL**: `https://daehyeon.xyz`
- **Authorization callback URL**: `https://daehyeon.xyz/api/auth/callback/github`

## 3. Client ID & Secret 복사

앱 생성 후:
1. **Client ID** 복사
2. **"Generate a new client secret"** 클릭
3. **Client Secret** 복사 (한 번만 표시되므로 안전한 곳에 저장)

## 4. .env.local 파일 업데이트

```env
# GitHub OAuth
GITHUB_ID=실제_클라이언트_아이디_붙여넣기
GITHUB_SECRET=실제_클라이언트_시크릿_붙여넣기

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=랜덤한_시크릿_키_생성

# Admin GitHub Username (본인의 GitHub 유저네임)
ADMIN_GITHUB_USERNAME=daehyeonxyz
```

## 5. NextAuth Secret 생성

터미널에서 실행:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
또는
```bash
openssl rand -base64 32
```

생성된 값을 `NEXTAUTH_SECRET`에 붙여넣기

## 6. Vercel 환경 변수 설정

Vercel 대시보드에서:
1. Project Settings > Environment Variables
2. 다음 변수들 추가:
   - `GITHUB_ID`
   - `GITHUB_SECRET`
   - `NEXTAUTH_URL` (https://daehyeon.xyz)
   - `NEXTAUTH_SECRET`
   - `ADMIN_GITHUB_USERNAME`
   - `DATABASE_URL` (프로덕션 DB URL)

## 7. 테스트

1. `npm run dev` 실행
2. http://localhost:3000/portfolio 접속
3. "Admin Login" 클릭
4. GitHub으로 로그인
5. 프로젝트 추가 테스트

## ⚠️ 중요 사항

- **Client Secret은 절대 공개하지 마세요**
- `.env.local` 파일은 `.gitignore`에 포함되어 있어야 합니다
- 프로덕션과 개발 환경은 별도의 OAuth 앱을 사용하는 것이 좋습니다
- `ADMIN_GITHUB_USERNAME`은 반드시 본인의 GitHub 유저네임으로 설정하세요

## 문제 해결

### "Sign in failed" 오류
- GitHub OAuth 앱의 callback URL이 정확한지 확인
- `.env.local`의 GITHUB_ID와 GITHUB_SECRET이 정확한지 확인

### "Unauthorized" 오류  
- `ADMIN_GITHUB_USERNAME`이 본인의 GitHub 유저네임과 일치하는지 확인
- GitHub 프로필에서 정확한 유저네임 확인 (대소문자 구분)