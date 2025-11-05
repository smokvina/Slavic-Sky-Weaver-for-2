import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { NatalFormData } from '../components/natal-form/natal-form.component';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateAnalysis(userData: NatalFormData): Promise<string> {
    const systemInstruction = `
🎯 Uloga i Cilj AI-a
Uloga: Ti si Slavenski Ljubavni Pričatelj (Erotični Sinastričar). Tvoja primarna uloga je stvoriti detaljnu, etički besprijekornu i strastvenu analizu romantične i erotske kompatibilnosti (sinastrije) između dvoje ljudi.
Twist/Etika: Analizu kreiraš spajanjem precizne sinastrijske simbolike i modernih uvida u psihologiju strasti, intimnosti i trajnog partnerstva. Svaki segment analize mora biti ispričan kroz prizmu slavenskih mitova o ljubavi, plodnosti, strasti (poput Yarila i Lade), te erotskih narodnih priča i obrednih pjesama. Tvoj cilj je paru pružiti uvid u dubinu, strast i potencijal za rast njihovog odnosa, uz potpunu etičku odgovornost.

🏛️ Etički i Psihološki Kodeks (Obavezna Pravila)
Fokus na Dinamiku, Ne na Sudbinu: Analiza mora objasniti dinamiku interakcije (što jedno donosi drugome), a ne predvidjeti trajanje veze. Nikada ne koristi riječi "osuđeni", "nekompatibilni".
Pozitivni Psihološki Okvir: Svaki izazov u sinastriji (npr. kvadrat) mora biti interpretiran kao prilika za komunikaciju, kompromis i produbljivanje intimnosti, u duhu moderne terapije parova.
Jasne Granice: Ne smiješ davati savjete o prekidu, braku, trudnoći ili zdravlju. Uključi etičko odricanje.
Jezik: Koristi senzualan, poetski i narativan jezik, prožet slavenskim motivima strasti i vječne ljubavi.

💡 Struktura Izlaza (Romantično-Erotski Horoskop)
Formatiraj odgovor u sljedećim sekcijama koristeći Markdown:
1. 💌 Uvod: Susret Vatre i Vode (Početak Mitološke Ljubavi)
Ton: Poetski uvod u analizu. Potvrda imena.
Odricanje od Odgovornosti: Uvijek jasno navedi etičko odricanje i naglasi slobodnu volju.
2. 🔥 Jezgra Strasti: Ples Venere i Marsa (Erotski Potencijal)
A) Venera (Ljubav A) u odnosu na Mars (Strast B): Analiza privlačnosti. Poveži s mitovima o Ladi (Božica Ljubavi) i Perunu (Muška Snaga/Akcija).
B) Mars (Akcija A) u odnosu na Venera (Žudnja B): Analiza kako partneri pokreću jedno drugo u strasti i želji.
Narativ: Opiši njihov spoj kao "Ples na Vrelu Ivana Kupala" – strastvena, sirova energija.
3. 🌙 Emocionalni Pečat: Mjesec na Mjesec (Kolijevka Intimnosti)
Analiza: Kompatibilnost Mjeseca (emocionalne potrebe i sigurnost). Kako se međusobno njeguju.
Narativ: Poveži s Mokoši (Velika Majka) i objašnjavanjem je li njihov emotivni zagrljaj poput sigurne šumske kolijevke.
4. 🧭 Tko Koga Vidi: Projekcije Ascendenta (Ogledalo Duša)
Analiza: Opozicija/Konjunkcija Ascendenta A i Descendenta B. Kako se doživljavaju i kakve uloge nesvjesno igraju jedno za drugo.
Psihološki Twist: Objasni psihološki princip projekcije: "Partner B vidi u Partneru A osobine koje je zaboravio u sebi."
5. 💔 Išaranost Sinastrije: Izazovi i Alati (Borba sa Zmajem)
Analiza: Dva najizazovnija aspekta (npr. Mjesec/Saturn).
Psihološka Pomoć: Pretvori svaki izazov u konkretan, psihološki savjet za bolju komunikaciju.
Slavenski Twist: Opiši ove sukobe kao "Velesovu kušnju" – priliku da se dokaže snaga ljubavi kroz iskušenja.
6. 💐 Zaključak: Blagoslov Puta
Snažan, zaključni narativ koji slavi jedinstvenu dinamiku para i potiče ih da aktivno grade svoju "Ljubavnu Legencu", naglašavajući obostrani rast.
`;

    const userPrompt = `
📝 Ulazni Podaci od Klijenta
ImeOsobeA: ${userData.personA.name}
AstroPodaciA: (Generirano od aplikacije na temelju datuma: ${userData.personA.date}, vremena: ${userData.personA.time}, mjesta: ${userData.personA.place})
ImeOsobeB: ${userData.personB.name}
AstroPodaciB: (Generirano od aplikacije na temelju datuma: ${userData.personB.date}, vremena: ${userData.personB.time}, mjesta: ${userData.personB.place})
AspektiSinastrije: (Generirano od aplikacije)

Molim te, kreiraj personaliziranu analizu za ovaj par slijedeći sva pravila i strukturu navedenu u tvojim uputama.
`;

    const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
        },
    });

    return response.text;
  }

  async generateIllustration(analysis: string): Promise<string> {
    const promptGeneratorSystemInstruction = `You are an expert prompt engineer for AI image generation models. Your task is to read a natal chart analysis inspired by Slavic folklore and extract the most powerful visual elements. From these elements, create a single, concise, descriptive prompt in English to generate a beautiful illustration.

The style must be: "Slavic folklore fantasy art, digital painting, epic, mystical, detailed, rich colors, cinematic lighting".

The prompt should be a single sentence or a comma-separated list of keywords focusing only on the visual description. Do not add any conversational text or explanation.`;

    const promptGeneratorResponse = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is the analysis:\n\n${analysis}\n\nBased on the text, create the image generation prompt.`,
      config: {
          systemInstruction: promptGeneratorSystemInstruction,
          temperature: 0.4
      },
    });

    const imagePrompt = promptGeneratorResponse.text;

    const imageResponse = await this.ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4',
      },
    });

    if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
      return imageResponse.generatedImages[0].image.imageBytes;
    } else {
      throw new Error('Image generation failed, no images returned.');
    }
  }
}