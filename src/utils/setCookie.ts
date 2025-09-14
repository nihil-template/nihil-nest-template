import type { FastifyReply } from 'fastify';

/**
 * @description 쿠키 설정
 * @param res FastifyReply
 * @param name 쿠키 이름
 * @param value 쿠키 값
 * @param maxAge 쿠키 만료 시간 (분)
 * @param httpOnly 쿠키 접근 권한
 */
export function setCookie(res: FastifyReply, name: string, value: string, maxAge: number, httpOnly: boolean = true) {
  res.setCookie(name, value, {
    httpOnly,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    domain: 'localhost', // localhost 도메인으로 설정
    path: '/', // 경로 설정
    maxAge: maxAge * 60 * 1000, // 쿠키 만료 시간
  });
}

/**
 * @description 쿠키 삭제
 * @param res FastifyReply
 * @param name 쿠키 이름
 * @param path 쿠키 경로 (기본값: '/')
 */
export function clearCookie(res: FastifyReply, name: string, path: string = '/') {
  res.clearCookie(name, {
    path,
    domain: 'localhost', // localhost 도메인으로 설정
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}
