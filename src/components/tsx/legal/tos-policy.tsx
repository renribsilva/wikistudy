import React, { Fragment } from "react";
import { LegalNavItem } from "./legal-nav";
import Link from "next/link";
import styles from "./legal.module.css";

export interface TermsSectionItem extends LegalNavItem {
  intro?: React.ReactNode;
  paragraphs: readonly React.ReactNode[];
  bullets?: readonly React.ReactNode[];
  hasTopDivider?: boolean;
}

export interface TermsOfServiceProps {
  lastUpdated?: string;
  maintainerName?: string;
  licenseName?: string;
  repoUrl?: string;
  authProviders?: string;
  contactEmail?: string;
  privacyUrl?: string;
  officialUrl?: string;
}

export function buildTosItems({
  licenseName = "[Ex.: MIT License / GPL-3.0 / Apache-2.0]",
  repoUrl = "[URL do repositório, ex.: GitHub/GitLab]",
  authProviders = "[Ex.: e-mail / provedor OAuth]",
  contactEmail = "[E-mail de contato]",
  privacyUrl = "[URL da Política de Privacidade]",
  officialUrl = "[URL do site ou repositório]",
}: Pick<
  TermsOfServiceProps,
  | "licenseName"
  | "repoUrl"
  | "authProviders"
  | "contactEmail"
  | "privacyUrl"
  | "officialUrl"
>): readonly TermsSectionItem[] {
  return [
    {
      id: "natureza-do-servico",
      label: "1. Natureza do Serviço (Gratuito e Open Source)",
      paragraphs: [
        <Fragment key="1.1">
          <strong>1.1.</strong> O <strong>WikiStudy</strong> é disponibilizado
          de forma gratuita, sem cobrança de mensalidades, taxas de inscrição ou
          venda de acesso a conteúdos básicos da plataforma.
        </Fragment>,
        <Fragment key="1.2">
          <strong>1.2.</strong> O código-fonte do projeto é aberto e licenciado
          sob a licença {licenseName}, disponível em {repoUrl}. O uso, estudo,
          modificação e redistribuição do código seguem os termos dessa licença
          específica.
        </Fragment>,
        <Fragment key="1.3">
          <strong>1.3.</strong> Eventuais doações, apoios comunitários ou
          patrocínios — caso existam — são voluntários e destinam-se
          exclusivamente à manutenção da infraestrutura e do projeto, sem gerar
          obrigações comerciais ou garantias adicionais além das previstas na
          licença do código.
        </Fragment>,
      ],
    },
    {
      id: "acesso-e-conta",
      label: "2. Acesso Público, Conta do Usuário e Níveis de Uso",
      paragraphs: [
        <Fragment key="2.1">
          <strong>2.1.</strong> A visualização pública da plataforma, incluindo
          a navegação pelo catálogo e pela organização de links de vídeos
          gratuitos do YouTube e estruturas abertas de estudo, pode ocorrer sem
          a necessidade de login.
        </Fragment>,
        <Fragment key="2.2">
          <strong>2.2.</strong> Funcionalidades personalizadas — como salvar
          progresso, gerenciar cronograma próprio, anotações ou preferências —
          podem exigir a criação de uma conta ou autenticação via{" "}
          {authProviders}. Ações administrativas e de gestão da base são
          restritas a contas autorizadas com permissão específica.
        </Fragment>,
        <Fragment key="2.3">
          <strong>2.3.</strong> Você é responsável por manter a
          confidencialidade de suas credenciais e da sua sessão de acesso, bem
          como por todas as atividades realizadas em sua conta.
        </Fragment>,
        <Fragment key="2.4">
          <strong>2.4.</strong> Você concorda em fornecer informações
          verdadeiras e atualizadas, bem como em notificar {contactEmail} caso
          suspeite de acesso não autorizado à sua conta.
        </Fragment>,
      ],
    },
    {
      id: "links-e-contribuicoes",
      label: "3. Organização de Links de Vídeos do YouTube e Contribuições",
      paragraphs: [
        <Fragment key="3.1">
          <strong>3.1.</strong> O <strong>WikiStudy</strong> atua como uma
          plataforma de estudo, organização e cronograma que organiza e indexa
          links para vídeos públicos e gratuitos hospedados no YouTube, além de
          estruturas de estudo e planejamento associadas a eles.
        </Fragment>,
        <Fragment key="3.2">
          <strong>3.2.</strong> Os vídeos referenciados permanecem hospedados no
          YouTube e sujeitos aos termos, políticas, anúncios, disponibilidade e
          decisões da própria plataforma YouTube/Google e de seus respectivos
          autores ou canais. O <strong>WikiStudy</strong> não reivindica
          propriedade sobre os vídeos de terceiros nem garante que um link
          externo permaneça disponível ou inalterado ao longo do tempo.
        </Fragment>,
        <Fragment key="3.3">
          <strong>3.3.</strong> <strong>Finalidade educativa:</strong> Os
          conteúdos e cronogramas têm caráter estritamente educacional e
          organizacional. Não há garantia de aprovação em exames, concursos,
          vestibulares ou certificações, nem de que o material ou a seleção de
          links esteja livre de erros ou sempre atualizado.
        </Fragment>,
        <Fragment key="3.4">
          <strong>3.4.</strong>{" "}
          <strong>Conteúdo e sugestões enviadas por usuários:</strong> Caso você
          envie links, descrições, sugestões de cronograma, comentários ou
          códigos à plataforma ou ao repositório, você declara que possui os
          direitos necessários sobre esse material e concede ao projeto
          permissão para exibi-lo e distribuí-lo na plataforma e/ou sob a
          licença <em>open source</em> aplicável, conforme indicado na
          contribuição.
        </Fragment>,
      ],
    },
    {
      id: "conduta-do-usuario",
      label: "4. Conduta do Usuário e Uso Aceitável",
      intro: (
        <Fragment key="4-intro">
          Ao utilizar a plataforma, você se compromete a não:
        </Fragment>
      ),
      paragraphs: [],
      bullets: [
        <Fragment key="4.1">
          Publicar, submeter ou transmitir conteúdo ilícito, difamatório,
          discriminatório, ofensivo, fraudulento ou que viole direitos autorais
          e de propriedade intelectual de terceiros;
        </Fragment>,
        <Fragment key="4.2">
          Tentar invadir, sobrecarregar, derrubar ou comprometer a segurança e o
          funcionamento da plataforma ou de outros usuários;
        </Fragment>,
        <Fragment key="4.3">
          Usar scripts automatizados, <em>scrapers</em> ou <em>bots</em> de
          forma abusiva que prejudiquem a disponibilidade do serviço para outros
          estudantes;
        </Fragment>,
        <Fragment key="4.4">
          Utilizar a marca ou o nome <strong>WikiStudy</strong> de maneira a
          sugerir endosso oficial inexistente.
        </Fragment>,
      ],
    },
    {
      id: "privacidade-lgpd",
      label: "5. Privacidade e Dados Pessoais (LGPD)",
      paragraphs: [
        <Fragment key="5.1">
          <strong>5.1.</strong> O tratamento de dados pessoais observa a
          legislação aplicável, incluindo a Lei Geral de Proteção de Dados (Lei
          nº 13.709/2018 — LGPD).
        </Fragment>,
        <Fragment key="5.2">
          <strong>5.2.</strong> Coletamos apenas os dados necessários para o
          funcionamento da conta, sessão, preferências/cronograma de estudo,
          métricas de uso e segurança da aplicação, conforme descrito na nossa{" "}
          <Link href={privacyUrl}>Política de Privacidade</Link>.
        </Fragment>,
        <Fragment key="5.3">
          <strong>5.3.</strong> Você pode solicitar acesso, correção, exportação
          ou exclusão dos seus dados pessoais por meio de {contactEmail}.
        </Fragment>,
      ],
    },
    {
      id: "isencao-de-garantias",
      label: "6. Isenção de Garantias e Limitação de Responsabilidade",
      paragraphs: [
        <Fragment key="6.1">
          <strong>6.1.</strong> Por se tratar de um projeto gratuito e{" "}
          <em>open source</em>, a plataforma é fornecida{" "}
          <em>&ldquo;NO ESTADO EM QUE SE ENCONTRA&rdquo; (AS IS)</em> e{" "}
          <em>&ldquo;CONFORME DISPONÍVEL&rdquo; (AS AVAILABLE)</em>, sem
          garantias expressas ou implícitas de disponibilidade ininterrupta,
          ausência de falhas ou adequação a um propósito específico.
        </Fragment>,
        <Fragment key="6.2">
          <strong>6.2.</strong> Os mantenedores e colaboradores não se
          responsabilizam por eventuais perdas de dados, interrupções
          temporárias, falhas técnicas, indisponibilidade ou alteração de vídeos
          externos no YouTube, nem por decisões tomadas com base nos conteúdos
          ou cronogramas da plataforma, nos limites permitidos pela legislação
          vigente.
        </Fragment>,
      ],
    },
    {
      id: "alteracoes-e-encerramento",
      label: "7. Alterações nos Termos e Encerramento do Serviço",
      paragraphs: [
        <Fragment key="7.1">
          <strong>7.1.</strong> Estes Termos podem ser atualizados
          periodicamente para refletir melhorias no projeto ou mudanças legais.
          A data da última atualização será sempre indicada no topo deste
          documento.
        </Fragment>,
        <Fragment key="7.2">
          <strong>7.2.</strong> Como o projeto depende de recursos e manutenção
          voluntária ou comunitária, funcionalidades podem ser alteradas,
          pausadas ou descontinuadas mediante aviso prévio razoável na
          plataforma ou no repositório, sempre que possível.
        </Fragment>,
      ],
    },
    {
      id: "contato",
      label: "9. Contato",
      hasTopDivider: true,
      paragraphs: [
        <Fragment key="9.1">
          Para dúvidas, sugestões, relatos de segurança ou solicitações
          relacionadas a estes Termos, entre em contato pelo e-mail{" "}
          {contactEmail} ou pela página oficial em {officialUrl}.
        </Fragment>,
      ],
    },
  ];
}

export function TermsOfService({
  lastUpdated = "[DD/MM/AAAA]",
  maintainerName = "[Nome da Pessoa, Coletivo ou Organização]",
  licenseName = "[Ex.: MIT License / GPL-3.0 / Apache-2.0]",
  repoUrl = "[URL do repositório, ex.: GitHub/GitLab]",
  authProviders = "[Ex.: e-mail / provedor OAuth]",
  contactEmail = "[E-mail de contato]",
  privacyUrl = "[URL da Política de Privacidade]",
  officialUrl = "[URL do site ou repositório]",
}: TermsOfServiceProps) {
  const items = buildTosItems({
    licenseName,
    repoUrl,
    authProviders,
    contactEmail,
    privacyUrl,
    officialUrl,
  });

  return (
    <Fragment key="tos-root">
      <article className={styles.policy_article}>
        <header className={styles.policy_header}>
          <h1 className={styles.policy_title}>Termos de Serviço — WikiStudy</h1>
          <p className={styles.policy_updated}>
            <strong>Última atualização:</strong> {lastUpdated}
          </p>
          <p className={styles.policy_lead}>
            Bem-vindo(a) ao <strong>WikiStudy</strong>, uma plataforma de
            estudo, organização e cronograma 100% gratuita e de código aberto (
            <em>open source</em>), mantida por {maintainerName}, cujo acervo
            reúne a organização de links de vídeos gratuitos do YouTube.
          </p>
          <p>
            Ao acessar ou utilizar esta plataforma, você concorda com estes
            Termos de Serviço. Caso não concorde com qualquer condição aqui
            descrita, por favor, não utilize o serviço.
          </p>
        </header>

        {items.map((section) => (
          <Fragment key={section.id}>
            <section
              id={section.id}
              className={`${styles.policy_section} ${
                section.hasTopDivider ? styles.policy_section_divider : ""
              }`}
            >
              <h2>{section.label}</h2>
              {section.intro && (
                <Fragment key={`${section.id}-intro`}>
                  <p>{section.intro}</p>
                </Fragment>
              )}
              {section.paragraphs.map((paragraph, index) => (
                <Fragment key={`${section.id}-p-${index}`}>
                  <p>{paragraph}</p>
                </Fragment>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <Fragment key={`${section.id}-bullets`}>
                  <ul>
                    {section.bullets.map((bullet, index) => (
                      <Fragment key={`${section.id}-b-${index}`}>
                        <li>{bullet}</li>
                      </Fragment>
                    ))}
                  </ul>
                </Fragment>
              )}
            </section>
          </Fragment>
        ))}
      </article>
    </Fragment>
  );
}

export default TermsOfService;
