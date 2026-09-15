# UP! informatica

Sito di Stefano Vananti per assistenza a domicilio e in azienda in tutto il Ticino.
Repository: stedbrown/up-informatica. Dominio canonico: https://www.up-informatica.ch/.

## Sviluppo

Node.js 22 o successivo. Eseguire npm ci, npm run check, npm run dev.
L'anteprima è su http://127.0.0.1:4173.

I testi e i template sono in scripts/build.mjs, gli stili in style.css e le interazioni in script.js.
La build genera HTML statico, accessibile anche senza JavaScript, e copia solo gli asset pubblici in public/.
Vercel usa public/ come output. Le pagine HTML generate nella root sono versionate per facilitare revisione e portabilità.

GSAP e ScrollTrigger gestiscono animazioni leggere, disabilitate con prefers-reduced-motion.
Manrope è ospitato localmente. Nessun CDN, analytics o cookie di marketing è integrato.
La fotografia home è un'illustrazione fotografica generata: non rappresenta un ufficio di UP! informatica.

## Contatti

Il modulo conserva l'endpoint Formspree preesistente. Il controllo locale simula successo, errore HTTP e assenza di rete senza inviare messaggi reali.
La consegna effettiva dipende dall'account Formspree e va verificata dal titolare con una richiesta reale.

## SEO

Home, quattro pagine servizio e una pagina territoriale hanno contenuti distinti, canonical, descrizioni e dati strutturati.
Non vengono dichiarati uffici, recensioni, prezzi o risultati non verificati.
Le vecchie URL privacy e cookie restano disponibili. Gli ancoraggi home hero/services/about/contact sono conservati.
La sitemap non inventa date di aggiornamento.

npm run check valida pagine, link, ancore, metadati, dati strutturati e comportamento del modulo.
Il controllo GitHub viene eseguito sui push e sulle pull request.
Search Console e Google Business Profile sono servizi separati: la build non li modifica e non promette posizionamenti.
Il collegamento di Search Console richiede una proprietà verificata dell'account del titolare.
