// Sistema externo "API Pública de CNPJ" do diagrama de casos de uso (ligado ao RF-004).
// Aqui a consulta é SIMULADA: valida os dígitos verificadores e responde após um pequeno atraso.
// No sistema real, a chamada é feita pelo backend, sem expor chaves de API no navegador (RNF-005).

export const cnpjDigits = (cnpj: string) => cnpj.replace(/\D/g, '')

/** Valida o CNPJ pelos dois dígitos verificadores (módulo 11). */
export function cnpjValido(cnpj: string): boolean {
  const d = cnpjDigits(cnpj).split('').map(Number)
  if (d.length !== 14 || new Set(d).size === 1) return false
  const dv = (n: number) => {
    const pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const resto = pesos.reduce((s, p, i) => s + p * d[i]!, 0) % 11
    return resto < 2 ? 0 : 11 - resto
  }
  return dv(12) === d[12] && dv(13) === d[13]
}

export type CnpjConsulta = { ok: boolean; texto: string }

export function consultarCnpj(cnpj: string, cidade?: string, uf?: string): Promise<CnpjConsulta> {
  return new Promise((resolve) =>
    setTimeout(() => {
      if (!cnpjValido(cnpj)) return resolve({ ok: false, texto: 'CNPJ inválido ou não encontrado na base pública.' })
      const local = cidade && uf ? ` · Município ${cidade}/${uf} confere com o cadastro.` : '.'
      resolve({ ok: true, texto: `CNPJ ${cnpj} encontrado · Situação cadastral ATIVA${local}` })
    }, 1200),
  )
}
