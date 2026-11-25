import React, { Fragment } from "react";
import Link from "next/link";
import { LegalNavItem } from "./legal-nav";
import styles from "./legal.module.css";

export interface PrivacySectionItem extends LegalNavItem {
  intro?: React.ReactNode;
  paragraphs: readonly React.ReactNode[];
  bullets?: readonly React.ReactNode[];
  hasTopDivider?: boolean;
}

export interface PrivacyPolicyProps {
  lastUpdated?: string;
  maintainerName?: string;
  contactEmail?: string;
  officialUrl?: string;
  tosUrl?: string;
  cookiesUrl?: string;
}

export function buildPrivacyItems({
  contactEmail = "[E-mail de contato / canal de privacidade]",
  officialUrl = "[URL do site ou repositório]",
}: Pick<
  PrivacyPolicyProps,
  "contactEmail" | "officialUrl"
>): readonly PrivacySectionItem[] {
  return [
    {
      id: "dados-que-tratamos",
      label: "1. Dados que Tratamos",
      intro: (
        <Fragment key="1-intro">
          O <strong>WikiStudy</strong> pode ser acessado de forma pública sem
          necessidade de login, e o cadastro/autenticação destina-se a recursos
          personalizados e gestão da plataforma (como visões/níveis de acesso
          pública, usuário autenticado e <em>admin</em>). Conforme o uso,
          podemos tratar:
        </Fragment>
      ),
      paragraphs: [],
      bullets: [
        <Fragment key="1.1">
          <strong>Dados de conta e perfil:</strong> nome informado no cadastro e
          identificador único da conta (gerado como UUIDv7).
        </Fragment>,
        <Fragment key="1.2">
          <strong>Dados de e-mail protegidos:</strong> o e-mail não é gravado em
          texto puro na tabela de usuários; o sistema armazena um índice cego
          determinístico (<em>blind index</em> via HMAC-SHA256 para busca e
          unicidade) e uma versão cifrada com AES-256-GCM.
        </Fragment>,
        <Fragment key="1.3">
          <strong>Credenciais de autenticação:</strong> senhas são convertidas
          em <em>hash</em> seguro (bcrypt) e não ficam armazenadas em texto
          aberto.
        </Fragment>,
        <Fragment key="1.4">
          <strong>Dados de sessão, personalização e uso:</strong> informações
          associadas à sessão autenticada, preferências/cronogramas ou progresso
          de estudo e registros técnicos necessários para segurança e
          estabilidade da aplicação.
        </Fragment>,
      ],
    },
    {
      id: "finalidades-e-bases-legais",
      label: "2. Finalidades e Bases Legais (LGPD)",
      intro: "Tratamos os dados pessoais para:",
      paragraphs: [],
      bullets: [
        <Fragment key="2.1">
          <strong>Execução do serviço / procedimentos preliminares:</strong>{" "}
          criar e gerenciar contas, autenticar usuários, manter a sessão ativa e
          entregar funcionalidades personalizadas de estudo/cronograma.
        </Fragment>,
        <Fragment key="2.2">
          <strong>Segurança e prevenção a fraudes/abusos:</strong> verificar
          credenciais, proteger contas, validar sessões no servidor e resguardar
          a integridade da aplicação.
        </Fragment>,
        <Fragment key="2.3">
          <strong>
            Cumprimento de obrigação legal ou regulatória e exercício regular de
            direitos:
          </strong>{" "}
          atender exigências legais aplicáveis e solicitações dos titulares nos
          termos da LGPD.
        </Fragment>,
        <Fragment key="2.4">
          <strong>Consentimento:</strong> quando aplicável para funcionalidades
          ou comunicações específicas que dependam de autorização expressa.
        </Fragment>,
      ],
    },
    {
      id: "youtube-e-terceiros",
      label: "3. Vídeos do YouTube e Serviços de Terceiros",
      paragraphs: [],
      bullets: [
        <Fragment key="3.1">
          O <strong>WikiStudy</strong> organiza e indexa links para vídeos
          públicos e gratuitos hospedados no YouTube.
        </Fragment>,
        <Fragment key="3.2">
          Ao acessar, reproduzir ou interagir com vídeos no YouTube (ou outros
          serviços externos referenciados), você passa a estar sujeito também às
          políticas de privacidade e termos da respectiva plataforma terceira
          (como o YouTube/Google), sobre as quais o <strong>WikiStudy</strong>{" "}
          não possui controle.
        </Fragment>,
      ],
    },
    {
      id: "seguranca-e-compartilhamento",
      label: "4. Armazenamento, Segurança e Compartilhamento",
      paragraphs: [],
      bullets: [
        <Fragment key="4.1">
          <strong>Segurança:</strong> Adotamos medidas técnicas no servidor —
          como cookies <code>httpOnly</code>, assinatura de sessão via JWT
          (HS256 com <code>SESSION_SECRET</code>), <em>hash</em> de senhas e
          proteção do e-mail com <em>blind index</em> e cifragem —, sem que isso
          constitua garantia absoluta contra incidentes inevitáveis em redes
          públicas.
        </Fragment>,
        <Fragment key="4.2">
          <strong>Compartilhamento:</strong> Não vendemos dados pessoais. O
          compartilhamento ocorre apenas quando necessário para a infraestrutura
          técnica do serviço, para cumprimento de obrigação legal/ordem de
          autoridade competente ou com a sua autorização.
        </Fragment>,
        <Fragment key="4.3">
          <strong>Retenção:</strong> Mantemos os dados pelo tempo necessário
          para cumprir as finalidades desta política, atender obrigações legais
          ou até que ocorra solicitação de exclusão cabível, respeitados os
          prazos legais.
        </Fragment>,
      ],
    },
    {
      id: "direitos-do-titular",
      label: "5. Seus Direitos como Titular (LGPD)",
      intro: "Nos termos da LGPD, você pode solicitar:",
      paragraphs: [
        <Fragment key="5-contato">
          Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre
          em contato pelo canal oficial: <strong>{contactEmail}</strong> (ou
          pela página em <strong>{officialUrl}</strong>).
        </Fragment>,
      ],
      bullets: [
        <Fragment key="5.1">
          Confirmação da existência de tratamento e acesso aos seus dados;
        </Fragment>,
        <Fragment key="5.2">
          Correção de dados incompletos, inexatos ou desatualizados;
        </Fragment>,
        <Fragment key="5.3">
          Anonimização, bloqueio ou eliminação de dados desnecessários,
          excessivos ou tratados em desconformidade com a lei;
        </Fragment>,
        <Fragment key="5.4">
          Portabilidade, informação sobre compartilhamento e revogação de
          consentimento, quando aplicável.
        </Fragment>,
      ],
    },
    {
      id: "atualizacoes",
      label: "6. Atualizações desta Política",
      hasTopDivider: true,
      paragraphs: [
        <Fragment key="6.1">
          Esta Política de Privacidade pode ser atualizada periodicamente para
          refletir mudanças na plataforma ou na legislação. A data de{" "}
          <strong>Última atualização</strong> no topo indicará a versão vigente.
        </Fragment>,
      ],
    },
  ];
}

export function PrivacyPolicy({
  lastUpdated = "[DD/MM/AAAA]",
  maintainerName = "[Nome da Pessoa, Coletivo ou Organização]",
  contactEmail = "[E-mail de contato / canal de privacidade]",
  officialUrl = "[URL do site ou repositório]",
  tosUrl = "/tos",
  cookiesUrl = "/cookies",
}: PrivacyPolicyProps) {
  const items = buildPrivacyItems({ contactEmail, officialUrl });

  return (
    <article className={styles.policy_article}>
      <header className={styles.policy_header}>
        <h1 className={styles.policy_title}>
          Política de Privacidade — WikiStudy
        </h1>
        <p className={styles.policy_updated}>
          <strong>Última atualização:</strong> {lastUpdated}
        </p>
        <p className={styles.policy_lead}>
          Esta Política de Privacidade descreve como o{" "}
          <strong>WikiStudy</strong> — plataforma de estudo, organização e
          cronograma gratuita e de código aberto (<em>open source</em>) voltada
          à organização de links de vídeos públicos e gratuitos no YouTube,
          mantida por {maintainerName} — trata dados pessoais em conformidade
          com a{" "}
          <strong>
            Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)
          </strong>
          .
        </p>
        <p>
          Veja também os nossos <Link href={tosUrl}>Termos de Serviço</Link> e a
          nossa <Link href={cookiesUrl}>Política de Cookies</Link>.
        </p>
      </header>

      {items.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={`${styles.policy_section} ${
            section.hasTopDivider ? styles.policy_section_divider : ""
          }`}
        >
          <h2>{section.label}</h2>

          {section.intro && <p>{section.intro}</p>}

          {section.bullets && section.bullets.length > 0 && (
            <ul>
              {section.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}

          {section.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}

export default PrivacyPolicy;
