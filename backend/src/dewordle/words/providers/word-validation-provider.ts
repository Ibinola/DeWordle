import { Injectable } from '@nestjs/common';
import axios from 'axios';
import profanityList from '../../../utils/profanity-list.json';

@Injectable()
export class WordValidationProvider {
  private wiktionaryBaseUrl = 'https://en.wiktionary.org/w/api.php';
  private oxfordBaseUrl = 'https://od-api.oxforddictionaries.com/api/v2';

  public async validateWord(wordText: string) {
    const reasons: string[] = [];
    let definition: string | null = null;
    let sources: string[] = [];
    let score = 0;

    // 1. Profanity check
    if (profanityList.includes(wordText.toLowerCase())) {
      reasons.push('Profanity detected');
      return { valid: false, reasons, score };
    }

    // 2. Playability checks
    if (/[^a-zA-Z]/.test(wordText))
      reasons.push('Contains non-alphabetic characters');
    if (wordText.includes('-')) reasons.push('Hyphenated word');
    if (wordText.length < 2) reasons.push('Too short to be playable');
    if (reasons.length) return { valid: false, reasons, score };

    // 3. Dictionary lookups
    const dictApis = [
      this.lookupMerriamWebster(wordText),
      this.lookupOxford(wordText),
      this.lookupWiktionary(wordText),
    ];

    const results = await Promise.allSettled(dictApis);
    results.forEach((r) => {
      if (r.status === 'fulfilled' && r.value?.definition) {
        definition = definition || r.value.definition;
        sources.push(r.value.source);
        score += 40; // weighted score for dictionary presence
      }
    });

    if (!definition) {
      reasons.push('No valid dictionary definition found');
      return { valid: false, reasons, score };
    }

    // 4. Quality score
    if (sources.length > 1) score += 20; // confidence boost
    score = Math.min(score, 100);

    return {
      valid: score >= 70,
      reasons,
      score,
      definition,
      sources,
    };
  }

  private async lookupMerriamWebster(word: string) {
    try {
    const apiKey = process.env.MW_API_KEY;
    const res = await axios.get(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`,
    );
    if (res.data[0]?.shortdef?.length) {
      return { definition: res.data[0].shortdef[0], source: 'Merriam-Webster' };
    }
     } catch (err) {
      console.error(`Merriam-Webster lookup failed for "${word}":`, err.message);
    }
    return null;
  }

  private async lookupOxford(word: string) {
    try {
      const res = await axios.get<OxfordResponse>(
        `${this.oxfordBaseUrl}/entries/en-us/${word.toLowerCase()}`,
        {
          headers: {
            app_id: process.env.OXFORD_APP_ID,
            app_key: process.env.OXFORD_APP_KEY,
          },
        },
      );

      const lexicalEntries = res.data.results?.[0]?.lexicalEntries;
      if (!lexicalEntries?.length) return null;

      const definition =
        lexicalEntries[0].entries?.[0]?.senses?.[0]?.definitions?.[0];
      if (!definition) return null;

      return {
        definition,
        source: 'Oxford',
      };
    } catch (err) {
      console.error(`Oxford lookup failed for "${word}":`, err.message);
      return null;
    }
  }

  private async lookupWiktionary(word: string) {
    try {
      const res = await axios.get<WiktionaryResponse>(this.wiktionaryBaseUrl, {
        params: {
          action: 'query',
          prop: 'extracts',
          titles: word,
          format: 'json',
          redirects: 1,
          origin: '*',
        },
      });

      const pages = res.data?.query?.pages;
      const firstPageKey = pages ? Object.keys(pages)[0] : null;
      if (!firstPageKey || firstPageKey === '-1') return null;

      const extract = pages[firstPageKey]?.extract;
      if (!extract) return null;

      // Strip HTML and extract first sentence as definition
      const plainText = extract.replace(/<[^>]+>/g, '').trim();
      const definition = plainText.split('. ')[0];

      if (!definition) return null;

      return {
        definition,
        source: 'Wiktionary',
      };
    } catch (err) {
      console.error(`Wiktionary lookup failed for "${word}":`, err.message);
      return null;
    }
  }
}
