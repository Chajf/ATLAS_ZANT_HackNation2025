# AI Assistant - Analiza Opisu Wypadku (Sekcja 8)

## Przegląd funkcjonalności

Sekcja 8 została wzbogacona o **inteligentny system analizy AI**, który w czasie rzeczywistym ocenia jakość i kompletność opisu wypadku. System ten pomaga użytkownikom tworzyć kompletne i dokładne zgłoszenia wypadków.

---

## Struktura Sekcji 8

### 1. Podstawowe informacje 📋
**Tło**: Szare (`#f8f9fa`)  
**Pola**:
- Data wypadku
- Godzina wypadku
- Miejsce wypadku
- Planowana godzina rozpoczęcia pracy
- Planowana godzina zakończenia pracy

### 2. Opis wypadku i urazów ⚠️ (Kluczowa sekcja)
**Tło**: Pomarańczowe (`#fff9f0`)  
**Border**: Pomarańczowy (`#ffa726`)  
**Zawiera**:

#### A. Rodzaj doznanych urazów
- Textarea (3 wiersze)
- Przykłady: złamanie nadgarstka, skaleczenie, stłuczenie

#### B. Szczegółowy opis okoliczności
- Textarea (8 wierszy)
- **Dynamiczny border**: 
  - 🟢 Zielony gdy kompletność = 100%
  - 🟠 Pomarańczowy gdy < 100%
- **Box shadow**: Pulsujący efekt podczas analizy
- **Wskazówka AI**: Lista 6 kluczowych elementów

#### C. Analiza AI w czasie rzeczywistym
**Automatycznie aktywowana gdy**: tekst > 20 znaków

---

## System Analizy AI

### Algorytm Wykrywania

System analizuje opis wypadku pod kątem **6 kluczowych kryteriów**:

#### 1. **Kiedy?** 🕐 (hasWhen)
**Wzorzec**: `/(\d{1,2}:\d{2}|godzin|około|o\s+\d|rano|wieczór|po południu|dnia|w dniu|podczas|w trakcie|w momencie gdy)/i`

**Szuka**:
- Konkretnej godziny: "14:30", "o 10:00"
- Określeń czasu: "rano", "wieczorem", "po południu"
- Fraz czasowych: "w dniu", "podczas", "w trakcie"

**Przykłady poprawne**:
- ✅ "O godzinie 14:30..."
- ✅ "Około godziny 10:00 rano..."
- ✅ "W dniu 5 grudnia, podczas zmiany..."

#### 2. **Gdzie?** 📍 (hasWhere)
**Wzorzec**: `/(w miejscu|na stanowisku|w pomieszczeniu|w hali|w biurze|na|w|przy|obok|znajduje się|zlokalizow|lokalizacja|obszar|miejsce|strefa)/i`

**Szuka**:
- Nazw pomieszczeń: "w hali", "w biurze", "w pomieszczeniu"
- Lokalizacji: "na stanowisku", "przy", "obok"
- Określeń miejsca: "obszar", "strefa", "miejsce"

**Przykłady poprawne**:
- ✅ "W hali produkcyjnej nr 2..."
- ✅ "Na stanowisku pakowania..."
- ✅ "W pomieszczeniu socjalnym przy stołówce..."

#### 3. **Co robił?** 👷 (hasWhatDoing)
**Wzorzec**: `/(wykonywał|wykonywała|pracował|pracowała|zajmował się|zajmowała się|obsługiwał|obsługiwała|przygotowywał|przygotowywała|realizował|realizowała|podczas|w trakcie)/i`

**Szuka**:
- Czasowników czynności: "wykonywał", "pracował", "obsługiwał"
- Opisów działań: "zajmował się", "przygotowywał"
- Kontekstu: "podczas", "w trakcie"

**Przykłady poprawne**:
- ✅ "Pracownik zajmował się pakowaniem produktów..."
- ✅ "Podczas obsługi maszyny frezującej..."
- ✅ "Wykonywała czynności związane z czyszczeniem..."

#### 4. **Jak doszło?** 📋 (hasHowHappened)
**Wzorzec**: `/(nagle|następnie|po czym|w wyniku|wówczas|wtedy|w efekcie|potem|później|najpierw|za chwilę|niespodziewanie|nieoczekiwanie)/i`

**Szuka**:
- Sekwencji zdarzeń: "najpierw", "następnie", "potem"
- Nagłości: "nagle", "niespodziewanie", "nieoczekiwanie"
- Powiązań: "w wyniku", "w efekcie", "wówczas"

**Przykłady poprawne**:
- ✅ "Najpierw uniósł paczkę, następnie poślizgnął się..."
- ✅ "Nagle urządzenie przestało działać..."
- ✅ "W wyniku tego doszło do..."

#### 5. **Dlaczego?** ❓ (hasWhyCause)
**Wzorzec**: `/(ponieważ|dlatego że|z powodu|z uwagi|ze względu|spowodowane|przyczyna|wynika|na skutek|w wyniku|przez co|wobec czego)/i`

**Szuka**:
- Przyczynowości: "ponieważ", "dlatego że", "z powodu"
- Uzasadnień: "ze względu", "z uwagi"
- Skutków: "spowodowane", "na skutek", "w wyniku"

**Przykłady poprawne**:
- ✅ "Z powodu braku oznakowania..."
- ✅ "Ponieważ maszyna nie była zabezpieczona..."
- ✅ "Przyczyna: niewłaściwe zabezpieczenie..."

#### 6. **Skutki** 🩹 (hasConsequence)
**Wzorzec**: `/(uraz|obrażenie|rana|złamanie|skręcenie|stłuczenie|uszkodzenie|ból|krwawienie|upadek|doznał|doznała|w wyniku czego|co spowodowało|skutkowało)/i`

**Szuka**:
- Rodzajów urazów: "złamanie", "skręcenie", "stłuczenie"
- Opisów obrażeń: "uraz", "obrażenie", "rana"
- Konsekwencji: "doznał", "skutkowało", "w wyniku czego"

**Przykłady poprawne**:
- ✅ "W wyniku upadku doznał złamania nadgarstka..."
- ✅ "Co spowodowało stłuczenie kolana..."
- ✅ "Doznała poważnego urazu głowy..."

---

## Wizualne Wskaźniki

### Panel Analizy AI

**Lokalizacja**: Bezpośrednio pod polem "Szczegółowy opis"  
**Kolor tła**:
- 🟢 Zielony (`#e8f5e9`) gdy kompletność = 100%
- 🟠 Pomarańczowy (`#fff3e0`) gdy < 100%

**Border**:
- 🟢 `2px solid #4caf50` gdy 100%
- 🟠 `2px solid #ff9800` gdy < 100%

### Siatka Wskaźników (6 elementów)

**Layout**: CSS Grid, `repeat(auto-fit, minmax(200px, 1fr))`

Każdy wskaźnik pokazuje:
- **Emoji ikona**: 🕐 📍 👷 📋 ❓ 🩹
- **Etykieta**: "Kiedy?", "Gdzie?", etc.
- **Status**: ✅ (spełnione) lub ❌ (brak)

**Kolory**:
- ✅ Spełnione: Zielone tło `#c8e6c9`, border `#4caf50`
- ❌ Brak: Czerwone tło `#ffcdd2`, border `#f44336`

---

## System Rekomendacji AI

### Typy Priorytetów

#### 1. **HIGH** (Wysoki) ⚠️
**Kolor**: Czerwony (`#ffcdd2`, border `#f44336`)  
**Tytuł**: Czerwony `#c62828`

**Dotyczy**:
- Brak dokładnego czasu
- Niewystarczające określenie miejsca
- Brak opisu wykonywanych czynności
- Nie wskazano przyczyny wypadku

#### 2. **MEDIUM** (Średni) ℹ️
**Kolor**: Żółty (`#fff9c4`, border `#fbc02d`)  
**Tytuł**: Pomarańczowy `#f57f17`

**Dotyczy**:
- Brak sekwencji zdarzeń
- Brak opisu skutków w opisie

#### 3. **SUCCESS** (Sukces) ✅
**Kolor**: Zielony (`#c8e6c9`, border `#4caf50`)  
**Tytuł**: Ciemnozielony `#2e7d32`

**Wyświetlane gdy**: Wszystkie 6 kryteriów spełnione

### Przykłady Rekomendacji

#### Brak czasu:
```
⚠️ Brak dokładnego czasu wypadku

Dodaj precyzyjną godzinę wystąpienia wypadku. 
Przykład: "O godzinie 14:30, podczas..." lub 
"Około godziny 10:00 rano..."
```

#### Brak miejsca:
```
⚠️ Niewystarczające określenie miejsca

Wskaż dokładną lokalizację: nazwę pomieszczenia, 
halę, stanowisko pracy lub konkretny obszar. 
Przykład: "W hali produkcyjnej nr 2, przy stanowisku 
pakowania..." lub "W biurze na pierwszym piętrze..."
```

#### Sukces:
```
✅ Doskonały opis wypadku!

Twój opis zawiera wszystkie kluczowe elementy wymagane 
do prawidłowego zgłoszenia wypadku. Dokument będzie 
kompletny i czytelny dla służb ZUS.
```

---

## Wskaźnik Kompletności

### Obliczanie
```javascript
const getCompletionScore = () => {
  const totalCriteria = 6;
  const metCriteria = Object.values(analysis)
    .filter(val => val === true).length;
  return Math.round((metCriteria / totalCriteria) * 100);
};
```

### Wyświetlanie
**Format**: "Analiza AI: Kompletność opisu (XX%)"

**Przykłady**:
- 0/6 = 0%
- 3/6 = 50%
- 5/6 = 83%
- 6/6 = 100% ✅

---

## Interaktywność

### Automatyczna Analiza
- **Trigger**: Zmiana w polu `accidentDescription`
- **Minimalna długość**: 20 znaków
- **Opóźnienie**: Natychmiastowe (może być dodane debouncing)

### Dynamiczne Efekty
1. **Border textarea**: Zmienia kolor na podstawie kompletności
2. **Box shadow**: Dodawany gdy analiza jest aktywna
3. **Panel AI**: Pojawia się/znika automatycznie
4. **Ikony**: Zmieniają się ✅/❌ w czasie rzeczywistym

---

## Przykład Doskonałego Opisu

```
O godzinie 14:30 w hali produkcyjnej nr 2, przy stanowisku 
pakowania, pracownik zajmował się układaniem paczek na palecie. 
Podczas podnoszenia ciężkiej skrzynki (ok. 25 kg), poślizgnął 
się na mokrej podłodze, ponieważ wcześniej została ona umyta 
bez odpowiedniego oznakowania strefą ostrzegawczą. 

Najpierw pracownik wykonał prawidłowy ruch podnoszenia, 
następnie jego stopa straciła kontakt z podłożem, co spowodowało 
utratę równowagi. W wyniku upadku na bok doznał złamania 
nadgarstka prawej ręki oraz silnego stłuczenia kolana lewej nogi.
```

**Analiza tego opisu**:
- ✅ Kiedy: "O godzinie 14:30"
- ✅ Gdzie: "w hali produkcyjnej nr 2, przy stanowisku pakowania"
- ✅ Co robił: "zajmował się układaniem paczek", "podczas podnoszenia"
- ✅ Jak: "Najpierw... następnie... co spowodowało"
- ✅ Dlaczego: "ponieważ wcześniej została ona umyta bez oznakowania"
- ✅ Skutki: "doznał złamania nadgarstka prawej ręki oraz stłuczenia kolana"

**Wynik**: 100% kompletności! ✅

---

## Techniczne Szczegóły Implementacji

### State Management
```javascript
const [analysis, setAnalysis] = useState({
  hasWhen: false,
  hasWhere: false,
  hasWhatDoing: false,
  hasHowHappened: false,
  hasWhyCause: false,
  hasConsequence: false
});

const [aiRecommendations, setAiRecommendations] = useState([]);
const [showAnalysis, setShowAnalysis] = useState(false);
```

### React Hooks
- **useEffect**: Monitoruje zmiany w `accidentDescription`
- **useState**: Przechowuje wyniki analizy i rekomendacje

### Performance
- Analiza wykonywana w czasie rzeczywistym
- Można dodać debouncing dla lepszej wydajności
- Regex są optymalizowane dla szybkiego dopasowania

---

## Przyszłe Ulepszenia

### Priorytet 1
- [ ] Debouncing (300ms) dla optymalizacji
- [ ] Podpowiedzi inline podczas pisania
- [ ] Highlight słów kluczowych w tekście

### Priorytet 2
- [ ] Integracja z prawdziwym AI (GPT/Claude)
- [ ] Sugestie autouzupełniania
- [ ] Przykłady specyficzne dla branży

### Priorytet 3
- [ ] Historia edycji z możliwością cofnięcia
- [ ] Eksport analizy do PDF
- [ ] Porównanie z podobnymi wypadkami

---

## Wsparcie dla Użytkownika

### Wskazówka w UI
Niebieskie info box z listą 6 kluczowych elementów:
```
💡 Wskazówka: Dobry opis powinien zawierać:
• Kiedy dokładnie doszło do wypadku
• Gdzie dokładnie miało miejsce zdarzenie
• Co robiła osoba poszkodowana
• Jak przebiegał wypadek krok po kroku
• Co było przyczyną wypadku
• Jakie były skutki (urazy)
```

### Placeholder
Zawiera pełny przykład doskonałego opisu wypadku

---

**Data utworzenia**: 6 grudnia 2025  
**Wersja**: 1.0  
**Status**: ✅ Produkcyjny  
**Testy**: Zaleca się testowanie z różnymi scenariuszami wypadków
