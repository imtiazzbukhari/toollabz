import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";

export type StaticPageKey =
  | "home"
  | "tools"
  | "blog"
  | "about"
  | "contact"
  | "methodology"
  | "editorial"
  | "privacy"
  | "terms"
  | "disclaimer"
  | "glossary"
  | "research"
  | "finance"
  | "business"
  | "developer"
  | "pdf"
  | "utility"
  | "realEstate"
  | "marketing"
  | "ai";

export type PageCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
};

const PAGE_KEYS: StaticPageKey[] = [
  "home",
  "tools",
  "blog",
  "about",
  "contact",
  "methodology",
  "editorial",
  "privacy",
  "terms",
  "disclaimer",
  "glossary",
  "research",
  "finance",
  "business",
  "developer",
  "pdf",
  "utility",
  "realEstate",
  "marketing",
  "ai",
];

const EN: Record<StaticPageKey, PageCopy> = {
  home: {
    title: "Toollabz — Free online calculators and utilities",
    description:
      "Free finance, tax, business, PDF and developer tools. Visible formulas, no account. Loan, salary after tax, VAT, ROI and more.",
    h1: "Free online calculators with visible formulas",
    intro:
      "Toollabz is a directory of free browser tools. Each calculator shows the formula, assumptions and a worked example so you can check the result instead of trusting a black box.",
  },
  tools: {
    title: "All free tools",
    description: "Browse every Toollabz calculator, converter and PDF utility. Filter by category or search by name.",
    h1: "All tools",
    intro: "Open any calculator in the browser. No account is required for core calculations.",
  },
  blog: {
    title: "Guides and explainers",
    description: "Practical guides that pair with Toollabz calculators: take-home pay, loans, VAT, PDF workflows and ROI.",
    h1: "Blog",
    intro: "Short reads that match how the tools work — numbers, trade-offs and the details people forget to put in a spreadsheet.",
  },
  about: {
    title: "About Toollabz",
    description: "Who builds Toollabz, why formulas are published, and how to contact the editorial and engineering team.",
    h1: "About Toollabz",
    intro:
      "Toollabz launched in April 2026 to ship accurate free calculators with visible assumptions. Founder Imtiaz Ahmad leads engineering and technical SEO. Editorial reviews finance pages when rates or public guidance change.",
  },
  contact: {
    title: "Contact Toollabz",
    description: "Contact Toollabz for corrections, partnership questions or tool feedback. Email hello@toollabz.com.",
    h1: "Contact",
    intro: "For corrections, methodology questions or partnerships, email hello@toollabz.com. We do not provide personal financial, tax or legal advice.",
  },
  methodology: {
    title: "Calculation methodology",
    description: "How Toollabz documents formulas, assumptions, rounding and limitations on calculator pages.",
    h1: "Methodology",
    intro:
      "Every important calculator should state what it computes, which formula it uses, which inputs are assumed, and what the result does not include. Outputs are planning estimates, not professional advice.",
  },
  editorial: {
    title: "Editorial policy",
    description: "How Toollabz reviews finance and legal-adjacent pages, updates dates, and avoids invented credentials.",
    h1: "Editorial policy",
    intro:
      "We publish formulas and sources we can point to. We do not invent reviews, ratings, authors or statistics. Finance pages are updated when public rates or tool behaviour change.",
  },
  privacy: {
    title: "Privacy policy",
    description: "How Toollabz handles analytics, cookies and calculator inputs. Core tools run in your browser.",
    h1: "Privacy policy",
    intro: "Most calculators run in your browser and do not require an account. See the full policy for analytics and contact data.",
  },
  terms: {
    title: "Terms of use",
    description: "Terms for using Toollabz calculators and content. Results are estimates, not professional advice.",
    h1: "Terms of use",
    intro: "By using Toollabz you agree that calculator outputs are informational estimates. Confirm material decisions with a qualified professional.",
  },
  disclaimer: {
    title: "Disclaimer",
    description: "Toollabz calculators are planning tools. They are not tax, legal, medical or investment advice.",
    h1: "Disclaimer",
    intro: "Results depend on the numbers you enter and the assumptions listed on each page. They are not a substitute for advice from a qualified professional.",
  },
  glossary: {
    title: "Glossary",
    description: "Short definitions for finance, tax and calculator terms used across Toollabz tools.",
    h1: "Glossary",
    intro: "Plain-language definitions that link back to the calculators where the term is used.",
  },
  research: {
    title: "Research and reference data",
    description: "Published reference figures used by Toollabz calculators, including UK tax-year context where relevant.",
    h1: "Research",
    intro: "Reference tables and notes we cite on calculator pages. Figures are labelled with the tax year or calendar year they apply to.",
  },
  finance: {
    title: "Finance calculators",
    description: "Free loan, interest, ROI, VAT and take-home pay calculators with formulas on the page.",
    h1: "Finance tools",
    intro: "Loan payments, compound interest, margins and tax estimates. Country-specific tax tools stay on their own pages and are not rewritten as local law.",
  },
  business: {
    title: "Business calculators",
    description: "Break-even, profit margin, invoice and planning tools for small businesses.",
    h1: "Business tools",
    intro: "Planning calculators for pricing, margins and simple forecasts. They do not replace accounting software.",
  },
  developer: {
    title: "Developer tools",
    description: "JSON formatter, Base64, password generator and other browser developer utilities.",
    h1: "Developer tools",
    intro: "Small utilities that run in the browser. Encoding and formatting tools do not upload your payload to our servers.",
  },
  pdf: {
    title: "PDF tools",
    description: "Merge, compress and related PDF utilities that run in the browser where possible.",
    h1: "PDF tools",
    intro: "Browser PDF helpers for common file tasks. Check each tool page for what stays on-device.",
  },
  utility: {
    title: "Utility converters",
    description: "Unit converters, percentage tools and everyday calculators.",
    h1: "Utility tools",
    intro: "Fast converters and everyday calculators with the conversion method shown on the page.",
  },
  realEstate: {
    title: "Real estate calculators",
    description: "Mortgage and property planning calculators. Outputs are estimates, not a lender decision.",
    h1: "Real estate tools",
    intro: "Mortgage and property planning maths. Fees, insurance and lender rules are often excluded — read the assumptions.",
  },
  marketing: {
    title: "Marketing calculators",
    description: "ROI and campaign maths tools for marketers who need a transparent formula.",
    h1: "Marketing tools",
    intro: "Simple campaign maths. They do not pull live ad-network data unless a page says so.",
  },
  ai: {
    title: "AI tools",
    description: "Browser AI utilities on Toollabz, with clear limits and no invented capabilities.",
    h1: "AI tools",
    intro: "Small AI helpers. We describe what each tool actually does and do not claim model capabilities we do not ship.",
  },
};

type LocalePack = Partial<Record<StaticPageKey, Partial<PageCopy>>>;

const OVERRIDES: Record<Exclude<Locale, "en">, LocalePack> = {
  fr: {
    home: {
      title: "Toollabz — Calculateurs et utilitaires en ligne gratuits",
      description:
        "Outils gratuits finance, fiscalité, entreprise, PDF et développement. Formules visibles, sans compte. Prêt, salaire net, TVA, ROI.",
      h1: "Calculateurs gratuits avec formules visibles",
      intro:
        "Toollabz regroupe des outils gratuits dans le navigateur. Chaque calculateur affiche la formule, les hypothèses et un exemple pour vérifier le résultat.",
    },
    tools: { title: "Tous les outils gratuits", h1: "Tous les outils", intro: "Ouvrez n’importe quel calculateur dans le navigateur. Aucun compte n’est requis." },
    blog: { title: "Guides et explications", h1: "Blog", intro: "Textes courts alignés sur le fonctionnement réel des outils." },
    about: { title: "À propos de Toollabz", h1: "À propos de Toollabz", intro: "Toollabz a été lancé en avril 2026 pour publier des calculateurs gratuits avec des hypothèses visibles. Imtiaz Ahmad dirige l’ingénierie et le SEO technique." },
    contact: { title: "Contacter Toollabz", h1: "Contact", intro: "Pour une correction ou un partenariat : hello@toollabz.com. Nous ne donnons pas de conseil fiscal ou juridique personnalisé." },
    methodology: { title: "Méthodologie de calcul", h1: "Méthodologie", intro: "Chaque calculateur important indique ce qu’il calcule, la formule, les hypothèses et ce que le résultat n’inclut pas." },
    editorial: { title: "Politique éditoriale", h1: "Politique éditoriale", intro: "Nous publions des formules et des sources vérifiables. Pas d’avis, notes ou auteurs inventés." },
    privacy: { title: "Politique de confidentialité", h1: "Confidentialité", intro: "La plupart des calculateurs s’exécutent dans votre navigateur et n’exigent pas de compte." },
    terms: { title: "Conditions d’utilisation", h1: "Conditions d’utilisation", intro: "Les résultats sont des estimations. Confirmez les décisions importantes avec un professionnel." },
    disclaimer: { title: "Avertissement", h1: "Avertissement", intro: "Les résultats dépendent de vos saisies et des hypothèses de la page. Ce n’est pas un conseil professionnel." },
    glossary: { title: "Glossaire", h1: "Glossaire", intro: "Définitions claires, reliées aux calculateurs où le terme apparaît." },
    research: { title: "Données de référence", h1: "Recherche", intro: "Tableaux et notes cités sur les pages d’outils, avec l’année fiscale ou civile indiquée." },
    finance: { title: "Calculateurs financiers", h1: "Outils finance", intro: "Prêts, intérêts composés, marges et estimations fiscales. Les outils nationaux restent spécifiques à leur pays." },
    business: { title: "Calculateurs d’entreprise", h1: "Outils entreprise", intro: "Seuil de rentabilité, marge et planification. Ils ne remplacent pas une comptabilité." },
    developer: { title: "Outils développeur", h1: "Outils développeur", intro: "Utilitaires navigateur : JSON, Base64, mots de passe. Les données ne sont pas envoyées au serveur." },
    pdf: { title: "Outils PDF", h1: "Outils PDF", intro: "Fusion, compression et tâches PDF courantes, autant que possible dans le navigateur." },
    utility: { title: "Convertisseurs et utilitaires", h1: "Utilitaires", intro: "Conversions et calculateurs du quotidien, avec la méthode affichée." },
    realEstate: { title: "Calculateurs immobilier", h1: "Outils immobilier", intro: "Mathématiques de prêt et de bien. Frais et règles du prêteur sont souvent exclus." },
    marketing: { title: "Calculateurs marketing", h1: "Outils marketing", intro: "ROI et maths de campagne avec formule visible." },
    ai: { title: "Outils IA", h1: "Outils IA", intro: "Petits assistants. Nous décrivons uniquement ce que l’outil fait réellement." },
  },
  pt: {
    home: {
      title: "Toollabz — Calculadoras e utilitários online grátis",
      description: "Ferramentas grátis de finanças, impostos, negócios, PDF e programação. Fórmulas visíveis, sem conta.",
      h1: "Calculadoras grátis com fórmulas visíveis",
      intro: "A Toollabz reúne ferramentas no browser. Cada calculadora mostra a fórmula, os pressupostos e um exemplo para validar o resultado.",
    },
    tools: { title: "Todas as ferramentas", h1: "Todas as ferramentas", intro: "Abra qualquer calculadora no browser. Não é necessária conta." },
    blog: { title: "Guias e explicações", h1: "Blog", intro: "Textos curtos alinhados com o funcionamento real das ferramentas." },
    about: { title: "Sobre a Toollabz", h1: "Sobre a Toollabz", intro: "A Toollabz começou em abril de 2026 para publicar calculadoras grátis com pressupostos visíveis." },
    contact: { title: "Contactar a Toollabz", h1: "Contacto", intro: "Correções ou parcerias: hello@toollabz.com. Não damos aconselhamento fiscal ou jurídico pessoal." },
    methodology: { title: "Metodologia de cálculo", h1: "Metodologia", intro: "Cada calculadora importante indica o que calcula, a fórmula, os pressupostos e o que o resultado não inclui." },
    editorial: { title: "Política editorial", h1: "Política editorial", intro: "Publicamos fórmulas e fontes verificáveis. Sem avaliações ou autores inventados." },
    privacy: { title: "Política de privacidade", h1: "Privacidade", intro: "A maioria das calculadoras corre no browser e não exige conta." },
    terms: { title: "Termos de utilização", h1: "Termos de utilização", intro: "Os resultados são estimativas. Confirme decisões importantes com um profissional." },
    disclaimer: { title: "Aviso legal", h1: "Aviso legal", intro: "Os resultados dependem dos valores que introduz e dos pressupostos da página." },
    glossary: { title: "Glossário", h1: "Glossário", intro: "Definições simples ligadas às calculadoras onde o termo aparece." },
    research: { title: "Dados de referência", h1: "Investigação", intro: "Tabelas e notas citadas nas páginas das ferramentas." },
    finance: { title: "Calculadoras financeiras", h1: "Ferramentas financeiras", intro: "Empréstimos, juros compostos, margens e estimativas fiscais." },
    business: { title: "Calculadoras de negócio", h1: "Ferramentas de negócio", intro: "Ponto de equilíbrio, margem e planeamento." },
    developer: { title: "Ferramentas de programação", h1: "Ferramentas de programação", intro: "Utilitários no browser: JSON, Base64, palavras-passe." },
    pdf: { title: "Ferramentas PDF", h1: "Ferramentas PDF", intro: "Juntar e comprimir PDF no browser sempre que possível." },
    utility: { title: "Conversores e utilitários", h1: "Utilitários", intro: "Conversões do dia a dia com o método visível." },
    realEstate: { title: "Calculadoras imobiliárias", h1: "Ferramentas imobiliárias", intro: "Matemática de crédito e imóvel. Taxas do banco ficam muitas vezes de fora." },
    marketing: { title: "Calculadoras de marketing", h1: "Ferramentas de marketing", intro: "ROI e contas de campanha com fórmula visível." },
    ai: { title: "Ferramentas de IA", h1: "Ferramentas de IA", intro: "Ajudantes pequenos. Descrevemos só o que a ferramenta faz de facto." },
  },
  es: {
    home: {
      title: "Toollabz — Calculadoras y utilidades online gratis",
      description: "Herramientas gratis de finanzas, impuestos, empresa, PDF y desarrollo. Fórmulas visibles, sin cuenta.",
      h1: "Calculadoras gratis con fórmulas visibles",
      intro: "Toollabz agrupa herramientas en el navegador. Cada calculadora muestra la fórmula, los supuestos y un ejemplo para comprobar el resultado.",
    },
    tools: { title: "Todas las herramientas", h1: "Todas las herramientas", intro: "Abre cualquier calculadora en el navegador. No hace falta cuenta." },
    blog: { title: "Guías y explicaciones", h1: "Blog", intro: "Textos cortos alineados con cómo funcionan de verdad las herramientas." },
    about: { title: "Acerca de Toollabz", h1: "Acerca de Toollabz", intro: "Toollabz nació en abril de 2026 para publicar calculadoras gratis con supuestos visibles." },
    contact: { title: "Contactar con Toollabz", h1: "Contacto", intro: "Correcciones o colaboraciones: hello@toollabz.com. No damos asesoramiento fiscal o jurídico personal." },
    methodology: { title: "Metodología de cálculo", h1: "Metodología", intro: "Cada calculadora importante indica qué calcula, la fórmula, los supuestos y qué no incluye el resultado." },
    editorial: { title: "Política editorial", h1: "Política editorial", intro: "Publicamos fórmulas y fuentes comprobables. Sin reseñas ni autores inventados." },
    privacy: { title: "Política de privacidad", h1: "Privacidad", intro: "La mayoría de las calculadoras se ejecutan en tu navegador y no piden cuenta." },
    terms: { title: "Términos de uso", h1: "Términos de uso", intro: "Los resultados son estimaciones. Confirma las decisiones importantes con un profesional." },
    disclaimer: { title: "Aviso legal", h1: "Aviso legal", intro: "Los resultados dependen de tus datos y de los supuestos de cada página." },
    glossary: { title: "Glosario", h1: "Glosario", intro: "Definiciones claras enlazadas a las calculadoras donde aparece el término." },
    research: { title: "Datos de referencia", h1: "Investigación", intro: "Tablas y notas citadas en las páginas de herramientas." },
    finance: { title: "Calculadoras financieras", h1: "Herramientas financieras", intro: "Préstamos, interés compuesto, márgenes y estimaciones fiscales." },
    business: { title: "Calculadoras de empresa", h1: "Herramientas de empresa", intro: "Umbral de rentabilidad, margen y planificación." },
    developer: { title: "Herramientas para desarrolladores", h1: "Herramientas para desarrolladores", intro: "Utilidades en el navegador: JSON, Base64, contraseñas." },
    pdf: { title: "Herramientas PDF", h1: "Herramientas PDF", intro: "Combinar y comprimir PDF en el navegador cuando es posible." },
    utility: { title: "Conversores y utilidades", h1: "Utilidades", intro: "Conversiones cotidianas con el método a la vista." },
    realEstate: { title: "Calculadoras inmobiliarias", h1: "Herramientas inmobiliarias", intro: "Matemáticas de hipoteca e inmueble. Las comisiones del banco suelen quedar fuera." },
    marketing: { title: "Calculadoras de marketing", h1: "Herramientas de marketing", intro: "ROI y números de campaña con fórmula visible." },
    ai: { title: "Herramientas de IA", h1: "Herramientas de IA", intro: "Asistentes pequeños. Solo describimos lo que la herramienta hace de verdad." },
  },
  da: {
    home: {
      title: "Toollabz — Gratis online-beregnere",
      description: "Gratis værktøjer til økonomi, skat, virksomhed, PDF og udvikling. Synlige formler, ingen konto.",
      h1: "Gratis beregnere med synlige formler",
      intro: "Toollabz samler browser-værktøjer. Hver beregner viser formel, forudsætninger og et eksempel, så du kan kontrollere resultatet.",
    },
    tools: { title: "Alle værktøjer", h1: "Alle værktøjer", intro: "Åbn en beregner i browseren. Ingen konto kræves." },
    blog: { title: "Guides", h1: "Blog", intro: "Korte tekster, der matcher værktøjernes faktiske logik." },
    about: { title: "Om Toollabz", h1: "Om Toollabz", intro: "Toollabz startede i april 2026 for at udgive gratis beregnere med synlige forudsætninger." },
    contact: { title: "Kontakt Toollabz", h1: "Kontakt", intro: "Rettelser eller samarbejde: hello@toollabz.com." },
    methodology: { title: "Beregningsmetode", h1: "Metode", intro: "Vigtige beregnere angiver formel, forudsætninger og hvad resultatet ikke inkluderer." },
    editorial: { title: "Redaktionel politik", h1: "Redaktionel politik", intro: "Vi offentliggør efterprøvelige formler og kilder." },
    privacy: { title: "Privatlivspolitik", h1: "Privatliv", intro: "De fleste beregnere kører i browseren uden konto." },
    terms: { title: "Vilkår", h1: "Vilkår", intro: "Resultater er skøn. Bekræft vigtige beslutninger med en fagperson." },
    disclaimer: { title: "Ansvarsfraskrivelse", h1: "Ansvarsfraskrivelse", intro: "Resultatet afhænger af dine tal og sidens forudsætninger." },
    glossary: { title: "Ordliste", h1: "Ordliste", intro: "Korte definitioner med links til de relevante beregnere." },
    research: { title: "Referencedata", h1: "Forskning", intro: "Tabeller og noter, vi henviser til på værktøjssider." },
    finance: { title: "Økonomiberegnere", h1: "Økonomiværktøjer", intro: "Lån, rentes rente, marginer og skøn over skat." },
    business: { title: "Virksomhedsberegnere", h1: "Virksomhedsværktøjer", intro: "Nulpunkt, avance og planlægning." },
    developer: { title: "Udviklerværktøjer", h1: "Udviklerværktøjer", intro: "JSON, Base64 og adgangskoder i browseren." },
    pdf: { title: "PDF-værktøjer", h1: "PDF-værktøjer", intro: "Flet og komprimér PDF i browseren, når det er muligt." },
    utility: { title: "Omregnere", h1: "Nyttige værktøjer", intro: "Hverdagsomregning med synlig metode." },
    realEstate: { title: "Ejendomsberegnere", h1: "Ejendomsværktøjer", intro: "Boliglån og ejendomsmatematik. Bankgebyrer er ofte udeladt." },
    marketing: { title: "Marketingberegnere", h1: "Marketingværktøjer", intro: "ROI og kampagne-matematik med synlig formel." },
    ai: { title: "AI-værktøjer", h1: "AI-værktøjer", intro: "Små hjælpere. Vi beskriver kun det, værktøjet faktisk gør." },
  },
  sv: {
    home: {
      title: "Toollabz — Gratis kalkylatorer online",
      description: "Gratis verktyg för ekonomi, skatt, företag, PDF och utveckling. Synliga formler, inget konto.",
      h1: "Gratis kalkylatorer med synliga formler",
      intro: "Toollabz samlar webbläsarverktyg. Varje kalkylator visar formel, antaganden och ett exempel så att du kan kontrollera resultatet.",
    },
    tools: { title: "Alla verktyg", h1: "Alla verktyg", intro: "Öppna valfri kalkylator i webbläsaren. Inget konto behövs." },
    blog: { title: "Guider", h1: "Blogg", intro: "Korta texter som följer hur verktygen faktiskt räknar." },
    about: { title: "Om Toollabz", h1: "Om Toollabz", intro: "Toollabz startade i april 2026 för att publicera gratis kalkylatorer med synliga antaganden." },
    contact: { title: "Kontakta Toollabz", h1: "Kontakt", intro: "Rättelser eller samarbete: hello@toollabz.com." },
    methodology: { title: "Beräkningsmetod", h1: "Metod", intro: "Viktiga kalkylatorer anger formel, antaganden och vad resultatet inte inkluderar." },
    editorial: { title: "Redaktionell policy", h1: "Redaktionell policy", intro: "Vi publicerar kontrollerbara formler och källor." },
    privacy: { title: "Integritetspolicy", h1: "Integritet", intro: "De flesta kalkylatorer körs i webbläsaren utan konto." },
    terms: { title: "Villkor", h1: "Villkor", intro: "Resultaten är uppskattningar. Bekräfta viktiga beslut med en fackperson." },
    disclaimer: { title: "Ansvarsfriskrivning", h1: "Ansvarsfriskrivning", intro: "Resultatet beror på dina siffror och sidans antaganden." },
    glossary: { title: "Ordlista", h1: "Ordlista", intro: "Korta definitioner med länkar till rätt kalkylator." },
    research: { title: "Referensdata", h1: "Forskning", intro: "Tabeller och noter som vi citerar på verktygssidor." },
    finance: { title: "Ekonomikalkylatorer", h1: "Ekonomiverktyg", intro: "Lån, ränta på ränta, marginaler och skatteuppskattningar." },
    business: { title: "Företagskalkylatorer", h1: "Företagsverktyg", intro: "Nollpunkt, marginal och planering." },
    developer: { title: "Utvecklarverktyg", h1: "Utvecklarverktyg", intro: "JSON, Base64 och lösenord i webbläsaren." },
    pdf: { title: "PDF-verktyg", h1: "PDF-verktyg", intro: "Slå ihop och komprimera PDF i webbläsaren när det går." },
    utility: { title: "Omvandlare", h1: "Verktyg", intro: "Vardagliga omvandlingar med synlig metod." },
    realEstate: { title: "Bostadskalkylatorer", h1: "Bostadsverktyg", intro: "Bolånematte. Bankavgifter utelämnas ofta." },
    marketing: { title: "Marknadsföringskalkylatorer", h1: "Marknadsföringsverktyg", intro: "ROI och kampanjmatte med synlig formel." },
    ai: { title: "AI-verktyg", h1: "AI-verktyg", intro: "Små hjälpare. Vi beskriver bara det verktyget faktiskt gör." },
  },
  fi: {
    home: {
      title: "Toollabz — Ilmaisia laskureita verkossa",
      description: "Ilmaisia talous-, vero-, yritys-, PDF- ja kehittäjätyökaluja. Näkyvät kaavat, ei tiliä.",
      h1: "Ilmaisia laskureita näkyvine kaavoineen",
      intro: "Toollabz kokoaa selaintyökaluja. Jokainen laskuri näyttää kaavan, oletukset ja esimerkin, jotta tuloksen voi tarkistaa.",
    },
    tools: { title: "Kaikki työkalut", h1: "Kaikki työkalut", intro: "Avaa mikä tahansa laskuri selaimessa. Tiliä ei tarvita." },
    blog: { title: "Oppaat", h1: "Blogi", intro: "Lyhyitä tekstejä, jotka vastaavat työkalujen todellista logiikkaa." },
    about: { title: "Tietoa Toollabzista", h1: "Tietoa Toollabzista", intro: "Toollabz perustettiin huhtikuussa 2026 julkaisemaan ilmaisia laskureita näkyvine oletuksineen." },
    contact: { title: "Ota yhteyttä", h1: "Yhteys", intro: "Korjaukset tai yhteistyö: hello@toollabz.com." },
    methodology: { title: "Laskentamenetelmä", h1: "Menetelmä", intro: "Tärkeät laskurit kertovat kaavan, oletukset ja sen, mitä tulos ei sisällä." },
    editorial: { title: "Toimituspolitiikka", h1: "Toimituspolitiikka", intro: "Julkaisemme tarkistettavia kaavoja ja lähteitä." },
    privacy: { title: "Tietosuojakäytäntö", h1: "Tietosuoja", intro: "Useimmat laskurit toimivat selaimessa ilman tiliä." },
    terms: { title: "Käyttöehdot", h1: "Käyttöehdot", intro: "Tulokset ovat arvioita. Vahvista tärkeät päätökset ammattilaisen kanssa." },
    disclaimer: { title: "Vastuuvapauslauseke", h1: "Vastuuvapaus", intro: "Tulos riippuu syöttämistäsi luvuista ja sivun oletuksista." },
    glossary: { title: "Sanasto", h1: "Sanasto", intro: "Lyhyet määritelmät ja linkit oikeisiin laskureihin." },
    research: { title: "Viitetiedot", h1: "Tutkimus", intro: "Taulukot ja huomiot, joihin työkalusivuilla viitataan." },
    finance: { title: "Talouslaskurit", h1: "Talousvälineet", intro: "Lainat, korkoa korolle, katteet ja veroarviot." },
    business: { title: "Yrityslaskurit", h1: "Yritysvälineet", intro: "Kriittinen piste, kate ja suunnittelu." },
    developer: { title: "Kehittäjätyökalut", h1: "Kehittäjätyökalut", intro: "JSON, Base64 ja salasanat selaimessa." },
    pdf: { title: "PDF-työkalut", h1: "PDF-työkalut", intro: "Yhdistä ja pakkaa PDF selaimessa kun mahdollista." },
    utility: { title: "Muuntimet", h1: "Aputyökalut", intro: "Arjen muunnokset näkyvällä menetelmällä." },
    realEstate: { title: "Kiinteistölaskurit", h1: "Kiinteistövälineet", intro: "Asuntolainamatematiikka. Pankin kulut jäävät usein pois." },
    marketing: { title: "Markkinointilaskurit", h1: "Markkinointivälineet", intro: "ROI ja kampanjalaskenta näkyvällä kaavalla." },
    ai: { title: "Tekoälytyökalut", h1: "Tekoälytyökalut", intro: "Pieniä apureita. Kuvaamme vain sen, mitä työkalu oikeasti tekee." },
  },
  cs: {
    home: {
      title: "Toollabz — Bezplatné online kalkulačky",
      description: "Bezplatné nástroje pro finance, daně, firmu, PDF a vývoj. Viditelné vzorce, bez účtu.",
      h1: "Bezplatné kalkulačky s viditelnými vzorci",
      intro: "Toollabz sdružuje nástroje v prohlížeči. Každá kalkulačka ukáže vzorec, předpoklady a příklad, abyste výsledek ověřili.",
    },
    tools: { title: "Všechny nástroje", h1: "Všechny nástroje", intro: "Otevřete kalkulačku v prohlížeči. Účet není potřeba." },
    blog: { title: "Průvodci", h1: "Blog", intro: "Krátké texty podle skutečné logiky nástrojů." },
    about: { title: "O Toollabz", h1: "O Toollabz", intro: "Toollabz vznikl v dubnu 2026, aby zveřejňoval bezplatné kalkulačky s viditelnými předpoklady." },
    contact: { title: "Kontaktovat Toollabz", h1: "Kontakt", intro: "Opravy nebo spolupráce: hello@toollabz.com." },
    methodology: { title: "Metodika výpočtu", h1: "Metodika", intro: "Důležité kalkulačky uvádějí vzorec, předpoklady a to, co výsledek nezahrnuje." },
    editorial: { title: "Redakční zásady", h1: "Redakční zásady", intro: "Zveřejňujeme ověřitelné vzorce a zdroje." },
    privacy: { title: "Zásady ochrany soukromí", h1: "Soukromí", intro: "Většina kalkulaček běží v prohlížeči bez účtu." },
    terms: { title: "Podmínky použití", h1: "Podmínky použití", intro: "Výsledky jsou odhady. Zásadní rozhodnutí ověřte s odborníkem." },
    disclaimer: { title: "Vyloučení odpovědnosti", h1: "Vyloučení odpovědnosti", intro: "Výsledek závisí na zadaných číslech a předpokladech stránky." },
    glossary: { title: "Slovník", h1: "Slovník", intro: "Stručné definice s odkazy na příslušné kalkulačky." },
    research: { title: "Referenční data", h1: "Výzkum", intro: "Tabulky a poznámky citované na stránkách nástrojů." },
    finance: { title: "Finanční kalkulačky", h1: "Finanční nástroje", intro: "Úvěry, složené úročení, marže a daňové odhady." },
    business: { title: "Firemní kalkulačky", h1: "Firemní nástroje", intro: "Bod zvratu, marže a plánování." },
    developer: { title: "Vývojářské nástroje", h1: "Vývojářské nástroje", intro: "JSON, Base64 a hesla v prohlížeči." },
    pdf: { title: "PDF nástroje", h1: "PDF nástroje", intro: "Slučování a komprese PDF v prohlížeči, pokud je to možné." },
    utility: { title: "Převodníky", h1: "Utility", intro: "Každodenní převody s viditelnou metodou." },
    realEstate: { title: "Realitní kalkulačky", h1: "Realitní nástroje", intro: "Matematika hypoték. Bankovní poplatky často chybí." },
    marketing: { title: "Marketingové kalkulačky", h1: "Marketingové nástroje", intro: "ROI a kampaňová matematika s viditelným vzorcem." },
    ai: { title: "Nástroje AI", h1: "Nástroje AI", intro: "Malí pomocníci. Popisujeme jen to, co nástroj skutečně dělá." },
  },
  ro: {
    home: {
      title: "Toollabz — Calculatoare online gratuite",
      description: "Instrumente gratuite pentru finanțe, taxe, afaceri, PDF și dezvoltare. Formule vizibile, fără cont.",
      h1: "Calculatoare gratuite cu formule vizibile",
      intro: "Toollabz reunește instrumente în browser. Fiecare calculator arată formula, ipotezele și un exemplu ca să poți verifica rezultatul.",
    },
    tools: { title: "Toate instrumentele", h1: "Toate instrumentele", intro: "Deschide orice calculator în browser. Nu e nevoie de cont." },
    blog: { title: "Ghiduri", h1: "Blog", intro: "Texte scurte aliniate cu logica reală a instrumentelor." },
    about: { title: "Despre Toollabz", h1: "Despre Toollabz", intro: "Toollabz a pornit în aprilie 2026 pentru a publica calculatoare gratuite cu ipoteze vizibile." },
    contact: { title: "Contactează Toollabz", h1: "Contact", intro: "Corecții sau parteneriate: hello@toollabz.com." },
    methodology: { title: "Metodologia de calcul", h1: "Metodologie", intro: "Calculatoarele importante indică formula, ipotezele și ce nu include rezultatul." },
    editorial: { title: "Politică editorială", h1: "Politică editorială", intro: "Publicăm formule și surse verificabile." },
    privacy: { title: "Politică de confidențialitate", h1: "Confidențialitate", intro: "Majoritatea calculatoarelor rulează în browser, fără cont." },
    terms: { title: "Termeni de utilizare", h1: "Termeni de utilizare", intro: "Rezultatele sunt estimări. Confirmă deciziile importante cu un specialist." },
    disclaimer: { title: "Declinare de responsabilitate", h1: "Declinare", intro: "Rezultatul depinde de valorile introduse și de ipotezele paginii." },
    glossary: { title: "Glosar", h1: "Glosar", intro: "Definiții scurte, legate de calculatoarele unde apare termenul." },
    research: { title: "Date de referință", h1: "Cercetare", intro: "Tabele și note citate pe paginile instrumentelor." },
    finance: { title: "Calculatoare financiare", h1: "Instrumente financiare", intro: "Credite, dobândă compusă, marje și estimări fiscale." },
    business: { title: "Calculatoare de business", h1: "Instrumente de business", intro: "Prag de rentabilitate, marjă și planificare." },
    developer: { title: "Instrumente pentru dezvoltatori", h1: "Instrumente pentru dezvoltatori", intro: "JSON, Base64 și parole în browser." },
    pdf: { title: "Instrumente PDF", h1: "Instrumente PDF", intro: "Unește și comprimă PDF în browser, când e posibil." },
    utility: { title: "Convertizoare", h1: "Utilitare", intro: "Conversii de zi cu zi, cu metoda la vedere." },
    realEstate: { title: "Calculatoare imobiliare", h1: "Instrumente imobiliare", intro: "Matematică de credit ipotecar. Comisioanele băncii sunt adesea excluse." },
    marketing: { title: "Calculatoare de marketing", h1: "Instrumente de marketing", intro: "ROI și calcule de campanie cu formulă vizibilă." },
    ai: { title: "Instrumente AI", h1: "Instrumente AI", intro: "Ajutoare mici. Descriem doar ce face instrumentul cu adevărat." },
  },
  hu: {
    home: {
      title: "Toollabz — Ingyenes online kalkulátorok",
      description: "Ingyenes pénzügyi, adó-, üzleti, PDF- és fejlesztői eszközök. Látható képletek, fiók nélkül.",
      h1: "Ingyenes kalkulátorok látható képletekkel",
      intro: "A Toollabz böngészős eszközöket gyűjt. Minden kalkulátor megmutatja a képletet, a feltételezéseket és egy példát, hogy ellenőrizhesd az eredményt.",
    },
    tools: { title: "Minden eszköz", h1: "Minden eszköz", intro: "Nyiss meg bármelyik kalkulátort a böngészőben. Nincs szükség fiókra." },
    blog: { title: "Útmutatók", h1: "Blog", intro: "Rövid írások, amelyek követik az eszközök valódi logikáját." },
    about: { title: "A Toollabzról", h1: "A Toollabzról", intro: "A Toollabz 2026 áprilisában indult, hogy ingyenes kalkulátorokat adjon ki látható feltételezésekkel." },
    contact: { title: "Kapcsolat a Toollabzzal", h1: "Kapcsolat", intro: "Javítások vagy együttműködés: hello@toollabz.com." },
    methodology: { title: "Számítási módszertan", h1: "Módszertan", intro: "A fontos kalkulátorok megadják a képletet, a feltételezéseket és azt, amit az eredmény nem tartalmaz." },
    editorial: { title: "Szerkesztői irányelv", h1: "Szerkesztői irányelv", intro: "Ellenőrizhető képleteket és forrásokat közlünk." },
    privacy: { title: "Adatvédelmi irányelv", h1: "Adatvédelem", intro: "A kalkulátorok többsége a böngészőben fut, fiók nélkül." },
    terms: { title: "Felhasználási feltételek", h1: "Felhasználási feltételek", intro: "Az eredmények becslések. Fontos döntést szakemberrel erősíts meg." },
    disclaimer: { title: "Jogi nyilatkozat", h1: "Jogi nyilatkozat", intro: "Az eredmény a megadott számoktól és az oldalon lévő feltételezésektől függ." },
    glossary: { title: "Szójegyzék", h1: "Szójegyzék", intro: "Rövid definíciók a megfelelő kalkulátorokra mutató hivatkozásokkal." },
    research: { title: "Referenciaadatok", h1: "Kutatás", intro: "Táblázatok és jegyzetek, amelyekre az eszközoldalak hivatkoznak." },
    finance: { title: "Pénzügyi kalkulátorok", h1: "Pénzügyi eszközök", intro: "Hitelek, kamatos kamat, árrés és adóbecslések." },
    business: { title: "Üzleti kalkulátorok", h1: "Üzleti eszközök", intro: "Fedezeti pont, árrés és tervezés." },
    developer: { title: "Fejlesztői eszközök", h1: "Fejlesztői eszközök", intro: "JSON, Base64 és jelszavak a böngészőben." },
    pdf: { title: "PDF-eszközök", h1: "PDF-eszközök", intro: "PDF egyesítése és tömörítése a böngészőben, ha lehet." },
    utility: { title: "Átváltók", h1: "Segédeszközök", intro: "Mindennapi átváltások látható módszerrel." },
    realEstate: { title: "Ingatlan-kalkulátorok", h1: "Ingatlanezközök", intro: "Jelzálog-matematika. A banki díjak gyakran kimaradnak." },
    marketing: { title: "Marketingkalkulátorok", h1: "Marketingeszközök", intro: "ROI és kampányszámítás látható képlettel." },
    ai: { title: "MI-eszközök", h1: "MI-eszközök", intro: "Kis segítők. Csak azt írjuk le, amit az eszköz ténylegesen csinál." },
  },
  el: {
    home: {
      title: "Toollabz — Δωρεάν διαδικτυακοί υπολογιστές",
      description: "Δωρεάν εργαλεία για οικονομικά, φόρους, επιχείρηση, PDF και ανάπτυξη. Εμφανείς τύποι, χωρίς λογαριασμό.",
      h1: "Δωρεάν υπολογιστές με εμφανείς τύπους",
      intro: "Το Toollabz συγκεντρώνει εργαλεία στον φυλλομετρητή. Κάθε υπολογιστής δείχνει τον τύπο, τις υποθέσεις και ένα παράδειγμα για να ελέγξετε το αποτέλεσμα.",
    },
    tools: { title: "Όλα τα εργαλεία", h1: "Όλα τα εργαλεία", intro: "Ανοίξτε οποιονδήποτε υπολογιστή στον φυλλομετρητή. Δεν χρειάζεται λογαριασμός." },
    blog: { title: "Οδηγοί", h1: "Ιστολόγιο", intro: "Σύντομα κείμενα ευθυγραμμισμένα με την πραγματική λογική των εργαλείων." },
    about: { title: "Σχετικά με το Toollabz", h1: "Σχετικά με το Toollabz", intro: "Το Toollabz ξεκίνησε τον Απρίλιο του 2026 για να δημοσιεύει δωρεάν υπολογιστές με εμφανείς υποθέσεις." },
    contact: { title: "Επικοινωνία", h1: "Επικοινωνία", intro: "Διορθώσεις ή συνεργασίες: hello@toollabz.com." },
    methodology: { title: "Μεθοδολογία υπολογισμού", h1: "Μεθοδολογία", intro: "Οι σημαντικοί υπολογιστές αναφέρουν τύπο, υποθέσεις και τι δεν περιλαμβάνει το αποτέλεσμα." },
    editorial: { title: "Συντακτική πολιτική", h1: "Συντακτική πολιτική", intro: "Δημοσιεύουμε επαληθεύσιμους τύπους και πηγές." },
    privacy: { title: "Πολιτική απορρήτου", h1: "Απόρρητο", intro: "Οι περισσότεροι υπολογιστές τρέχουν στον φυλλομετρητή χωρίς λογαριασμό." },
    terms: { title: "Όροι χρήσης", h1: "Όροι χρήσης", intro: "Τα αποτελέσματα είναι εκτιμήσεις. Επιβεβαιώστε σημαντικές αποφάσεις με επαγγελματία." },
    disclaimer: { title: "Αποποίηση", h1: "Αποποίηση", intro: "Το αποτέλεσμα εξαρτάται από τους αριθμούς σας και τις υποθέσεις της σελίδας." },
    glossary: { title: "Γλωσσάρι", h1: "Γλωσσάρι", intro: "Σύντομοι ορισμοί με συνδέσμους στους σχετικούς υπολογιστές." },
    research: { title: "Δεδομένα αναφοράς", h1: "Έρευνα", intro: "Πίνακες και σημειώσεις που αναφέρονται στις σελίδες εργαλείων." },
    finance: { title: "Οικονομικοί υπολογιστές", h1: "Οικονομικά εργαλεία", intro: "Δάνεια, ανατοκισμός, περιθώρια και εκτιμήσεις φόρου." },
    business: { title: "Επιχειρηματικοί υπολογιστές", h1: "Επιχειρηματικά εργαλεία", intro: "Νεκρό σημείο, περιθώριο και προγραμματισμός." },
    developer: { title: "Εργαλεία προγραμματιστών", h1: "Εργαλεία προγραμματιστών", intro: "JSON, Base64 και κωδικοί στον φυλλομετρητή." },
    pdf: { title: "Εργαλεία PDF", h1: "Εργαλεία PDF", intro: "Συγχώνευση και συμπίεση PDF στον φυλλομετρητή όπου είναι δυνατό." },
    utility: { title: "Μετατροπείς", h1: "Βοηθητικά", intro: "Καθημερινές μετατροπές με ορατή μέθοδο." },
    realEstate: { title: "Υπολογιστές ακινήτων", h1: "Εργαλεία ακινήτων", intro: "Μαθηματικά στεγαστικών. Τα έξοδα τράπεζας συχνά εξαιρούνται." },
    marketing: { title: "Υπολογιστές μάρκετινγκ", h1: "Εργαλεία μάρκετινγκ", intro: "ROI και μαθηματικά καμπάνιας με ορατό τύπο." },
    ai: { title: "Εργαλεία ΤΝ", h1: "Εργαλεία ΤΝ", intro: "Μικροί βοηθοί. Περιγράφουμε μόνο ό,τι κάνει πραγματικά το εργαλείο." },
  },
  uk: {
    home: {
      title: "Toollabz — Безкоштовні онлайн-калькулятори",
      description: "Безкоштовні інструменти для фінансів, податків, бізнесу, PDF і розробки. Видимі формули, без облікового запису.",
      h1: "Безкоштовні калькулятори з видимими формулами",
      intro: "Toollabz збирає інструменти в браузері. Кожен калькулятор показує формулу, припущення та приклад, щоб ви могли перевірити результат.",
    },
    tools: { title: "Усі інструменти", h1: "Усі інструменти", intro: "Відкрийте будь-який калькулятор у браузері. Обліковий запис не потрібен." },
    blog: { title: "Довідники", h1: "Блог", intro: "Короткі тексти, узгоджені з реальною логікою інструментів." },
    about: { title: "Про Toollabz", h1: "Про Toollabz", intro: "Toollabz запущено в квітні 2026 року, щоб публікувати безкоштовні калькулятори з видимими припущеннями." },
    contact: { title: "Зв’язатися з Toollabz", h1: "Контакт", intro: "Виправлення або партнерство: hello@toollabz.com." },
    methodology: { title: "Методологія розрахунку", h1: "Методологія", intro: "Важливі калькулятори вказують формулу, припущення та те, чого результат не містить." },
    editorial: { title: "Редакційна політика", h1: "Редакційна політика", intro: "Ми публікуємо перевірювані формули та джерела." },
    privacy: { title: "Політика конфіденційності", h1: "Конфіденційність", intro: "Більшість калькуляторів працюють у браузері без облікового запису." },
    terms: { title: "Умови використання", h1: "Умови використання", intro: "Результати — оцінки. Підтверджуйте важливі рішення з фахівцем." },
    disclaimer: { title: "Відмова від відповідальності", h1: "Відмова від відповідальності", intro: "Результат залежить від введених чисел і припущень сторінки." },
    glossary: { title: "Глосарій", h1: "Глосарій", intro: "Короткі визначення з посиланнями на відповідні калькулятори." },
    research: { title: "Довідкові дані", h1: "Дослідження", intro: "Таблиці та примітки, на які посилаються сторінки інструментів." },
    finance: { title: "Фінансові калькулятори", h1: "Фінансові інструменти", intro: "Кредити, складні відсотки, маржа та податкові оцінки." },
    business: { title: "Бізнес-калькулятори", h1: "Бізнес-інструменти", intro: "Точка беззбитковості, маржа та планування." },
    developer: { title: "Інструменти розробника", h1: "Інструменти розробника", intro: "JSON, Base64 і паролі в браузері." },
    pdf: { title: "PDF-інструменти", h1: "PDF-інструменти", intro: "Об’єднання та стиснення PDF у браузері, коли це можливо." },
    utility: { title: "Конвертери", h1: "Утиліти", intro: "Повсякденні перетворення з видимим методом." },
    realEstate: { title: "Іпотечні калькулятори", h1: "Інструменти нерухомості", intro: "Математика іпотеки. Комісії банку часто не входять." },
    marketing: { title: "Маркетингові калькулятори", h1: "Маркетингові інструменти", intro: "ROI і розрахунки кампаній із видимою формулою." },
    ai: { title: "Інструменти ШІ", h1: "Інструменти ШІ", intro: "Невеликі помічники. Описуємо лише те, що інструмент справді робить." },
  },
  bg: {
    home: {
      title: "Toollabz — Безплатни онлайн калкулатори",
      description: "Безплатни инструменти за финанси, данъци, бизнес, PDF и разработка. Видими формули, без акаунт.",
      h1: "Безплатни калкулатори с видими формули",
      intro: "Toollabz събира инструменти в браузъра. Всеки калкулатор показва формулата, предположенията и пример, за да проверите резултата.",
    },
    tools: { title: "Всички инструменти", h1: "Всички инструменти", intro: "Отворете калкулатор в браузъра. Не е нужен акаунт." },
    blog: { title: "Ръководства", h1: "Блог", intro: "Кратки текстове, съгласувани с реалната логика на инструментите." },
    about: { title: "За Toollabz", h1: "За Toollabz", intro: "Toollabz стартира през април 2026 г., за да публикува безплатни калкулатори с видими предположения." },
    contact: { title: "Контакт с Toollabz", h1: "Контакт", intro: "Корекции или партньорства: hello@toollabz.com." },
    methodology: { title: "Методология на изчислението", h1: "Методология", intro: "Важните калкулатори посочват формула, предположения и какво не включва резултатът." },
    editorial: { title: "Редакционна политика", h1: "Редакционна политика", intro: "Публикуваме проверими формули и източници." },
    privacy: { title: "Политика за поверителност", h1: "Поверителност", intro: "Повечето калкулатори работят в браузъра без акаунт." },
    terms: { title: "Условия за ползване", h1: "Условия за ползване", intro: "Резултатите са оценки. Потвърдете важни решения със специалист." },
    disclaimer: { title: "Отказ от отговорност", h1: "Отказ от отговорност", intro: "Резултатът зависи от въведените числа и предположенията на страницата." },
    glossary: { title: "Речник", h1: "Речник", intro: "Кратки определения с връзки към съответните калкулатори." },
    research: { title: "Справочни данни", h1: "Изследвания", intro: "Таблици и бележки, цитирани в страниците на инструментите." },
    finance: { title: "Финансови калкулатори", h1: "Финансови инструменти", intro: "Кредити, сложна лихва, маржове и данъчни оценки." },
    business: { title: "Бизнес калкулатори", h1: "Бизнес инструменти", intro: "Критична точка, марж и планиране." },
    developer: { title: "Инструменти за разработчици", h1: "Инструменти за разработчици", intro: "JSON, Base64 и пароли в браузъра." },
    pdf: { title: "PDF инструменти", h1: "PDF инструменти", intro: "Обединяване и компресиране на PDF в браузъра, когато е възможно." },
    utility: { title: "Конвертори", h1: "Помощни", intro: "Ежедневни преобразувания с видима метода." },
    realEstate: { title: "Ипотечни калкулатори", h1: "Инструменти за имоти", intro: "Математика на ипотеката. Банковите такси често липсват." },
    marketing: { title: "Маркетинг калкулатори", h1: "Маркетинг инструменти", intro: "ROI и изчисления за кампании с видима формула." },
    ai: { title: "Инструменти с ИИ", h1: "Инструменти с ИИ", intro: "Малки помощници. Описваме само това, което инструментът наистина прави." },
  },
  sk: {
    home: {
      title: "Toollabz — Bezplatné online kalkulačky",
      description: "Bezplatné nástroje pre financie, dane, firmu, PDF a vývoj. Viditeľné vzorce, bez účtu.",
      h1: "Bezplatné kalkulačky s viditeľnými vzorcami",
      intro: "Toollabz združuje nástroje v prehliadači. Každá kalkulačka ukáže vzorec, predpoklady a príklad, aby ste výsledok overili.",
    },
    tools: { title: "Všetky nástroje", h1: "Všetky nástroje", intro: "Otvorte kalkulačku v prehliadači. Účet nie je potrebný." },
    blog: { title: "Sprievodcovia", h1: "Blog", intro: "Krátke texty podľa skutočnej logiky nástrojov." },
    about: { title: "O Toollabz", h1: "O Toollabz", intro: "Toollabz vznikol v apríli 2026, aby zverejňoval bezplatné kalkulačky s viditeľnými predpokladmi." },
    contact: { title: "Kontaktovať Toollabz", h1: "Kontakt", intro: "Opravy alebo spolupráca: hello@toollabz.com." },
    methodology: { title: "Metodika výpočtu", h1: "Metodika", intro: "Dôležité kalkulačky uvádzajú vzorec, predpoklady a to, čo výsledok nezahŕňa." },
    editorial: { title: "Redakčné zásady", h1: "Redakčné zásady", intro: "Zverejňujeme overiteľné vzorce a zdroje." },
    privacy: { title: "Zásady ochrany súkromia", h1: "Súkromie", intro: "Väčšina kalkulačiek beží v prehliadači bez účtu." },
    terms: { title: "Podmienky používania", h1: "Podmienky používania", intro: "Výsledky sú odhady. Zásadné rozhodnutia overte s odborníkom." },
    disclaimer: { title: "Vylúčenie zodpovednosti", h1: "Vylúčenie zodpovednosti", intro: "Výsledok závisí od zadaných čísiel a predpokladov stránky." },
    glossary: { title: "Slovník", h1: "Slovník", intro: "Stručné definície s odkazmi na príslušné kalkulačky." },
    research: { title: "Referenčné údaje", h1: "Výskum", intro: "Tabuľky a poznámky citované na stránkach nástrojov." },
    finance: { title: "Finančné kalkulačky", h1: "Finančné nástroje", intro: "Úvery, zložené úročenie, marže a daňové odhady." },
    business: { title: "Firemné kalkulačky", h1: "Firemné nástroje", intro: "Bod zvratu, marža a plánovanie." },
    developer: { title: "Vývojárske nástroje", h1: "Vývojárske nástroje", intro: "JSON, Base64 a heslá v prehliadači." },
    pdf: { title: "PDF nástroje", h1: "PDF nástroje", intro: "Spájanie a kompresia PDF v prehliadači, ak je to možné." },
    utility: { title: "Prevodníky", h1: "Utility", intro: "Každodenné prevody s viditeľnou metódou." },
    realEstate: { title: "Realitné kalkulačky", h1: "Realitné nástroje", intro: "Matematika hypoték. Bankové poplatky často chýbajú." },
    marketing: { title: "Marketingové kalkulačky", h1: "Marketingové nástroje", intro: "ROI a kampaňová matematika s viditeľným vzorcom." },
    ai: { title: "Nástroje AI", h1: "Nástroje AI", intro: "Malí pomocníci. Opisujeme len to, čo nástroj skutočne robí." },
  },
  hr: {
    home: {
      title: "Toollabz — Besplatni online kalkulatori",
      description: "Besplatni alati za financije, poreze, poslovanje, PDF i razvoj. Vidljive formule, bez računa.",
      h1: "Besplatni kalkulatori s vidljivim formulama",
      intro: "Toollabz okuplja alate u pregledniku. Svaki kalkulator pokazuje formulu, pretpostavke i primjer kako biste provjerili rezultat.",
    },
    tools: { title: "Svi alati", h1: "Svi alati", intro: "Otvorite bilo koji kalkulator u pregledniku. Račun nije potreban." },
    blog: { title: "Vodiči", h1: "Blog", intro: "Kratki tekstovi usklađeni sa stvarnom logikom alata." },
    about: { title: "O Toollabzu", h1: "O Toollabzu", intro: "Toollabz je pokrenut u travnju 2026. kako bi objavljivao besplatne kalkulatore s vidljivim pretpostavkama." },
    contact: { title: "Kontaktirajte Toollabz", h1: "Kontakt", intro: "Ispravci ili partnerstva: hello@toollabz.com." },
    methodology: { title: "Metodologija izračuna", h1: "Metodologija", intro: "Važni kalkulatori navode formulu, pretpostavke i što rezultat ne uključuje." },
    editorial: { title: "Urednička politika", h1: "Urednička politika", intro: "Objavljujemo provjerljive formule i izvore." },
    privacy: { title: "Pravila privatnosti", h1: "Privatnost", intro: "Većina kalkulatora radi u pregledniku bez računa." },
    terms: { title: "Uvjeti korištenja", h1: "Uvjeti korištenja", intro: "Rezultati su procjene. Potvrdite važne odluke sa stručnjakom." },
    disclaimer: { title: "Odricanje od odgovornosti", h1: "Odricanje", intro: "Rezultat ovisi o unesenim brojevima i pretpostavkama stranice." },
    glossary: { title: "Pojmovnik", h1: "Pojmovnik", intro: "Kratke definicije s poveznicama na odgovarajuće kalkulatore." },
    research: { title: "Referentni podaci", h1: "Istraživanje", intro: "Tablice i bilješke navedene na stranicama alata." },
    finance: { title: "Financijski kalkulatori", h1: "Financijski alati", intro: "Krediti, složena kamata, marže i porezne procjene." },
    business: { title: "Poslovni kalkulatori", h1: "Poslovni alati", intro: "Prag rentabilnosti, marža i planiranje." },
    developer: { title: "Alati za developere", h1: "Alati za developere", intro: "JSON, Base64 i lozinke u pregledniku." },
    pdf: { title: "PDF alati", h1: "PDF alati", intro: "Spajanje i sažimanje PDF-a u pregledniku kada je moguće." },
    utility: { title: "Pretvarači", h1: "Pomagala", intro: "Svakodnevna pretvaranja s vidljivom metodom." },
    realEstate: { title: "Nekretninski kalkulatori", h1: "Alati za nekretnine", intro: "Matematika hipoteke. Bankovne naknade često nisu uključene." },
    marketing: { title: "Marketinški kalkulatori", h1: "Marketinški alati", intro: "ROI i matematika kampanje s vidljivom formulom." },
    ai: { title: "AI alati", h1: "AI alati", intro: "Mali pomagači. Opisujemo samo ono što alat doista radi." },
  },
  lt: {
    home: {
      title: "Toollabz — Nemokamos internetinės skaičiuoklės",
      description: "Nemokami finansų, mokesčių, verslo, PDF ir programuotojų įrankiai. Matomos formulės, be paskyros.",
      h1: "Nemokamos skaičiuoklės su matomomis formulėmis",
      intro: "Toollabz telkia naršyklės įrankius. Kiekviena skaičiuoklė rodo formulę, prielaidas ir pavyzdį, kad galėtumėte patikrinti rezultatą.",
    },
    tools: { title: "Visi įrankiai", h1: "Visi įrankiai", intro: "Atidarykite bet kurią skaičiuoklę naršyklėje. Paskyra nereikalinga." },
    blog: { title: "Vadovai", h1: "Tinklaraštis", intro: "Trumpi tekstai, atitinkantys tikrąją įrankių logiką." },
    about: { title: "Apie Toollabz", h1: "Apie Toollabz", intro: "Toollabz pradėjo veikti 2026 m. balandį, kad skelbtų nemokamas skaičiuokles su matomomis prielaidomis." },
    contact: { title: "Susisiekti su Toollabz", h1: "Kontaktas", intro: "Pataisos ar partnerystė: hello@toollabz.com." },
    methodology: { title: "Skaičiavimo metodika", h1: "Metodika", intro: "Svarbios skaičiuoklės nurodo formulę, prielaidas ir tai, ko rezultatas neapima." },
    editorial: { title: "Redakcijos politika", h1: "Redakcijos politika", intro: "Skelbiame patikrinamas formules ir šaltinius." },
    privacy: { title: "Privatumo politika", h1: "Privatumas", intro: "Dauguma skaičiuoklių veikia naršyklėje be paskyros." },
    terms: { title: "Naudojimo sąlygos", h1: "Naudojimo sąlygos", intro: "Rezultatai yra įvertinimai. Svarbius sprendimus patvirtinkite su specialistu." },
    disclaimer: { title: "Atsakomybės apribojimas", h1: "Atsakomybės apribojimas", intro: "Rezultatas priklauso nuo įvestų skaičių ir puslapio prielaidų." },
    glossary: { title: "Žodynas", h1: "Žodynas", intro: "Trumpi apibrėžimai su nuorodomis į atitinkamas skaičiuokles." },
    research: { title: "Nuorodiniai duomenys", h1: "Tyrimai", intro: "Lentelės ir pastabos, cituojamos įrankių puslapiuose." },
    finance: { title: "Finansų skaičiuoklės", h1: "Finansų įrankiai", intro: "Paskolos, sudėtinės palūkanos, maržos ir mokesčių įvertinimai." },
    business: { title: "Verslo skaičiuoklės", h1: "Verslo įrankiai", intro: "Lūžio taškas, marža ir planavimas." },
    developer: { title: "Programuotojų įrankiai", h1: "Programuotojų įrankiai", intro: "JSON, Base64 ir slaptažodžiai naršyklėje." },
    pdf: { title: "PDF įrankiai", h1: "PDF įrankiai", intro: "PDF sujungimas ir glaudinimas naršyklėje, kai įmanoma." },
    utility: { title: "Keitikliai", h1: "Pagalbiniai", intro: "Kasdieniai keitimai su matomu metodu." },
    realEstate: { title: "NT skaičiuoklės", h1: "NT įrankiai", intro: "Būsto paskolos matematika. Banko mokesčiai dažnai neįtraukti." },
    marketing: { title: "Rinkodaros skaičiuoklės", h1: "Rinkodaros įrankiai", intro: "ROI ir kampanijų skaičiavimai su matoma formule." },
    ai: { title: "DI įrankiai", h1: "DI įrankiai", intro: "Maži pagalbininkai. Aprašome tik tai, ką įrankis iš tikrųjų daro." },
  },
  lv: {
    home: {
      title: "Toollabz — Bezmaksas tiešsaistes kalkulatori",
      description: "Bezmaksas rīki finansēm, nodokļiem, uzņēmumam, PDF un izstrādei. Redzamas formulas, bez konta.",
      h1: "Bezmaksas kalkulatori ar redzamām formulām",
      intro: "Toollabz apvieno rīkus pārlūkā. Katrs kalkulators rāda formulu, pieņēmumus un piemēru, lai jūs varētu pārbaudīt rezultātu.",
    },
    tools: { title: "Visi rīki", h1: "Visi rīki", intro: "Atveriet jebkuru kalkulatoru pārlūkā. Konts nav vajadzīgs." },
    blog: { title: "Ceļveži", h1: "Emuārs", intro: "Īsi teksti, kas atbilst rīku patiesajai loģikai." },
    about: { title: "Par Toollabz", h1: "Par Toollabz", intro: "Toollabz sāka darbu 2026. gada aprīlī, lai publicētu bezmaksas kalkulatorus ar redzamiem pieņēmumiem." },
    contact: { title: "Sazināties ar Toollabz", h1: "Kontakti", intro: "Labojumi vai partnerība: hello@toollabz.com." },
    methodology: { title: "Aprēķinu metodoloģija", h1: "Metodoloģija", intro: "Svarīgi kalkulatori norāda formulu, pieņēmumus un to, ko rezultāts neietver." },
    editorial: { title: "Redakcijas politika", h1: "Redakcijas politika", intro: "Publicējam pārbaudāmas formulas un avotus." },
    privacy: { title: "Privātuma politika", h1: "Privātums", intro: "Lielākā daļa kalkulatoru darbojas pārlūkā bez konta." },
    terms: { title: "Lietošanas noteikumi", h1: "Lietošanas noteikumi", intro: "Rezultāti ir aplēses. Apstipriniet svarīgus lēmumus ar speciālistu." },
    disclaimer: { title: "Atruna", h1: "Atruna", intro: "Rezultāts ir atkarīgs no ievadītajiem skaitļiem un lapas pieņēmumiem." },
    glossary: { title: "Glosārijs", h1: "Glosārijs", intro: "Īsas definīcijas ar saitēm uz attiecīgajiem kalkulatoriem." },
    research: { title: "Atsauces dati", h1: "Pētījumi", intro: "Tabulas un piezīmes, kas citētas rīku lapās." },
    finance: { title: "Finanšu kalkulatori", h1: "Finanšu rīki", intro: "Aizdevumi, saliktie procenti, maržas un nodokļu aplēses." },
    business: { title: "Uzņēmumu kalkulatori", h1: "Uzņēmumu rīki", intro: "Bezzaudējuma punkts, marža un plānošana." },
    developer: { title: "Izstrādātāju rīki", h1: "Izstrādātāju rīki", intro: "JSON, Base64 un paroles pārlūkā." },
    pdf: { title: "PDF rīki", h1: "PDF rīki", intro: "PDF apvienošana un saspiešana pārlūkā, kad iespējams." },
    utility: { title: "Pārveidotāji", h1: "Palīgrīki", intro: "Ikdienas pārveidojumi ar redzamu metodi." },
    realEstate: { title: "Nekustamā īpašuma kalkulatori", h1: "Nekustamā īpašuma rīki", intro: "Hipotēkas matemātika. Bankas komisijas bieži nav iekļautas." },
    marketing: { title: "Mārketinga kalkulatori", h1: "Mārketinga rīki", intro: "ROI un kampaņu aprēķini ar redzamu formulu." },
    ai: { title: "MI rīki", h1: "MI rīki", intro: "Mazi palīgi. Aprakstām tikai to, ko rīks patiešām dara." },
  },
  et: {
    home: {
      title: "Toollabz — Tasuta veebikalkulaatorid",
      description: "Tasuta tööriistad rahandusele, maksudele, ärile, PDF-ile ja arendusele. Nähtavad valemid, ilma kontota.",
      h1: "Tasuta kalkulaatorid nähtavate valemitega",
      intro: "Toollabz koondab brauseritööriistu. Iga kalkulaator näitab valemit, eeldusi ja näidet, et saaksid tulemust kontrollida.",
    },
    tools: { title: "Kõik tööriistad", h1: "Kõik tööriistad", intro: "Ava mis tahes kalkulaator brauseris. Kontot pole vaja." },
    blog: { title: "Juhendid", h1: "Blogi", intro: "Lühikesed tekstid, mis järgivad tööriistade tegelikku loogikat." },
    about: { title: "Toollabzist", h1: "Toollabzist", intro: "Toollabz alustas 2026. aasta aprillis, et avaldada tasuta kalkulaatoreid nähtavate eeldustega." },
    contact: { title: "Võta Toollabziga ühendust", h1: "Kontakt", intro: "Parandused või koostöö: hello@toollabz.com." },
    methodology: { title: "Arvutusmetoodika", h1: "Metoodika", intro: "Olulised kalkulaatorid märgivad valemi, eeldused ja selle, mida tulemus ei sisalda." },
    editorial: { title: "Toimetusepoliitika", h1: "Toimetusepoliitika", intro: "Avaldame kontrollitavaid valemeid ja allikaid." },
    privacy: { title: "Privaatsuspoliitika", h1: "Privaatsus", intro: "Enamik kalkulaatoreid töötab brauseris ilma kontota." },
    terms: { title: "Kasutustingimused", h1: "Kasutustingimused", intro: "Tulemused on hinnangud. Kinnita olulised otsused spetsialistiga." },
    disclaimer: { title: "Vastutusest loobumine", h1: "Vastutusest loobumine", intro: "Tulemus sõltub sisestatud arvudest ja lehe eeldustest." },
    glossary: { title: "Sõnastik", h1: "Sõnastik", intro: "Lühikesed määratlused koos linkidega õigetele kalkulaatoritele." },
    research: { title: "Viiteandmed", h1: "Uuringud", intro: "Tabelid ja märkused, mida tsiteeritakse tööriistalehtedel." },
    finance: { title: "Rahanduskalkulaatorid", h1: "Rahandustööriistad", intro: "Laenud, liitintress, marginaalid ja maksuhinnangud." },
    business: { title: "Ärikalkulaatorid", h1: "Äritööriistad", intro: "Tasuvuspunkt, marginaal ja planeerimine." },
    developer: { title: "Arendaja tööriistad", h1: "Arendaja tööriistad", intro: "JSON, Base64 ja paroolid brauseris." },
    pdf: { title: "PDF-tööriistad", h1: "PDF-tööriistad", intro: "PDF-i ühendamine ja tihendamine brauseris, kui võimalik." },
    utility: { title: "Teisendid", h1: "Abivahendid", intro: "Igapäevased teisendused nähtava meetodiga." },
    realEstate: { title: "Kinnisvarakalkulaatorid", h1: "Kinnisvaratööriistad", intro: "Eluasemelaenu matemaatika. Panga tasud jäävad sageli välja." },
    marketing: { title: "Turunduskalkulaatorid", h1: "Turundustööriistad", intro: "ROI ja kampaaniaarvutus nähtava valemiga." },
    ai: { title: "TI tööriistad", h1: "TI tööriistad", intro: "Väikesed abilised. Kirjeldame ainult seda, mida tööriist tegelikult teeb." },
  },
  sl: {
    home: {
      title: "Toollabz — Brezplačni spletni kalkulatorji",
      description: "Brezplačna orodja za finance, davke, poslovanje, PDF in razvoj. Vidne formule, brez računa.",
      h1: "Brezplačni kalkulatorji z vidnimi formulami",
      intro: "Toollabz združuje orodja v brskalniku. Vsak kalkulator pokaže formulo, predpostavke in primer, da lahko rezultat preverite.",
    },
    tools: { title: "Vsa orodja", h1: "Vsa orodja", intro: "Odprite kateri koli kalkulator v brskalniku. Račun ni potreben." },
    blog: { title: "Vodiči", h1: "Blog", intro: "Kratka besedila, usklajena z dejansko logiko orodij." },
    about: { title: "O Toollabzu", h1: "O Toollabzu", intro: "Toollabz je zaživel aprila 2026, da bi objavljal brezplačne kalkulatorje z vidnimi predpostavkami." },
    contact: { title: "Kontaktirajte Toollabz", h1: "Stik", intro: "Popravki ali partnerstva: hello@toollabz.com." },
    methodology: { title: "Metodologija izračuna", h1: "Metodologija", intro: "Pomembni kalkulatorji navedejo formulo, predpostavke in kaj rezultat ne vključuje." },
    editorial: { title: "Uredniška politika", h1: "Uredniška politika", intro: "Objavljamo preverljive formule in vire." },
    privacy: { title: "Pravilnik o zasebnosti", h1: "Zasebnost", intro: "Večina kalkulatorjev teče v brskalniku brez računa." },
    terms: { title: "Pogoji uporabe", h1: "Pogoji uporabe", intro: "Rezultati so ocene. Pomembne odločitve potrdite s strokovnjakom." },
    disclaimer: { title: "Zavrnitev odgovornosti", h1: "Zavrnitev odgovornosti", intro: "Rezultat je odvisen od vnesenih številk in predpostavk strani." },
    glossary: { title: "Slovar", h1: "Slovar", intro: "Kratke opredelitve s povezavami do ustreznih kalkulatorjev." },
    research: { title: "Referenčni podatki", h1: "Raziskave", intro: "Tabele in opombe, navedene na straneh orodij." },
    finance: { title: "Finančni kalkulatorji", h1: "Finančna orodja", intro: "Krediti, obrestne obresti, marže in davčne ocene." },
    business: { title: "Poslovni kalkulatorji", h1: "Poslovna orodja", intro: "Prag rentabilnosti, marža in načrtovanje." },
    developer: { title: "Razvijalska orodja", h1: "Razvijalska orodja", intro: "JSON, Base64 in gesla v brskalniku." },
    pdf: { title: "PDF orodja", h1: "PDF orodja", intro: "Združevanje in stiskanje PDF v brskalniku, ko je mogoče." },
    utility: { title: "Pretvorniki", h1: "Pripomočki", intro: "Vsakodnevne pretvorbe z vidno metodo." },
    realEstate: { title: "Nepremičninski kalkulatorji", h1: "Nepremičninska orodja", intro: "Matematika hipoteke. Bančne provizije so pogosto izključene." },
    marketing: { title: "Trženjski kalkulatorji", h1: "Trženjska orodja", intro: "ROI in matematika kampanje z vidno formulo." },
    ai: { title: "Orodja UI", h1: "Orodja UI", intro: "Majhni pomočniki. Opišemo samo tisto, kar orodje res počne." },
  },
};

function mergePage(base: PageCopy, over?: Partial<PageCopy>): PageCopy {
  if (!over) return base;
  return {
    title: over.title ?? base.title,
    description: over.description ?? base.description,
    h1: over.h1 ?? base.h1,
    intro: over.intro ?? base.intro,
  };
}

export function getPageCopy(locale: Locale | string | undefined, key: StaticPageKey): PageCopy {
  const loc = (locale && locale in OVERRIDES ? locale : DEFAULT_LOCALE) as Locale;
  if (loc === DEFAULT_LOCALE) return EN[key];
  return mergePage(EN[key], OVERRIDES[loc][key]);
}

export const STATIC_PAGE_KEYS = PAGE_KEYS;

export function pathToPageKey(englishPath: string): StaticPageKey | null {
  switch (englishPath) {
    case "/":
      return "home";
    case "/tools":
      return "tools";
    case "/blog":
      return "blog";
    case "/about":
      return "about";
    case "/contact":
      return "contact";
    case "/methodology":
      return "methodology";
    case "/editorial-policy":
      return "editorial";
    case "/privacy":
      return "privacy";
    case "/terms":
      return "terms";
    case "/disclaimer":
      return "disclaimer";
    case "/glossary":
      return "glossary";
    case "/research":
      return "research";
    case "/finance-tools":
      return "finance";
    case "/business-tools":
      return "business";
    case "/developer-tools":
      return "developer";
    case "/pdf-tools":
      return "pdf";
    case "/utility-tools":
      return "utility";
    case "/real-estate-tools":
      return "realEstate";
    case "/marketing-tools":
      return "marketing";
    case "/ai-tools":
      return "ai";
    default:
      return null;
  }
}

/** Ensures every locale has a merged copy for every static page key (falls back to English). */
export function assertPageCoverage(): { locale: Locale; key: StaticPageKey }[] {
  const missing: { locale: Locale; key: StaticPageKey }[] = [];
  for (const locale of LOCALES) {
    for (const key of PAGE_KEYS) {
      const copy = getPageCopy(locale, key);
      if (!copy.title || !copy.h1 || !copy.description || !copy.intro) {
        missing.push({ locale, key });
      }
    }
  }
  return missing;
}
