<!--
  Profil de Salks. — DA : Plus Jakarta Sans, JetBrains Mono, un seul violet.
  assets/*          → node scripts/build-static.mjs
  assets/generated/ → régénéré chaque nuit par .github/workflows/profile.yml
-->

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/hero-light.svg"/>
  <img src="./assets/hero-dark.svg" width="100%" alt="Salks. — Ensemble, construisons quelque chose de grand."/>
</picture></p>

<p align="center">
  <a href="#projets"><picture><source media="(prefers-color-scheme: light)" srcset="./assets/btn-projects-light.svg"/><img src="./assets/btn-projects-dark.svg" height="46" alt="Voir mes projets"/></picture></a>
  &nbsp;
  <a href="#contact"><picture><source media="(prefers-color-scheme: light)" srcset="./assets/btn-contact-light.svg"/><img src="./assets/btn-contact-dark.svg" height="46" alt="Me contacter"/></picture></a>
</p>

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/cover-light.svg"/>
  <img src="./assets/cover-dark.svg" width="100%" alt="Salks à son bureau, version Minecraft"/>
</picture></p>

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/generated/tiles-light.svg"/>
  <img src="./assets/generated/tiles-dark.svg" width="100%" alt="Chiffres clés de l'année"/>
</picture></p>

<br/>

<!-- ─────────────────────────────────────────────────────────── qui suis-je -->

<a name="a-propos"></a>
<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/section-about-light.svg"/>
  <img src="./assets/section-about-dark.svg" width="100%" alt="Qui suis-je"/>
</picture></p>

<p align="center">
Je développe des serveurs Minecraft et les outils qui vont autour depuis plusieurs années.<br/>
Plugins, mods Forge, systèmes de jeu complets, panels d'administration, sites vitrines :<br/>
je prends le projet du schéma de base de données jusqu'à la mise en prod.
</p>

<p align="center">
Aujourd'hui je passe en <b>freelance</b> et j'ouvre mon agenda à de nouveaux projets.
</p>

<p align="center">
  <sub><code>BASE</code>&nbsp; France · Remote &nbsp;&nbsp;&nbsp; <code>ÉQUIPE</code>&nbsp; <a href="https://github.com/EarthQuestMc">@EarthQuestMc</a> &nbsp;&nbsp;&nbsp; <code>DISCORD</code>&nbsp; salks</sub>
</p>

<br/>

<!-- ─────────────────────────────────────────────────────────────── projets -->

<a name="projets"></a>
<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/section-projects-light.svg"/>
  <img src="./assets/section-projects-dark.svg" width="100%" alt="Ce que j'ai construit"/>
</picture></p>

<p align="center">
  <a href="https://github.com/EarthQuestMc"><picture><source media="(prefers-color-scheme: light)" srcset="./assets/projects/earthquest-light.svg"/><img src="./assets/projects/earthquest-dark.svg" width="49%" alt="EarthQuest"/></picture></a>
  <picture><source media="(prefers-color-scheme: light)" srcset="./assets/projects/kernpath-light.svg"/><img src="./assets/projects/kernpath-dark.svg" width="49%" alt="Kernpath"/></picture>
</p>
<p align="center">
  <picture><source media="(prefers-color-scheme: light)" srcset="./assets/projects/portfolio-light.svg"/><img src="./assets/projects/portfolio-dark.svg" width="49%" alt="Portfolio"/></picture>
  <picture><source media="(prefers-color-scheme: light)" srcset="./assets/projects/gameoflife-light.svg"/><img src="./assets/projects/gameoflife-dark.svg" width="49%" alt="GameOfLife"/></picture>
</p>
<p align="center">
  <picture><source media="(prefers-color-scheme: light)" srcset="./assets/projects/myschool-light.svg"/><img src="./assets/projects/myschool-dark.svg" width="49%" alt="MySchool"/></picture>
  <picture><source media="(prefers-color-scheme: light)" srcset="./assets/projects/pronote-bot-light.svg"/><img src="./assets/projects/pronote-bot-dark.svg" width="49%" alt="Bot PRONOTE"/></picture>
</p>

<details>
<summary><b>Comment EarthQuest est construit</b> <sub>(diagramme, zoom et déplacement possibles)</sub></summary>
<br/>

```mermaid
flowchart LR
    subgraph Joueurs
        JAVA["Client Java 1.7.10<br/>+ mods Forge"]
        BED["Client Bedrock"]
    end
    subgraph Serveur
        CRU["Crucible<br/>plugins Bukkit"]
    end
    subgraph Web
        API["EQ-API"]
        SITE["EQ-WEB · site"]
        ADM["EQ-ADMIN · panel"]
    end

    JAVA <-->|QuestPacketManager| CRU
    BED -->|EQ-BEDROCK| CRU
    CRU <--> API
    API --> SITE
    API --> ADM

    classDef box fill:#17151b,stroke:#9b7dff,color:#f2f0f4
    classDef core fill:#211a36,stroke:#9b7dff,color:#f2f0f4,stroke-width:2px
    class JAVA,BED,API,SITE,ADM box
    class CRU core
```

</details>

<details>
<summary><b>Et aussi</b></summary>
<br/>

- **Cairn** — l'ancêtre de Kernpath : Git, GitHub et Trello dans une app native Tauri.
- **Satisfactory** — mes forks de [FicsIt-Networks](https://github.com/SalksCore/FicsIt-Networks) et [FicsIt-Cam](https://github.com/SalksCore/FicsIt-Cam) (C++, Unreal).
- **MicroBit** — [le code de mes cartes micro:bit](https://github.com/SalksCore/MicroBit).

</details>

<br/>

<!-- ────────────────────────────────────────────────────────────── parcours -->

<a name="parcours"></a>
<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/section-journey-light.svg"/>
  <img src="./assets/section-journey-dark.svg" width="100%" alt="D'un premier plugin à l'indépendance"/>
</picture></p>

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/journey-light.svg"/>
  <img src="./assets/journey-dark.svg" width="100%" alt="2026 : freelance · 2024 : EarthQuest · 2022 : premiers plugins"/>
</picture></p>

<br/>

<!-- ─────────────────────────────────────────────────────────── compétences -->

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/section-stack-light.svg"/>
  <img src="./assets/section-stack-dark.svg" width="100%" alt="Ce avec quoi je travaille"/>
</picture></p>

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/stack-light.svg"/>
  <img src="./assets/stack-dark.svg" width="100%" alt="Java, TypeScript, Rust, Dart, SQL · Forge, Bukkit, Crucible, Paper, Mixins · Next.js, React, Tailwind, Tauri, Flutter · PostgreSQL, Redis, Supabase, Docker, Git"/>
</picture></p>

<br/>

<!-- ────────────────────────────────────────────────────────────── activité -->

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/section-activity-light.svg"/>
  <img src="./assets/section-activity-dark.svg" width="100%" alt="Mon année en code"/>
</picture></p>

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/generated/activity-light.svg"/>
  <img src="./assets/generated/activity-dark.svg" width="100%" alt="Contributions des 12 derniers mois"/>
</picture></p>

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/generated/languages-light.svg"/>
  <img src="./assets/generated/languages-dark.svg" width="100%" alt="Langages les plus utilisés"/>
</picture></p>

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/SalksCore/SalksCore/output/snake-light.svg"/>
  <img src="https://raw.githubusercontent.com/SalksCore/SalksCore/output/snake-dark.svg" width="100%" alt="Un serpent qui mange mes contributions"/>
</picture></p>

<br/>

<!-- ───────────────────────────────────────────────────────────── livre d'or -->

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/section-guestbook-light.svg"/>
  <img src="./assets/section-guestbook-dark.svg" width="100%" alt="Livre d'or"/>
</picture></p>

<p align="center">
  <a href="https://github.com/SalksCore/SalksCore/issues/new?title=livre-d-or&body=Ton+message+ici+(140+caract%C3%A8res+max)"><picture><source media="(prefers-color-scheme: light)" srcset="./assets/btn-guestbook-light.svg"/><img src="./assets/btn-guestbook-dark.svg" height="46" alt="Signer le livre d'or"/></picture></a>
</p>

<!-- GUESTBOOK:START -->
<p align="center"><sub>Personne n'a encore signé. À toi l'honneur.</sub></p>
<!-- GUESTBOOK:END -->

<br/>

<!-- ─────────────────────────────────────────────────────────────── contact -->

<a name="contact"></a>
<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/section-contact-light.svg"/>
  <img src="./assets/section-contact-dark.svg" width="100%" alt="Un projet en tête ? Parlons-en."/>
</picture></p>

<p align="center">
  <a href="mailto:salks@earthquest.fr"><picture><source media="(prefers-color-scheme: light)" srcset="./assets/btn-email-light.svg"/><img src="./assets/btn-email-dark.svg" height="46" alt="Écrire un email"/></picture></a>
  &nbsp;
  <picture><source media="(prefers-color-scheme: light)" srcset="./assets/btn-discord-light.svg"/><img src="./assets/btn-discord-dark.svg" height="46" alt="Discord : salks"/></picture>
</p>

<br/>

<p align="center"><picture>
  <source media="(prefers-color-scheme: light)" srcset="./assets/footer-light.svg"/>
  <img src="./assets/footer-dark.svg" width="100%" alt="Salks. — Un petit point. Une grande idée."/>
</picture></p>
