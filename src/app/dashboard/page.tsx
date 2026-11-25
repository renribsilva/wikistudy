import { getOptionalUser } from "@/app/lib/authorization/dal";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  const user = await getOptionalUser();

  return (
    <section className={styles.dash_section}>
      <div>
        <h1>WikiStudy</h1>

        {user ? (
          <div>
            <p>
              Bem-vindo de volta, {user.name}! Que bom ter você aqui — obrigado
              por criar sua conta e fazer parte do WikiStudy. Este é um projeto
              ainda em construção, então recursos como personalizar a
              experiência, organizar cronogramas e acompanhar sua rotina de
              estudos ainda serão desenvolvidos. Ainda assim, a sua visita
              importa muito para o projeto, e futuras colaborações serão sempre
              muito bem-vindas.
            </p>
            <p>
              Acreditamos que projetos independentes, 100% gratuitos e{" "}
              <em>open source</em> são fundamentais para democratizar o acesso
              ao conhecimento, removendo barreiras pagas e mantendo ferramentas
              abertas para quem aprende. A proposta da nossa wiki é justamente
              favorecer a construção coletiva na organização de links de vídeos
              gratuitos do YouTube — e contar com essa colaboração é um dos
              principais objetivos do projeto, algo que esperamos construir ao
              longo do caminho.
            </p>
          </div>
        ) : (
          <div>
            <p>
              O WikiStudy é um projeto em construção que pretende ser uma
              plataforma de estudo, organização e cronograma com uma wiki para
              organização de links de vídeos gratuitos do YouTube, ajudando
              estudantes a estruturarem trilhas, revisões e rotinas sem ruído.
              Você pode explorar como visitante ou entrar para acompanhar a
              evolução da plataforma.
            </p>
            <p>
              Construir isso como um projeto independente, 100% gratuito e{" "}
              <em>open source</em> importa porque democratiza o acesso ao
              conhecimento: qualquer pessoa pode estudar, aprender e evoluir sem
              depender de paywalls ou soluções fechadas. Favorecer a construção
              coletiva na wiki é um dos principais objetivos do projeto, e
              esperamos que a comunidade possa somar a isso conforme o espaço
              amadurece.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
