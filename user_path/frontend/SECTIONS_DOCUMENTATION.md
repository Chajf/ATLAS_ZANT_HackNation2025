# ZANT - Kompletna Dokumentacja Formularza

## Przegląd wszystkich sekcji

### Sekcja 1: Dane osoby poszkodowanej ✅
**Status**: Zawsze wyświetlana  
**Pola wymagane**: PESEL, dokument, imię, nazwisko, data urodzenia, miejsce urodzenia, adres  
**Pola opcjonalne**: Telefon, numer lokalu

**Logika warunkowa**:
- Jeśli `country !== 'Polska'` → Pokaż Sekcję 2
- Jeśli `isCorrespondenceAddress === 'Nie'` → Pokaż Sekcję 3

---

### Sekcja 2: Adres w Polsce ⚠️
**Status**: WARUNKOWA (tylko dla osób mieszkających za granicą)  
**Warunek**: `formData.country && formData.country !== 'Polska'`  
**Pola wymagane**: Ulica, numer domu, kod pocztowy, miejscowość  
**Pola opcjonalne**: Numer lokalu

**Logika warunkowa**:
- Jeśli `isLastPolandCorrespondenceAddress === 'Nie'` → Pokaż Sekcję 3

---

### Sekcja 3: Adres korespondencyjny poszkodowanego ⚠️
**Status**: WARUNKOWA  
**Warunek**: `isCorrespondenceAddress === 'Nie'` LUB `isLastPolandCorrespondenceAddress === 'Nie'`  
**Pola wymagane**: Zależą od wybranego sposobu korespondencji

**Rodzaje korespondencji**:
1. **Adres** - pełny adres z ulicą i numerami
2. **Poste restante** - kod pocztowy i nazwa placówki
3. **Skrytka pocztowa** - ulica, numer skrytki, kod pocztowy placówki
4. **Przegródka pocztowa** - ulica, numer przegródki, kod pocztowy placówki

---

### Sekcja 4: Pozarolnicza działalność ✅
**Status**: Zawsze wyświetlana  
**Pole główne**: `hasBusinessActivity` (Tak/Nie)  

**Logika warunkowa**:
- Jeśli `hasBusinessActivity === 'Tak'` → Pokaż pola adresowe
  - Wymagane: Ulica, numer domu, kod pocztowy, miejscowość
  - Opcjonalne: Numer lokalu, telefon

---

### Sekcja 5: Umowa uaktywniająca ✅
**Status**: Zawsze wyświetlana  
**Pole główne**: `isNanny` (Tak/Nie)

**Logika warunkowa**:
- Jeśli `isNanny === 'Tak'` → Pokaż pola adresowe
  - Wymagane: Ulica, numer domu, kod pocztowy, miejscowość
  - Opcjonalne: Numer lokalu, telefon

---

### Sekcja 6: Dane osoby zawiadamiającej 🔵
**Status**: Zawsze wyświetlana, ale OPCJONALNA  
**Uwaga**: "Wypełnij tylko jeśli jesteś inną osobą niż poszkodowany"

**Pola**: Analogiczne do Sekcji 1 (wszystkie opcjonalne)
- PESEL, dokument, imię, nazwisko, data urodzenia
- Telefon, pełny adres
- Pytanie o adres korespondencyjny

**Logika warunkowa**:
- Jeśli wypełniono jakiekolwiek dane I `notifierCountry !== 'Polska'` → Pokaż adres w Polsce
- Jeśli wypełniono dane I `isNotifierCorrespondenceAddress === 'Nie'` → Pokaż Sekcję 7

---

### Sekcja 7: Adres korespondencyjny osoby zawiadamiającej ⚠️
**Status**: WARUNKOWA  
**Warunek**: Wypełniono Sekcję 6 I wskazano inny adres korespondencyjny

Analogiczna do Sekcji 3 - 4 rodzaje korespondencji

---

### Sekcja 8: Informacja o wypadku ✅
**Status**: Zawsze wyświetlana  
**Najważniejsza sekcja** - szczegółowe informacje o wypadku

**Pola wymagane**:
- Data i godzina wypadku
- Miejsce wypadku
- Planowane godziny pracy (start i koniec)
- Rodzaj urazów (textarea)
- Szczegółowy opis wypadku (textarea)
- Czy była pierwsza pomoc (Tak/Nie)
- Organ prowadzący postępowanie
- Czy były maszyny/urządzenia (Tak/Nie)

**Logika warunkowa**:
- Jeśli `wasFirstAidGiven === 'Tak'` → Wymagana nazwa i adres placówki zdrowia
- Jeśli `wasMachineryInvolved === 'Tak'` → Wymagane:
  - Opis stanu maszyny
  - Czy ma atest (Tak/Nie)
  - Czy jest w ewidencji (Tak/Nie)

---

### Sekcja 9: Świadkowie wypadku 🔵
**Status**: Zawsze wyświetlana, pola OPCJONALNE  
**Limit**: Maksymalnie 3 świadków

**Dla każdego świadka** (wszystkie pola opcjonalne):
- Imię, nazwisko
- Pełny adres (ulica, numery, kod pocztowy, miejscowość)
- Państwo (jeśli inne niż Polska)

**Dane przechowywane jako obiekty**: `witness1`, `witness2`, `witness3`

---

### Sekcja 10: Załączniki ✅
**Status**: Zawsze wyświetlana, wszystkie pola OPCJONALNE

**Checkboxy standardowych załączników**:
- ☑️ Karta informacyjna ze szpitala
- ☑️ Postanowienie prokuratury
- ☑️ Dokumenty w przypadku zgonu
- ☑️ Dokumenty potwierdzające prawo do karty

**Dodatkowe pola**:
- Inne dokumenty (textarea)
- Data dostarczenia dokumentów
- 8 pól na nazwy dokumentów do dostarczenia później

---

### Sekcja 11: Sposób odbioru i oświadczenie ✅
**Status**: Zawsze wyświetlana  
**Ostatnia sekcja przed podsumowaniem**

**Pola wymagane**:
- Sposób odbioru odpowiedzi (radio buttons):
  - W placówce ZUS
  - Pocztą
  - Przez PUE ZUS
- Data złożenia oświadczenia

**Oświadczenie**: "Oświadczam, że dane zawarte w zawiadomieniu podaję zgodnie z prawdą"

---

### Sekcja Podsumowania 🎯
**Status**: Zawsze wyświetlana na końcu  
**Funkcje**:
- Wyświetla kompletne podsumowanie wszystkich danych
- Pogrupowane według sekcji
- Przycisk "Pobierz dane (JSON)"
- Przycisk "Wstecz" do edycji

---

## Przepływ formularza

```
START
  ↓
[1] Dane poszkodowanego
  ↓
[2] Adres w Polsce? ← (jeśli mieszka za granicą)
  ↓
[3] Adres korespondencyjny? ← (jeśli różny od zamieszkania)
  ↓
[4] Działalność gospodarcza
  ↓
[5] Praca jako niania
  ↓
[6] Osoba zawiadamiająca (opcjonalna)
  ↓
[7] Adres koresp. zawiadamiającego? ← (jeśli wypełniono [6])
  ↓
[8] Informacja o wypadku ⭐ (najważniejsza)
  ↓
[9] Świadkowie (opcjonalni)
  ↓
[10] Załączniki (opcjonalne)
  ↓
[11] Sposób odbioru i oświadczenie
  ↓
[PODSUMOWANIE] → Pobierz JSON → Koniec
```

---

## Kluczowe Cechy Implementacji

### 1. Inteligentny Routing Sekcji
Aplikacja dynamicznie oblicza, które sekcje pokazać:
```javascript
let sectionNumber = 1;
// Zawsze pokazuj sekcję 1
// Warunkowo pokazuj sekcję 2 (jeśli za granicą)
// Warunkowo pokazuj sekcję 3 (jeśli inny adres koresp.)
// Zawsze pokazuj sekcje 4-6
// Warunkowo pokazuj sekcję 7 (jeśli wypełniono 6)
// Zawsze pokazuj sekcje 8-11
// Zawsze pokazuj podsumowanie
```

### 2. Walidacja na Poziomie Sekcji
Każda sekcja ma własną funkcję `isFormValid()`:
- Sprawdza wymagane pola
- Uwzględnia logikę warunkową
- Blokuje przejście dalej jeśli dane niekompletne

### 3. Pasek Postępu
Dynamicznie obliczany na podstawie:
- Liczby sekcji zawsze wyświetlanych (6)
- Liczby sekcji warunkowych (4 max)
- Sekcji podsumowania

### 4. Przechowywanie Danych
- Wszystkie dane w jednym obiekcie `formData`
- Ponad 100 kluczy dla różnych pól
- Obiekty dla świadków (`witness1`, `witness2`, `witness3`)
- Tablica dla dokumentów (`additionalDocuments`)

---

## Statystyki Implementacji

| Kategoria | Wartość |
|-----------|---------|
| Sekcje główne | 11 |
| Sekcje warunkowe | 4 |
| Całkowita liczba pól | 100+ |
| Komponenty React | 12 |
| Linie kodu (total) | ~2500 |
| Pola z walidacją | ~60 |
| Pola opcjonalne | ~40 |
| Tekstarea fields | 6 |
| Radio button groups | 12 |
| Checkboxy | 4 |
| Date pickers | 5 |
| Time pickers | 3 |

---

## Rekomendacje dla Dalszego Rozwoju

### Priorytet 1 - Backend Integration
1. API endpoint do generowania PDF
2. Endpoint do zapisywania draftu
3. Endpoint do pobierania zapisanych danych

### Priorytet 2 - UX Improvements
1. Auto-save co 30 sekund
2. Tooltips z pomocą dla każdego pola
3. Przykładowe wartości w placeholderach
4. Walidacja formatu (PESEL, kod pocztowy)

### Priorytet 3 - Features
1. Podgląd PDF przed wysłaniem
2. Możliwość dodania więcej niż 3 świadków
3. Upload plików jako załączniki
4. Historia zmian w formularzu

---

## Konfiguracja dla Backendu

### Endpoint Suggestions

```javascript
// POST /api/accident-report
// Body: formData (JSON)
// Response: { id, pdfUrl, status }

// POST /api/accident-report/draft
// Body: formData (JSON)
// Response: { draftId, savedAt }

// GET /api/accident-report/draft/:id
// Response: formData (JSON)

// POST /api/accident-report/:id/pdf
// Response: PDF file (binary)
```

### Mapowanie danych do PDF
Wszystkie klucze w `formData` są zaprojektowane tak, aby odpowiadały polom w dokumencie PDF ZUS.

---

**Dokument przygotowany**: 6 grudnia 2025  
**Projekt**: ATLAS_ZANT_HackNation2025  
**Status**: Kompletna implementacja wszystkich 11 sekcji ✅
