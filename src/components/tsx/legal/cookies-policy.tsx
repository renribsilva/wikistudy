import React, { Fragment } from "react";
import Link from "next/link";
import { LegalNavItem } from "./legal-nav";
import styles from "./legal.module.css";

export interface CookieSectionItem extends LegalNavItem {
  intro?: React.ReactNode;
  paragraphs: readonly React.ReactNode[];
  bullets?: readonly React.ReactNode[];
  hasTable?: boolean;
  hasTopDivider?: boolean;
}

export interface CookiePolicyProps {
  lastUpdated?: string;
  contactEmail?: string;
  privacyUrl?: string;
  tosUrl?: string;
}

export function buildCookiesItems({
  contactEmail = "[E-mail de contato / canal de privacidade]",
}: Pick<CookiePolicyProps, "contactEmail">): readonly CookieSectionItem[] {
  return [
    {
      id: "o-que-sao-cookies",
      label: "1. O que são Cookies?",
      paragraphs: [
        <Fragment key="1.1">
          Cookies são pequenos arquivos de texto salvos pelo navegador no seu
          dispositivo quando você acessa um site. Eles ajudam a manter a
          aplicação funcionando, autenticar sua conta e preservar o estado da
          navegação.
        </Fragment>,
      ],
    },
    {
      id: "cookies-utilizados",
      label: "2. Cookies Utilizados",
      intro: (
        <Fragment key="2-intro">
          O <strong>WikiStudy</strong> utiliza apenas um cookie essencial para
          manter sua sessão ativa nas áreas que exigem login:
        </Fragment>
      ),
      hasTable: true,
      paragraphs: [],
    },
    {
      id: "nao-essenciais-e-terceiros",
      label: "3. Cookies Não Essenciais e Terceiros",
      paragraphs: [],
      bullets: [
        <Fragment key="3.1">
          <strong>Sem cookies próprios de anúncios ou rastreamento:</strong> o{" "}
          <strong>WikiStudy</strong> não cria cookies próprios para publicidade
          ou rastreamento de marketing.
        </Fragment>,
        <Fragment key="3.2">
          <strong>Serviços externos (YouTube):</strong> links ou players do
          YouTube podem aplicar cookies ou tecnologias próprias do
          YouTube/Google de acordo com as políticas deles.
        </Fragment>,
      ],
    },
    {
      id: "como-gerenciar-cookies",
      label: "4. Como Gerenciar ou Remover Cookies",
      paragraphs: [
        <Fragment key="4.1">
          Você pode consultar, bloquear ou apagar cookies diretamente nas
          configurações do seu navegador. Se bloquear ou remover o cookie{" "}
          <code>session</code>, você será desconectado e não poderá usar
          recursos que dependem de login.
        </Fragment>,
        <Fragment key="4.2">
          Dúvidas sobre cookies podem ser enviadas para{" "}
          <strong>{contactEmail}</strong>.
        </Fragment>,
      ],
    },
    {
      id: "alteracoes-cookies",
      label: "5. Alterações",
      hasTopDivider: true,
      paragraphs: [
        <Fragment key="5.1">
          Esta Política de Cookies pode ser atualizada quando houver mudanças na
          forma como o site gerencia sessões ou cookies. Veja sempre a data de{" "}
          <strong>Última atualização</strong> no topo.
        </Fragment>,
      ],
    },
  ];
}

function CookiesTable() {
  return (
    <div className={styles.table_wrapper}>
      <table className={styles.policy_table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Para que serve</th>
            <th>Quando expira</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>session</code>
            </td>
            <td>Essencial</td>
            <td>
              Identifica sua conta após o login para liberar áreas e recursos
              pessoais na plataforma.
            </td>
            <td>
              Dura enquanto a sessão do navegador estiver aberta ou até você
              clicar em sair (<code>logout</code>).
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function CookiePolicy({
  lastUpdated = "[DD/MM/AAAA]",
  contactEmail = "[E-mail de contato / canal de privacidade]",
  privacyUrl = "/privacy",
  tosUrl = "/tos",
}: CookiePolicyProps) {
  const items = buildCookiesItems({ contactEmail });

  return (
    <article className={styles.policy_article}>
      <header className={styles.policy_header}>
        <h1 className={styles.policy_title}>Política de Cookies — WikiStudy</h1>
        <p className={styles.policy_updated}>
          <strong>Última atualização:</strong> {lastUpdated}
        </p>
        <p className={styles.policy_lead}>
          Esta Política de Cookies explica quais cookies o{" "}
          <strong>WikiStudy</strong> utiliza, para que eles servem e como você
          pode controlá-los. Para detalhes sobre dados pessoais, veja nossa{" "}
          <Link href={privacyUrl}>Política de Privacidade</Link> e nossos{" "}
          <Link href={tosUrl}>Termos de Serviço</Link>.
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

          {section.hasTable && <CookiesTable />}

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

export default CookiePolicy;
