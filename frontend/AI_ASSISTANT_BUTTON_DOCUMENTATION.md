# Dokumentacja Przycisku "Sprawdź tekst" i Diod Sygnalizacyjnych

## Przegląd funkcjonalności

W sekcji 8 (Informacje o wypadku) został dodany inteligentny system sprawdzania opisu wypadku z następującymi elementami:

### 1. Przycisk "Sprawdź tekst"
- **Lokalizacja**: Pod polem tekstowym z opisem wypadku
- **Funkcjonalność**: Ręczne wywołanie analizy AI opisu wypadku
- **Stany przycisku**:
  - 🔍 **Sprawdź tekst** - stan początkowy, gotowy do analizy
  - ⏳ **Analizuję...** - podczas trwania analizy (z animowanym spinnerem)
  - ✅ **Sprawdzono** - po wykonaniu analizy

### 2. Diody Sygnalizacyjne (LED Status Indicators)
Pojawiają się obok przycisku po wykonaniu sprawdzenia i pokazują status 6 kluczowych aspektów opisu:

| Dioda | Znaczenie | Kolor OK | Kolor Błąd |
|-------|-----------|----------|------------|
| **Kiedy** | Informacja o czasie wypadku | Zielony | Czerwony |
| **Gdzie** | Lokalizacja wypadku | Zielony | Czerwony |
| **Co robił** | Czynności poszkodowanego | Zielony | Czerwony |
| **Jak** | Sekwencja zdarzeń | Zielony | Czerwony |
| **Dlaczego** | Przyczyna wypadku | Zielony | Czerwony |
| **Skutki** | Opis urazów | Zielony | Czerwony |

#### Wygląd diod:
- ✅ **Zielona dioda**: Świeci stałym zielonym światłem - aspekt prawidłowy
- ❌ **Czerwona dioda**: Pulsuje czerwonym światłem - aspekt brakujący/niepełny

### 3. Automatyczne Sprawdzenie
Jeśli użytkownik kliknie "Dalej" bez wcześniejszego sprawdzenia:
- System automatycznie wykona analizę przed przejściem do następnej sekcji
- Użytkownik zobaczy krótką animację "Analizuję..."
- Po zakończeniu analizy strona przejdzie dalej

## Mock API - Tymczasowa Implementacja

### Funkcja: `callAIAssistant(description)`

**Lokalizacja**: `/frontend/src/components/Section8.js`

**Opis**: Symuluje wywołanie prawdziwego API asystenta AI. Zwraca strukturę danych identyczną z oczekiwaną odpowiedzią z backendu.

#### Parametry wejściowe:
```javascript
description: string  // Tekst opisu wypadku do analizy
```

#### Symulowane opóźnienie:
```javascript
await new Promise(resolve => setTimeout(resolve, 500));  // 500ms
```

#### Struktura odpowiedzi API:
```javascript
{
  aspects: [
    {
      name: string,         // Nazwa aspektu: 'when', 'where', 'what_doing', 'how_happened', 'why_cause', 'consequence'
      status: string,       // Status: 'ok' | 'missing' | 'incomplete'
      userMessage: string   // Komunikat dla użytkownika z sugestią poprawy
    },
    // ... kolejne aspekty
  ]
}
```

### Mapowanie statusów:

#### Status: 'ok'
- Aspekt prawidłowo opisany w tekście
- Dioda LED świeci na **zielono**
- Brak rekomendacji dla tego aspektu

#### Status: 'missing'
- Aspekt całkowicie brakuje w opisie
- Dioda LED świeci na **czerwono** (pulsuje)
- Priorytet rekomendacji: **HIGH**
- Komunikat użytkownika zawiera konkretną sugestię jak poprawić

#### Status: 'incomplete'
- Aspekt częściowo obecny, ale wymaga uzupełnienia
- Dioda LED świeci na **czerwono** (pulsuje)
- Priorytet rekomendacji: **MEDIUM**
- Komunikat użytkownika wskazuje co należy dodać

### Przykład użycia Mock API:

```javascript
// Wywołanie
const response = await callAIAssistant(userDescription);

// Przykładowa odpowiedź dla niepełnego opisu
{
  aspects: [
    {
      name: 'when',
      status: 'ok',
      userMessage: '...'
    },
    {
      name: 'where',
      status: 'missing',
      userMessage: 'Wskaż dokładną lokalizację: nazwę pomieszczenia, halę...'
    },
    {
      name: 'what_doing',
      status: 'ok',
      userMessage: '...'
    },
    {
      name: 'how_happened',
      status: 'incomplete',
      userMessage: 'Opisz krok po kroku przebieg wypadku...'
    },
    {
      name: 'why_cause',
      status: 'missing',
      userMessage: 'Wyjaśnij, co było bezpośrednią przyczyną wypadku...'
    },
    {
      name: 'consequence',
      status: 'ok',
      userMessage: '...'
    }
  ]
}
```

## Integracja z Prawdziwym API

### Kroki do podłączenia backendu:

1. **Zmień funkcję `callAIAssistant`** w `/frontend/src/components/Section8.js`:

```javascript
// PRZED (mock):
const callAIAssistant = async (description) => {
  setIsAnalyzing(true);
  await new Promise(resolve => setTimeout(resolve, 500));
  // ... mock data ...
  setIsAnalyzing(false);
  return mockApiResponse;
};

// PO (prawdziwe API):
const callAIAssistant = async (description) => {
  setIsAnalyzing(true);
  
  try {
    const response = await fetch('/api/analyze-accident-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    setIsAnalyzing(false);
    return data;
    
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    setIsAnalyzing(false);
    // Możesz zwrócić mock data jako fallback
    return mockApiResponse;
  }
};
```

2. **Endpoint backendu**: `/api/analyze-accident-description`

**Request:**
```json
POST /api/analyze-accident-description
Content-Type: application/json

{
  "description": "O godzinie 14:30 w hali produkcyjnej..."
}
```

**Response:**
```json
{
  "aspects": [
    {
      "name": "when",
      "status": "ok",
      "userMessage": "Dodaj precyzyjną godzinę wystąpienia wypadku..."
    },
    // ... pozostałe aspekty
  ]
}
```

### Kontrak API - Wymagania dla backendu:

#### Aspekty do sprawdzenia:
1. **when** - Czas wypadku (godzina, okoliczności czasowe)
2. **where** - Miejsce wypadku (lokalizacja, pomieszczenie, stanowisko)
3. **what_doing** - Czynności wykonywane przez poszkodowanego
4. **how_happened** - Przebieg zdarzeń (sekwencja, kolejność)
5. **why_cause** - Przyczyna wypadku
6. **consequence** - Skutki wypadku (urazy)

#### Dozwolone wartości status:
- `"ok"` - aspekt prawidłowy
- `"missing"` - aspekt brakuje całkowicie
- `"incomplete"` - aspekt częściowo obecny

#### Wymagania dla userMessage:
- Jasny, konkretny komunikat w języku polskim
- Sugestia jak poprawić/uzupełnić dany aspekt
- Opcjonalnie przykład poprawnego zapisu
- Długość: 50-200 znaków

## Stan Aplikacji - Zarządzanie

### Nowe stany w komponencie Section8:

```javascript
const [isChecked, setIsChecked] = useState(false);     // Czy tekst został sprawdzony
const [isAnalyzing, setIsAnalyzing] = useState(false); // Czy trwa analiza
```

### Logika resetowania:

```javascript
useEffect(() => {
  if (formData.accidentDescription && formData.accidentDescription.length > 20) {
    setShowAnalysis(true);
    // Reset flagi sprawdzenia gdy tekst się zmienił
    if (isChecked) {
      setIsChecked(false);
    }
  } else {
    setShowAnalysis(false);
    setIsChecked(false);
  }
}, [formData.accidentDescription]);
```

**Zachowanie:**
- Gdy użytkownik edytuje tekst po sprawdzeniu → flaga `isChecked` wraca do `false`
- Diody LED znikają
- Przycisk zmienia się z "✅ Sprawdzono" na "🔍 Sprawdź tekst"
- Sekcja z rekomendacjami znika

## Warstwa wizualna

### Komponent StatusLED:

```javascript
function StatusLED({ status, label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.3rem 0.6rem',
      background: status ? '#e8f5e9' : '#ffebee',
      borderRadius: '12px',
      border: `1px solid ${status ? '#4caf50' : '#f44336'}`,
      fontSize: '0.75rem',
      fontWeight: '600'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: status ? '#4caf50' : '#f44336',
        boxShadow: status ? '0 0 6px #4caf50' : '0 0 6px #f44336',
        animation: status ? 'none' : 'pulse 2s ease-in-out infinite'
      }}></div>
      <span style={{ color: status ? '#2e7d32' : '#c62828' }}>
        {label}
      </span>
    </div>
  );
}
```

### Animacje CSS dodane do App.css:

```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

## Flow użytkownika

### Scenariusz 1: Użytkownik klika "Sprawdź tekst"
1. Użytkownik wpisuje opis wypadku (min. 20 znaków)
2. Pojawia się przycisk "🔍 Sprawdź tekst"
3. Kliknięcie → przycisk zmienia się na "Analizuję..." ze spinnerem
4. Po 500ms (mock) / po odpowiedzi API:
   - Przycisk → "✅ Sprawdzono"
   - Pojawiają się diody LED z statusami
   - Rozwija się sekcja z pełną analizą i rekomendacjami

### Scenariusz 2: Użytkownik klika "Dalej" bez sprawdzenia
1. Użytkownik wypełnia formularz i klika "Dalej"
2. System wykrywa brak sprawdzenia (`isChecked === false`)
3. Automatycznie wywołuje `analyzeDescription()`
4. Krótka animacja "Analizuję..."
5. Po zakończeniu analizy przejście do następnej sekcji

### Scenariusz 3: Użytkownik edytuje tekst po sprawdzeniu
1. Tekst został sprawdzony, diody LED świecą
2. Użytkownik modyfikuje opis
3. Automatycznie:
   - `isChecked` → `false`
   - Diody LED znikają
   - Przycisk wraca do "🔍 Sprawdź tekst"
   - Użytkownik musi ponownie sprawdzić

## Testowanie Mock API

### Test 1: Pełny opis (wszystko OK)

**Wejście:**
```
O godzinie 14:30 w hali produkcyjnej nr 2, przy stanowisku pakowania, 
pracownik zajmował się układaniem paczek na palecie. Podczas podnoszenia 
ciężkiej skrzynki, poślizgnął się na mokrej podłodze, ponieważ wcześniej 
została ona umyta bez oznakowania. W wyniku upadku doznał złamania 
nadgarstka prawej ręki.
```

**Oczekiwany wynik:**
- Wszystkie 6 diod LED: ✅ zielone
- Completion: 100%
- Komunikat: "Doskonały opis wypadku!"

### Test 2: Brak informacji o czasie

**Wejście:**
```
W hali produkcyjnej pracownik zajmował się pakowaniem. Poślizgnął się 
na mokrej podłodze i upadł, doznając złamania ręki.
```

**Oczekiwany wynik:**
- Dioda "Kiedy": ❌ czerwona (pulsuje)
- Pozostałe zależnie od treści
- Rekomendacja: "Dodaj precyzyjną godzinę wystąpienia wypadku..."

### Test 3: Bardzo krótki opis

**Wejście:**
```
Upadek
```

**Oczekiwany wynik:**
- Przycisk nie pojawia się (< 20 znaków)
- Brak analizy

## Przyszłe rozszerzenia

### Możliwe ulepszenia:
1. **Podpowiedzi w czasie rzeczywistym** - analiza podczas pisania (debounced)
2. **Wskaźnik postępu** - progress bar pokazujący ile aspektów zostało uzupełnionych
3. **Sugerowane frazy** - system podpowiadający konkretne sformułowania
4. **Historia sprawdzeń** - zapisywanie poprzednich wersji i analiz
5. **Export raportu** - PDF z wynikami analizy AI
6. **Porównanie wersji** - diff między poprawioną a oryginalną wersją
7. **Wsparcie głosowe** - możliwość diktowania opisu z automatyczną transkrypcją
8. **Inteligentne uzupełnianie** - AI sugeruje brakujące fragmenty

## Troubleshooting

### Problem: Przycisk nie pojawia się
**Rozwiązanie:** Sprawdź czy opis ma minimum 20 znaków

### Problem: Diody nie pojawiają się po kliknięciu
**Rozwiązanie:** Sprawdź konsolę przeglądarki - może być błąd w mocku API

### Problem: Analiza trwa zbyt długo
**Rozwiązanie:** Zmniejsz timeout w `callAIAssistant` lub sprawdź połączenie z API

### Problem: Wszystkie diody czerwone mimo dobrego opisu
**Rozwiązanie:** Sprawdź regex patterns w mocku - mogą nie pasować do polskiego tekstu

## Podsumowanie

System "Sprawdź tekst" z diodami sygnalizacyjnymi:
- ✅ Zapewnia natychmiastowy feedback wizualny
- ✅ Wymusza sprawdzenie jakości opisu przed wysłaniem
- ✅ Używa mock API gotowego do podmienienia na prawdziwe
- ✅ Jest intuicyjny i przyjazny dla użytkownika
- ✅ Zawiera animacje i efekty wizualne
- ✅ Automatycznie sprawdza tekst jeśli użytkownik zapomni

**Status**: Gotowe do testów i podłączenia prawdziwego backendu! 🚀
