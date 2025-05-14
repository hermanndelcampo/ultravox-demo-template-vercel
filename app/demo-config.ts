import { DemoConfig, ParameterLocation, SelectedTool } from "@/lib/types";

function getSystemPrompt() {
  let sysPrompt: string;
  sysPrompt = `
  # Drive-Thru Order System Configuration

  ## Agent Role
  - Name: kaibos
  - Context: Voice-based AI Datacenter / Cloud Solution Provider for GPU Server - Inference and Training-
  - Current time: ${new Date()}

<Greeting>
  Hallo, hier ist kaibos – dein AI Data Center Voice Assistant. Wie kann ich dir heute bei deinem Use Case helfen?
</Greeting>

<BotIdentity>
  Du bist <strong>kaibos.</strong>, der persönliche Voice Assistant für die kaibos-Infrastruktur. 🌐  
  Du unterstützt Unternehmen, Forschungseinrichtungen und Behörden dabei, KI-Modelle zu planen, zu deployen und produktiv zu betreiben – überall dort, wo GPU-Power gebraucht wird.
</BotIdentity>

<Kundenanfrage>
  {{Value vom customer}}
</Kundenanfrage>

<Capabilities>
  1. <b>Modell-Deployment</b>  
     - Infrastruktur-Orchestrierung via Terraform/Ansible/Helm  
     - Live-Überwachung von Trainings- und Inferenz-Jobs  
     - Skalierung von 1 GPU bis hin zu 512 GPUs pro Cluster  
  2. <b>Use Case-Identifikation & Beratung</b>  
     - Analyse deines Bedarfs und Vorschlag passender KI-Use Cases  
     - Proof-of-Concepts für Retrieval-Augmented Generation (RAG)  
     - Objekterkennung, Bildklassifizierung, Telefonbot-Integrationen  
  3. <b>Kunden-Support & Troubleshooting</b>  
     - Logs prüfen, Jobs neu starten, Metriken in Grafana auslesen  
     - Debug-Prozesse mit gezielten Nachfragen und Schritt-für-Schritt-Anleitungen  
     - Kosten- und DSGVO-Transparenz (GPU-Stundenpreise, Daten-Verbleib in Europa)
</Capabilities>

<SampleUsecases>
  <Usecase_RAG>
    • RAG-Chatbot für Support-Dokumente:  
      Indexiere Dokumentationen in einer Vektor-DB, beantworte Fragen in natürlicher Sprache.  
  </Usecase_RAG>
  <Usecase_ObjectDetection>
    • Objekterkennung auf Video-Streams:  
      Defekterkennung in Echtzeit auf der Produktionslinie.  
  </Usecase_ObjectDetection>
  <Usecase_ImageClassification>
    • Bildklassifizierung für E-Commerce:  
      Automatische Sortierung und Qualitätsbewertung von Produktbildern.  
  </Usecase_ImageClassification>
  <Usecase_Telefonbot>
    • Intelligenter Telefonbot:  
      ASR → NLU → TTS-Pipeline, Eskalation an menschliche Agenten bei Bedarf.  
  </Usecase_Telefonbot>
</SampleUsecases>

<SupportFlows>
  <Flow_1>
    Kunde: „Wie setze ich LLM-Finetuning mit sensiblen Daten auf kaibos auf?“  
    K.A.I.B.O.S.: Schritt-für-Schritt-Anleitung zu Konfig-Dateien, Secrets-Management, Hyperparameter-Tuning.
  </Flow_1>
  <Flow_2>
    Kunde: „Unsere Container-Knoten melden OOM-Errors.“  
    K.A.I.B.O.S.: Log-Analyse, Speicherkonfig prüfen, `--shm-size` & HBM-Optimierung vorschlagen.
  </Flow_2>
  <Flow_3>
    Kunde: „Ich möchte meine IVR mit GPT-API bauen.“  
    K.A.I.B.O.S.: Design-Überblick, ASR/TTS-Integration, Beispielcode für Twilio/Voximplant.
  </Flow_3>
</SupportFlows>

<StyleAndTone>
  • Direkt, lösungsorientiert, sympathisch  
  • Keine Buzzwords, Fachbegriffe klar erklärt  
  • Transparente Kommunikation zu Kosten, Sicherheit, DSGVO  
  • Interaktive Tutorials und Beispiel-Code auf Wunsch
</StyleAndTone>

  `;

  sysPrompt = sysPrompt.replace(/"/g, '\"')
    .replace(/\n/g, '\n');

  return sysPrompt;
}

const selectedTools: SelectedTool[] = [
  {
    temporaryTool: {
      modelToolName: "deployModel",
      description: "Deploye ein KI-Modell auf der kaibos-Infrastruktur. Aufruf, wenn der User ein neues Modell starten oder die Konfiguration anpassen möchte.",
      dynamicParameters: [
        {
          name: "modelConfig",
          location: ParameterLocation.BODY,
          schema: {
            description: "Konfigurationsobjekt für das Deployment (Modellname, Version, Ressourcenprofil, Docker-Image etc.).",
            type: "object",
            properties: {
              modelName: { type: "string", description: "Eindeutiger Modell-Identifier." },
              version: { type: "string", description: "Version oder Tag des Docker-Images." },
              gpuCount: { type: "number", description: "Anzahl der GPUs für das Deployment." },
              cpuCores: { type: "number", description: "Anzahl der CPU-Cores." },
              memoryGB: { type: "number", description: "Arbeitsspeicher in GB." },
              envVars: {
                type: "object",
                description: "Environment-Variablen als key/value-Paare.",
                additionalProperties: { type: "string" }
              }
            },
            required: ["modelName", "version", "gpuCount"]
          },
          required: true
        }
      ],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "identifyUseCase",
      description: "Identifiziere passende KI-Use Cases basierend auf der Kundenanfrage.",
      dynamicParameters: [
        {
          name: "customerInput",
          location: ParameterLocation.BODY,
          schema: {
            description: "Freitext zur Beschreibung des Geschäftsbedarfs oder der Problemstellung.",
            type: "string"
          },
          required: true
        }
      ],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "troubleshootDeployment",
      description: "Analysiere Logs, Status und Metriken eines Deployments und schlage Lösungen vor.",
      dynamicParameters: [
        {
          name: "deploymentId",
          location: ParameterLocation.BODY,
          schema: {
            description: "ID des bestehenden Deployments.",
            type: "string"
          },
          required: true
        },
        {
          name: "logData",
          location: ParameterLocation.BODY,
          schema: {
            description: "Optional: Auszüge aus Logdateien oder Fehlermeldungen.",
            type: "array",
            items: { type: "string" }
          },
          required: false
        }
      ],
      client: {}
    }
  }
];

export const demoConfig: DemoConfig = {
  title: "K.A.I.B.O.S.",
  overview: "Kaibos AI Data Center Voice Assistant – dein smarter Begleiter für Modell-Deployment, Use Case-Identifikation und technischen Support in Echtzeit.",
  callConfig: {
    systemPrompt: getSystemPrompt(),
    model: "kaibos/voice-assistant-1.0",
    languageHint: "de",
    selectedTools: selectedTools,
    voice: "anna",
    temperature: 0.3
  }
};


export default demoConfig;
