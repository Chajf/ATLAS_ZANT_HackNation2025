# ZANT - Quick Reference Guide

## 🚀 Uruchomienie Aplikacji

```bash
cd frontend
npm install      # Tylko przy pierwszym uruchomieniu
npm start        # Uruchom serwer deweloperski
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000**

---

## 📋 Struktura Sekcji - Szybki Przegląd

| # | Sekcja | Status | Warunek wyświetlenia |
|---|--------|--------|----------------------|
| 1 | Dane poszkodowanego | ✅ Zawsze | - |
| 2 | Adres w Polsce | ⚠️ Warunkowa | Jeśli mieszka za granicą |
| 3 | Adres koresp. poszkodowanego | ⚠️ Warunkowa | Jeśli różny adres |
| 4 | Działalność gospodarcza | ✅ Zawsze | - |
| 5 | Praca jako niania | ✅ Zawsze | - |
| 6 | Osoba zawiadamiająca | 🔵 Opcjonalna | - |
| 7 | Adres koresp. zawiadamiającego | ⚠️ Warunkowa | Jeśli wypełniono sek. 6 |
| 8 | Informacja o wypadku | ✅ Zawsze | - |
| 9 | Świadkowie | 🔵 Opcjonalna | - |
| 10 | Załączniki | 🔵 Opcjonalna | - |
| 11 | Sposób odbioru | ✅ Zawsze | - |
| 📊 | Podsumowanie | ✅ Zawsze | - |

**Legenda:**
- ✅ = Zawsze wyświetlana, pola wymagane
- 🔵 = Zawsze wyświetlana, pola opcjonalne
- ⚠️ = Warunkowa - pokazuje się tylko w określonych przypadkach

---

## 🔑 Kluczowe Pola Formularza

### Sekcja 1 - Wymagane minimum
```
✓ PESEL
✓ Dokument tożsamości (typ i numer)
✓ Imię i nazwisko
✓ Data i miejsce urodzenia
✓ Adres (ulica, nr domu, kod pocztowy, miejscowość)
```

### Sekcja 8 - Wymagane minimum (Najważniejsza!)
```
✓ Data i godzina wypadku
✓ Miejsce wypadku
✓ Planowane godziny pracy
✓ Rodzaj urazów
✓ Szczegółowy opis wypadku
✓ Czy była pierwsza pomoc (Tak/Nie)
✓ Organ prowadzący postępowanie
✓ Czy były maszyny/urządzenia (Tak/Nie)
```

### Sekcja 11 - Wymagane minimum
```
✓ Sposób odbioru odpowiedzi
✓ Data złożenia oświadczenia
```

---

## 🎯 Scenariusze Użycia

### Scenariusz 1: Podstawowe zgłoszenie (minimum sekcji)
**Użytkownik**: Poszkodowany mieszkający w Polsce  
**Sekcje do wypełnienia**: 1, 4, 5, 6 (pomijamy), 8, 9 (pomijamy), 10 (pomijamy), 11  
**Czas wypełnienia**: ~5-7 minut

**Przepływ**:
1. Wypełnij dane osobowe (Sekcja 1)
2. Zaznacz "Tak" dla adresu korespondencyjnego → Sekcja 3 nie pojawi się
3. Odpowiedz "Nie" na działalność (Sekcja 4) → Przejdź dalej
4. Odpowiedz "Nie" na nianię (Sekcja 5) → Przejdź dalej
5. Pomiń Sekcję 6 (zostaw puste) → Sekcja 7 nie pojawi się
6. Wypełnij szczegóły wypadku (Sekcja 8)
7. Pomiń świadków (Sekcja 9)
8. Pomiń załączniki (Sekcja 10)
9. Wybierz sposób odbioru i datę (Sekcja 11)
10. Pobierz JSON w podsumowaniu

---

### Scenariusz 2: Kompleksowe zgłoszenie (wszystkie sekcje)
**Użytkownik**: Osoba mieszkająca za granicą, zgłaszana przez pełnomocnika  
**Sekcje do wypełnienia**: Wszystkie 11  
**Czas wypełnienia**: ~15-20 minut

**Przepływ**:
1. Wypełnij dane poszkodowanego (Sekcja 1), podaj państwo inne niż Polska
2. Pojawi się Sekcja 2 - wypełnij adres w Polsce
3. Zaznacz "Nie" dla adresu korespondencyjnego → Pojawi się Sekcja 3
4. Wypełnij adres korespondencyjny (Sekcja 3)
5. Wypełnij informacje o działalności (Sekcja 4) jeśli dotyczy
6. Wypełnij informacje o pracy jako niania (Sekcja 5) jeśli dotyczy
7. Wypełnij dane pełnomocnika (Sekcja 6)
8. Jeśli pełnomocnik ma inny adres koresp. → Pojawi się Sekcja 7
9. Szczegółowo opisz wypadek (Sekcja 8)
10. Dodaj świadków (Sekcja 9) - do 3 osób
11. Zaznacz załączniki (Sekcja 10)
12. Wybierz sposób odbioru (Sekcja 11)
13. Sprawdź podsumowanie i pobierz JSON

---

### Scenariusz 3: Wypadek z maszynami
**Focus**: Sekcja 8 - rozszerzona o informacje o maszynach  
**Dodatkowe pola**:
- Stan maszyny/urządzenia
- Czy ma atest/deklarację zgodności
- Czy jest w ewidencji środków trwałych

**Przepływ w Sekcji 8**:
1. Wypełnij podstawowe dane o wypadku
2. Zaznacz "Tak" w pytaniu o maszyny → Pokażą się dodatkowe pola
3. Opisz stan maszyny i sposób użytkowania
4. Odpowiedz na pytania o atest i ewidencję

---

## 💾 Eksport Danych

### Format JSON
Po zakończeniu formularza dostępny jest przycisk **"Pobierz dane (JSON)"**

**Nazwa pliku**: `wypadek_przy_pracy_YYYY-MM-DD.json`

**Struktura**:
```json
{
  "pesel": "12345678901",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "accidentDate": "2025-12-01",
  "accidentDescription": "...",
  ...wszystkie pola...
}
```

---

## 🛠️ Testowanie Aplikacji

### Testy Manualne - Checklist

#### Test 1: Minimalna ścieżka
- [ ] Wypełnij tylko wymagane pola w Sekcji 1
- [ ] Zaznacz "Tak" dla adresu korespondencyjnego
- [ ] Sprawdź czy Sekcja 2 i 3 NIE pojawiają się
- [ ] Odpowiedz "Nie" na wszystkie pytania w Sekcjach 4-5
- [ ] Pomiń Sekcję 6
- [ ] Wypełnij minimum w Sekcji 8
- [ ] Pomiń Sekcje 9-10
- [ ] Wypełnij Sekcję 11
- [ ] Sprawdź podsumowanie

#### Test 2: Warunki wyświetlania
- [ ] W Sekcji 1 podaj państwo "Niemcy" → Powinna pojawić się Sekcja 2
- [ ] W Sekcji 1 zaznacz "Nie" dla adresu koresp. → Powinna pojawić się Sekcja 3
- [ ] W Sekcji 6 wypełnij dane i zaznacz "Nie" → Powinna pojawić się Sekcja 7
- [ ] W Sekcji 8 zaznacz "Tak" dla maszyn → Powinny pojawić się dodatkowe pola

#### Test 3: Walidacja
- [ ] Spróbuj przejść dalej bez wypełnienia wymaganych pól → Przycisk "Dalej" powinien być nieaktywny
- [ ] Wypełnij częściowo Sekcję 6 → Walidacja powinna wymagać wszystkich pól
- [ ] Pozostaw puste Sekcje 9-10 → Powinno pozwolić przejść dalej

#### Test 4: Nawigacja
- [ ] Przejdź przez wszystkie sekcje do przodu
- [ ] Wróć "Wstecz" przez kilka sekcji
- [ ] Sprawdź czy dane są zachowane
- [ ] Zmień wartość w Sekcji 1 aby pokazać/ukryć Sekcję 2
- [ ] Sprawdź czy pasek postępu aktualizuje się poprawnie

#### Test 5: Eksport
- [ ] Przejdź do podsumowania
- [ ] Kliknij "Pobierz dane (JSON)"
- [ ] Otwórz pobrany plik
- [ ] Sprawdź czy wszystkie dane są obecne

---

## 🐛 Znane Problemy i Rozwiązania

### Problem: Sekcja nie pojawia się pomimo spełnienia warunku
**Rozwiązanie**: Sprawdź dokładną wartość pola warunkowego (np. "Polska" vs "polska")

### Problem: Nie można przejść dalej mimo wypełnienia wszystkich pól
**Rozwiązanie**: Sprawdź console w przeglądarce (F12) dla błędów walidacji

### Problem: Dane znikają po odświeżeniu strony
**Rozwiązanie**: Obecnie brak localStorage - zaplanowane w przyszłej wersji

---

## 📱 Responsywność

Aplikacja jest w pełni responsywna:
- **Desktop**: Optymalna szerokość 800px, centrowana
- **Tablet**: Formularze w jednej kolumnie
- **Mobile**: Pełna funkcjonalność, przyciski na pełną szerokość

---

## 🎨 Personalizacja Stylu

### Kolory Główne
```css
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
White Sections: #ffffff
Info Message: #e3f2fd (niebieski)
```

### Modyfikacja w `App.css`:
- Zmień gradient w `.app-header`
- Zmień kolory przycisków w `.btn-primary`
- Dostosuj rozmiary czcionek

---

## 📞 Wsparcie

Dla pytań dotyczących:
- **Funkcjonalności**: Zobacz SECTIONS_DOCUMENTATION.md
- **API Integration**: Zobacz przykłady w README.md
- **Błędy**: Sprawdź console przeglądarki (F12)

---

**Ostatnia aktualizacja**: 6 grudnia 2025  
**Wersja**: 1.0.0 - Kompletna implementacja
