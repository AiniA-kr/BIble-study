import React, { useState, useEffect } from 'react';
import { Copy, Search, Check, BookOpen } from 'lucide-react';

const BiblePassageFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [language, setLanguage] = useState("KOR");
  const [isLoading, setIsLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  
  // Bible versions configuration
  const BIBLE_VERSIONS = {
    KOR: {
      id: "c13c4a36c587ca7c-01", // Korean (개역한글)
      name: "개역한글",
    },
    SPA: {
      id: "592420522e16049f-01", // Spanish (Reina Valera 1960)
      name: "Reina Valera 1960",
    },
    ENG: {
      id: "de4e12af7f28f599-02", // English (KJV)
      name: "King James Version",
    }
  };
  
  // API base URL
  const API_BASE_URL = "https://api.scripture.api.bible/v1";
  
  // API key
  const API_KEY = "e348dad88a6ca3d3a5552d21543209cb"; // Your API key from API.Bible
  
  // Book IDs mapping (for Korean, Spanish, and English versions)
  const bookMappings = {
    KOR: {
      '창': 'GEN', '출': 'EXO', '레': 'LEV', '민': 'NUM', '신': 'DEU',
      '수': 'JOS', '삿': 'JDG', '룻': 'RUT', '삼상': '1SA', '삼하': '2SA',
      '왕상': '1KI', '왕하': '2KI', '대상': '1CH', '대하': '2CH', '스': 'EZR',
      '느': 'NEH', '에': 'EST', '욥': 'JOB', '시': 'PSA', '잠': 'PRO',
      '전': 'ECC', '아': 'SNG', '사': 'ISA', '렘': 'JER', '애': 'LAM',
      '겔': 'EZK', '단': 'DAN', '호': 'HOS', '욜': 'JOL', '암': 'AMO',
      '옵': 'OBA', '욘': 'JON', '미': 'MIC', '나': 'NAM', '합': 'HAB',
      '습': 'ZEP', '학': 'HAG', '슥': 'ZEC', '말': 'MAL', '마': 'MAT',
      '막': 'MRK', '눅': 'LUK', '요': 'JHN', '행': 'ACT', '롬': 'ROM',
      '고전': '1CO', '고후': '2CO', '갈': 'GAL', '엡': 'EPH', '빌': 'PHP',
      '골': 'COL', '살전': '1TH', '살후': '2TH', '딤전': '1TI', '딤후': '2TI',
      '딛': 'TIT', '몬': 'PHM', '히': 'HEB', '약': 'JAS', '벧전': '1PE',
      '벧후': '2PE', '요일': '1JN', '요이': '2JN', '요삼': '3JN', '유': 'JUD',
      '계': 'REV'
    },
    SPA: {
      'Gn': 'GEN', 'Ex': 'EXO', 'Lv': 'LEV', 'Nm': 'NUM', 'Dt': 'DEU',
      'Jos': 'JOS', 'Jue': 'JDG', 'Rt': 'RUT', '1S': '1SA', '2S': '2SA',
      '1R': '1KI', '2R': '2KI', '1Cr': '1CH', '2Cr': '2CH', 'Esd': 'EZR',
      'Neh': 'NEH', 'Est': 'EST', 'Job': 'JOB', 'Sal': 'PSA', 'Pr': 'PRO',
      'Ec': 'ECC', 'Cnt': 'SNG', 'Is': 'ISA', 'Jer': 'JER', 'Lm': 'LAM',
      'Ez': 'EZK', 'Dn': 'DAN', 'Os': 'HOS', 'Jl': 'JOL', 'Am': 'AMO',
      'Abd': 'OBA', 'Jon': 'JON', 'Mi': 'MIC', 'Nah': 'NAM', 'Hab': 'HAB',
      'Sof': 'ZEP', 'Hag': 'HAG', 'Zac': 'ZEC', 'Mal': 'MAL', 'Mt': 'MAT',
      'Mr': 'MRK', 'Lc': 'LUK', 'Jn': 'JHN', 'Hch': 'ACT', 'Ro': 'ROM',
      '1Co': '1CO', '2Co': '2CO', 'Ga': 'GAL', 'Ef': 'EPH', 'Fil': 'PHP',
      'Col': 'COL', '1Ts': '1TH', '2Ts': '2TH', '1Ti': '1TI', '2Ti': '2TI',
      'Tit': 'TIT', 'Flm': 'PHM', 'He': 'HEB', 'Stg': 'JAS', '1P': '1PE',
      '2P': '2PE', '1Jn': '1JN', '2Jn': '2JN', '3Jn': '3JN', 'Jud': 'JUD',
      'Ap': 'REV'
    },
    ENG: {
      'Gen': 'GEN', 'Exo': 'EXO', 'Lev': 'LEV', 'Num': 'NUM', 'Deu': 'DEU',
      'Jos': 'JOS', 'Jdg': 'JDG', 'Rth': 'RUT', '1Sa': '1SA', '2Sa': '2SA',
      '1Ki': '1KI', '2Ki': '2KI', '1Ch': '1CH', '2Ch': '2CH', 'Ezr': 'EZR',
      'Neh': 'NEH', 'Est': 'EST', 'Job': 'JOB', 'Psa': 'PSA', 'Pro': 'PRO',
      'Ecc': 'ECC', 'Son': 'SNG', 'Isa': 'ISA', 'Jer': 'JER', 'Lam': 'LAM',
      'Eze': 'EZK', 'Dan': 'DAN', 'Hos': 'HOS', 'Joe': 'JOL', 'Amo': 'AMO',
      'Oba': 'OBA', 'Jon': 'JON', 'Mic': 'MIC', 'Nah': 'NAM', 'Hab': 'HAB',
      'Zep': 'ZEP', 'Hag': 'HAG', 'Zec': 'ZEC', 'Mal': 'MAL', 'Mat': 'MAT',
      'Mar': 'MRK', 'Luk': 'LUK', 'Joh': 'JHN', 'Act': 'ACT', 'Rom': 'ROM',
      '1Co': '1CO', '2Co': '2CO', 'Gal': 'GAL', 'Eph': 'EPH', 'Php': 'PHP',
      'Col': 'COL', '1Th': '1TH', '2Th': '2TH', '1Ti': '1TI', '2Ti': '2TI',
      'Tit': 'TIT', 'Phm': 'PHM', 'Heb': 'HEB', 'Jas': 'JAS', '1Pe': '1PE',
      '2Pe': '2PE', '1Jo': '1JN', '2Jo': '2JN', '3Jo': '3JN', 'Jud': 'JUD',
      'Rev': 'REV',
      // English short forms
      'Gn': 'GEN', 'Ex': 'EXO', 'Lv': 'LEV', 'Nm': 'NUM', 'Dt': 'DEU',
      'Jsh': 'JOS', 'Jdgs': 'JDG', 'Ru': 'RUT', 'Ps': 'PSA', 'Prv': 'PRO',
      'Eccl': 'ECC', 'Is': 'ISA', 'Ez': 'EZK', 'Mt': 'MAT', 'Mk': 'MRK',
      'Lk': 'LUK', 'Jn': 'JHN', 'Rm': 'ROM', 'Gal': 'GAL', 'Eph': 'EPH',
      'Phil': 'PHP', 'Hb': 'HEB', 'Rv': 'REV'
    }
  };
  
  // Full book names mapping (for better display)
  const fullBookNames = {
    KOR: {
      'GEN': '창세기', 'EXO': '출애굽기', 'LEV': '레위기', 'NUM': '민수기', 'DEU': '신명기',
      'JOS': '여호수아', 'JDG': '사사기', 'RUT': '룻기', '1SA': '사무엘상', '2SA': '사무엘하',
      '1KI': '열왕기상', '2KI': '열왕기하', '1CH': '역대상', '2CH': '역대하', 'EZR': '에스라',
      'NEH': '느헤미야', 'EST': '에스더', 'JOB': '욥기', 'PSA': '시편', 'PRO': '잠언',
      'ECC': '전도서', 'SNG': '아가', 'ISA': '이사야', 'JER': '예레미야', 'LAM': '예레미야애가',
      'EZK': '에스겔', 'DAN': '다니엘', 'HOS': '호세아', 'JOL': '요엘', 'AMO': '아모스',
      'OBA': '오바댜', 'JON': '요나', 'MIC': '미가', 'NAM': '나훔', 'HAB': '하박국',
      'ZEP': '스바냐', 'HAG': '학개', 'ZEC': '스가랴', 'MAL': '말라기', 'MAT': '마태복음',
      'MRK': '마가복음', 'LUK': '누가복음', 'JHN': '요한복음', 'ACT': '사도행전', 'ROM': '로마서',
      '1CO': '고린도전서', '2CO': '고린도후서', 'GAL': '갈라디아서', 'EPH': '에베소서', 'PHP': '빌립보서',
      'COL': '골로새서', '1TH': '데살로니가전서', '2TH': '데살로니가후서', '1TI': '디모데전서', '2TI': '디모데후서',
      'TIT': '디도서', 'PHM': '빌레몬서', 'HEB': '히브리서', 'JAS': '야고보서', '1PE': '베드로전서',
      '2PE': '베드로후서', '1JN': '요한일서', '2JN': '요한이서', '3JN': '요한삼서', 'JUD': '유다서',
      'REV': '요한계시록'
    },
    SPA: {
      'GEN': 'Génesis', 'EXO': 'Éxodo', 'LEV': 'Levítico', 'NUM': 'Números', 'DEU': 'Deuteronomio',
      'JOS': 'Josué', 'JDG': 'Jueces', 'RUT': 'Rut', '1SA': '1 Samuel', '2SA': '2 Samuel',
      '1KI': '1 Reyes', '2KI': '2 Reyes', '1CH': '1 Crónicas', '2CH': '2 Crónicas', 'EZR': 'Esdras',
      'NEH': 'Nehemías', 'EST': 'Ester', 'JOB': 'Job', 'PSA': 'Salmos', 'PRO': 'Proverbios',
      'ECC': 'Eclesiastés', 'SNG': 'Cantares', 'ISA': 'Isaías', 'JER': 'Jeremías', 'LAM': 'Lamentaciones',
      'EZK': 'Ezequiel', 'DAN': 'Daniel', 'HOS': 'Oseas', 'JOL': 'Joel', 'AMO': 'Amós',
      'OBA': 'Abdías', 'JON': 'Jonás', 'MIC': 'Miqueas', 'NAM': 'Nahum', 'HAB': 'Habacuc',
      'ZEP': 'Sofonías', 'HAG': 'Hageo', 'ZEC': 'Zacarías', 'MAL': 'Malaquías', 'MAT': 'Mateo',
      'MRK': 'Marcos', 'LUK': 'Lucas', 'JHN': 'Juan', 'ACT': 'Hechos', 'ROM': 'Romanos',
      '1CO': '1 Corintios', '2CO': '2 Corintios', 'GAL': 'Gálatas', 'EPH': 'Efesios', 'PHP': 'Filipenses',
      'COL': 'Colosenses', '1TH': '1 Tesalonicenses', '2TH': '2 Tesalonicenses', '1TI': '1 Timoteo', '2TI': '2 Timoteo',
      'TIT': 'Tito', 'PHM': 'Filemón', 'HEB': 'Hebreos', 'JAS': 'Santiago', '1PE': '1 Pedro',
      '2PE': '2 Pedro', '1JN': '1 Juan', '2JN': '2 Juan', '3JN': '3 Juan', 'JUD': 'Judas',
      'REV': 'Apocalipsis'
    },
    ENG: {
      'GEN': 'Genesis', 'EXO': 'Exodus', 'LEV': 'Leviticus', 'NUM': 'Numbers', 'DEU': 'Deuteronomy',
      'JOS': 'Joshua', 'JDG': 'Judges', 'RUT': 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
      '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles', 'EZR': 'Ezra',
      'NEH': 'Nehemiah', 'EST': 'Esther', 'JOB': 'Job', 'PSA': 'Psalms', 'PRO': 'Proverbs',
      'ECC': 'Ecclesiastes', 'SNG': 'Song of Solomon', 'ISA': 'Isaiah', 'JER': 'Jeremiah', 'LAM': 'Lamentations',
      'EZK': 'Ezekiel', 'DAN': 'Daniel', 'HOS': 'Hosea', 'JOL': 'Joel', 'AMO': 'Amos',
      'OBA': 'Obadiah', 'JON': 'Jonah', 'MIC': 'Micah', 'NAM': 'Nahum', 'HAB': 'Habakkuk',
      'ZEP': 'Zephaniah', 'HAG': 'Haggai', 'ZEC': 'Zechariah', 'MAL': 'Malachi', 'MAT': 'Matthew',
      'MRK': 'Mark', 'LUK': 'Luke', 'JHN': 'John', 'ACT': 'Acts', 'ROM': 'Romans',
      '1CO': '1 Corinthians', '2CO': '2 Corinthians', 'GAL': 'Galatians', 'EPH': 'Ephesians', 'PHP': 'Philippians',
      'COL': 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians', '1TI': '1 Timothy', '2TI': '2 Timothy',
      'TIT': 'Titus', 'PHM': 'Philemon', 'HEB': 'Hebrews', 'JAS': 'James', '1PE': '1 Peter',
      '2PE': '2 Peter', '1JN': '1 John', '2JN': '2 John', '3JN': '3 John', 'JUD': 'Jude',
      'REV': 'Revelation'
    }
  };
  
  // Parse Bible reference with enhanced flexibility
  const parseReference = (reference) => {
    // Remove whitespace and normalize
    const normalizedRef = reference.trim().replace(/\s+/g, '');
    
    // Various patterns to match different reference formats
    const patterns = [
      // Standard formats: Book chapter:verse or Book chapter:verse-verse
      {
        pattern: /^(\D+)(\d+):(\d+)$/,                  // 창1:1
        type: "single",
        extract: (match) => ({ book: match[1], chapter: parseInt(match[2]), verse: parseInt(match[3]) })
      },
      {
        pattern: /^(\D+)(\d+):(\d+)-(\d+)$/,            // 창1:1-3
        type: "verseRange",
        extract: (match) => ({ 
          book: match[1], 
          chapter: parseInt(match[2]), 
          startVerse: parseInt(match[3]), 
          endVerse: parseInt(match[4]) 
        })
      },
      {
        pattern: /^(\D+)(\d+):(\d+)-(\d+):(\d+)$/,     // 창1:1-2:3
        type: "chapterRange",
        extract: (match) => ({ 
          book: match[1], 
          startChapter: parseInt(match[2]), 
          startVerse: parseInt(match[3]), 
          endChapter: parseInt(match[4]), 
          endVerse: parseInt(match[5]) 
        })
      },
      // Space-separated formats
      {
        pattern: /^(\D+)\s*(\d+)\s*:\s*(\d+)$/,         // 창 1 : 1
        type: "single",
        extract: (match) => ({ book: match[1], chapter: parseInt(match[2]), verse: parseInt(match[3]) })
      },
      // Format without colon
      {
        pattern: /^(\D+)(\d+)(\d+)$/,                   // 창11 (chapter 1, verse 1)
        type: "single",
        extract: (match) => ({ book: match[1], chapter: parseInt(match[2]), verse: parseInt(match[3]) })
      },
      // Whole chapter
      {
        pattern: /^(\D+)(\d+)$/,                         // 창1 (chapter 1)
        type: "chapter",
        extract: (match) => ({ book: match[1], chapter: parseInt(match[2]) })
      },
      // Multiple verses in same chapter 
      {
        pattern: /^(\D+)(\d+):(\d+),(\d+)$/,            // 창1:1,3 (verses 1 and 3)
        type: "multiVerse",
        extract: (match) => ({ 
          book: match[1], 
          chapter: parseInt(match[2]), 
          verses: [parseInt(match[3]), parseInt(match[4])]
        })
      },
      {
        pattern: /^(\D+)(\d+):(\d+),(\d+),(\d+)$/,      // 창1:1,3,5 (verses 1, 3 and 5)
        type: "multiVerse",
        extract: (match) => ({ 
          book: match[1], 
          chapter: parseInt(match[2]), 
          verses: [parseInt(match[3]), parseInt(match[4]), parseInt(match[5])]
        })
      },
      // Multiple verse ranges
      {
        pattern: /^(\D+)(\d+):(\d+)-(\d+),(\d+)-(\d+)$/,  // 창1:1-3,5-7
        type: "multiRange",
        extract: (match) => ({ 
          book: match[1], 
          chapter: parseInt(match[2]), 
          ranges: [
            { start: parseInt(match[3]), end: parseInt(match[4]) },
            { start: parseInt(match[5]), end: parseInt(match[6]) }
          ]
        })
      }
    ];
    
    // Try each pattern
    for (const { pattern, type, extract } of patterns) {
      const match = normalizedRef.match(pattern);
      if (match) {
        const result = extract(match);
        return { ...result, type };
      }
    }
    
    // If no standard pattern matches, try fuzzy matching for book names
    // This helps with typos or alternative spellings
    const possibleBookMatch = findPossibleBook(normalizedRef, language);
    if (possibleBookMatch) {
      // Try to extract chapter and verse after finding a possible book
      const bookLength = possibleBookMatch.length;
      const remaining = normalizedRef.slice(bookLength);
      
      // Simple number extraction for chapter
      const chapterMatch = remaining.match(/^(\d+)/);
      if (chapterMatch) {
        return {
          book: possibleBookMatch,
          chapter: parseInt(chapterMatch[1]),
          type: "chapter"
        };
      }
    }
    
    return null;
  };
  
  // Fuzzy book name matching
  const findPossibleBook = (input, lang) => {
    const mappings = bookMappings[lang];
    
    // Sort book abbreviations by length (descending) to catch longer matches first
    const bookAbbreviations = Object.keys(mappings).sort((a, b) => b.length - a.length);
    
    for (const abbr of bookAbbreviations) {
      if (input.startsWith(abbr)) {
        return abbr;
      }
    }
    
    return null;
  };
  
  // Make API request
  const makeApiRequest = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API 오류 (${response.status}): ${errorData.message || '알 수 없는 오류'}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API 요청 오류:", error);
      throw error;
    }
  };
  
  // Fetch chapter content
  const fetchChapterContent = async (bibleId, bookId, chapter) => {
    try {
      // First get the chapter ID
      const booksResponse = await makeApiRequest(`${API_BASE_URL}/bibles/${bibleId}/books/${bookId}/chapters`);
      
      // Find the chapter
      const chapterData = booksResponse.data.find(c => c.number === chapter.toString());
      
      if (!chapterData) {
        throw new Error(`${chapter}장을 찾을 수 없습니다.`);
      }
      
      // Get chapter content with verses
      const chapterContent = await makeApiRequest(`${API_BASE_URL}/bibles/${bibleId}/chapters/${chapterData.id}?content-type=text&include-verse-numbers=true&include-verse-spans=true`);
      
      return chapterContent;
    } catch (error) {
      console.error("장 내용 가져오기 오류:", error);
      throw error;
    }
  };
  
  // Process multi-verse references
  const processMultiVerse = (parsedRef, allVerses) => {
    const results = [];
    
    // Handle individual verses
    for (const verse of parsedRef.verses) {
      if (verse <= allVerses.length) {
        results.push({
          reference: `${parsedRef.book} ${parsedRef.chapter}:${verse}`,
          text: allVerses[verse - 1].trim()
        });
      }
    }
    
    return results;
  };
  
  // Process multi-range references
  const processMultiRange = (parsedRef, allVerses) => {
    const results = [];
    
    // Handle each range
    for (const range of parsedRef.ranges) {
      for (let v = range.start; v <= range.end; v++) {
        if (v <= allVerses.length) {
          results.push({
            reference: `${parsedRef.book} ${parsedRef.chapter}:${v}`,
            text: allVerses[v - 1].trim()
          });
        }
      }
    }
    
    return results;
  };
  
  // Process whole chapter
  const processWholeChapter = (parsedRef, allVerses, bookCode) => {
    const results = [];
    const bookName = getFullBookName(bookCode, language);
    
    for (let v = 1; v <= allVerses.length; v++) {
      results.push({
        reference: `${bookName} ${parsedRef.chapter}:${v}`,
        text: allVerses[v - 1].trim()
      });
    }
    
    return results;
  };
  
  // Get full book name
  const getFullBookName = (bookCode, lang) => {
    return fullBookNames[lang][bookCode] || bookCode;
  };
  
  // Fetch verse by reference with enhanced support for various formats
  const fetchVerse = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError("");
    setSearchResult([]);
    
    try {
      // Parse the reference
      const parsedRef = parseReference(searchQuery.trim());
      if (!parsedRef) {
        setError("유효하지 않은 참조 형식입니다. 예: '창1:1', '요3:16'");
        setIsLoading(false);
        return;
      }
      
      // Get book ID
      const bookCode = bookMappings[language][parsedRef.book];
      if (!bookCode) {
        setError("지원되지 않는 책 약어입니다.");
        setIsLoading(false);
        return;
      }
      
      const bibleId = BIBLE_VERSIONS[language].id;
      
      // For API calls (not used in mock mode)
      // let chapterData;
      // if (parsedRef.type === "chapterRange") {
      //   // Fetch multiple chapters for chapter range
      // } else {
      //   // Fetch single chapter
      //   chapterData = await fetchChapterContent(
      //     bibleId, 
      //     bookCode, 
      //     parsedRef.type === "chapter" || parsedRef.type === "single" || 
      //     parsedRef.type === "verseRange" || parsedRef.type === "multiVerse" || 
      //     parsedRef.type === "multiRange" ? parsedRef.chapter : parsedRef.startChapter
      //   );
      // }
      
      // Add to search history
      const historyItem = {
        query: searchQuery.trim(),
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
      
      // Use mock fetch for testing
      mockFetchVerse(parsedRef, bookCode);
      
    } catch (error) {
      setError(`오류가 발생했습니다: ${error.message}`);
      setIsLoading(false);
    }
  };
  
  // Mock fetch for testing without API
  const mockFetchVerse = (parsedRef, bookCode) => {
    setIsLoading(true);
    setError("");
    
    // Extended mock data
    const mockData = {
      KOR: {
        "창1:1": "태초에 하나님이 천지를 창조하시니라",
        "창1:2": "땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 영은 수면 위에 운행하시니라",
        "창1:3": "하나님이 이르시되 빛이 있으라 하시니 빛이 있었고",
        "창1:4": "빛이 하나님이 보시기에 좋았더라 하나님이 빛과 어둠을 나누사",
        "창1:5": "빛을 낮이라 부르시고 어둠을 밤이라 부르시니라 저녁이 되고 아침이 되니 이는 첫째 날이니라",
        "창1:6": "하나님이 이르시되 물 가운데에 궁창이 있어 물과 물로 나뉘라 하시고",
        "창1:7": "하나님이 궁창을 만드사 궁창 아래의 물과 궁창 위의 물로 나뉘게 하시니 그대로 되니라",
        "창1:8": "하나님이 궁창을 하늘이라 부르시니라 저녁이 되고 아침이 되니 이는 둘째 날이니라",
        "창1:9": "하나님이 이르시되 천하의 물이 한 곳으로 모이고 뭍이 드러나라 하시니 그대로 되니라",
        "창1:10": "하나님이 뭍을 땅이라 부르시고 모인 물을 바다라 부르시니 하나님이 보시기에 좋았더라",
        "요3:16": "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이니라",
        "시23:1": "여호와는 나의 목자시니 내게 부족함이 없으리로다",
        "시23:2": "그가 나를 푸른 초장에 누이시며 쉴 만한 물가로 인도하시는도다",
        "시23:3": "내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다",
        "시23:4": "내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라 주의 지팡이와 막대기가 나를 안위하시나이다",
        "시23:5": "주께서 내 원수의 목전에서 내게 상을 차려 주시고 기름을 내 머리에 부으셨으니 내 잔이 넘치나이다",
        "시23:6": "내 평생에 선하심과 인자하심이 반드시 나를 따르리니 내가 여호와의 집에 영원히 살리로다",
        // Adding more popular verses
        "마28:19": "그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고",
        "마28:20": "내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라 볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라 하시니라",
        "롬8:28": "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라"
      }
    }
};