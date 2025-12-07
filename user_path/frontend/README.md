# ZANT - Zgłoszenie Wypadku przy Pracy (Work Accident Notification Tool)

## Opis projektu

ZANT to zaawansowana aplikacja webowa stworzona w React do wypełniania kompleksowych formularzy zgłoszenia wypadku przy pracy dla polskiej dokumentacji ZUS. Aplikacja prowadzi użytkownika krok po kroku przez cały proces wypełniania formularza, przechowując wszystkie dane pod konkretnymi kluczami, które mogą być później wykorzystane do wygenerowania wypełnionego dokumentu PDF.

## Funkcjonalności

### ✅ Zaimplementowane - Pełna wersja (11 sekcji)

- **Wieloetapowy formularz** - kompleksowy formularz podzielony na 11 logicznych sekcji z inteligentną walidacją

#### **Część 1: Dane osoby poszkodowanej**
  - PESEL
  - Rodzaj, seria i numer dokumentu tożsamości (Dowód osobisty/Paszport/Prawo jazdy)
  - Imię i nazwisko
  - Data i miejsce urodzenia
  - Numer telefonu (pole opcjonalne)
  - Pełny adres zamieszkania (ulica, numer domu, lokalu, kod pocztowy, miejscowość, państwo)
  - Opcja wyboru adresu korespondencyjnego

#### **Część 2: Adres ostatniego miejsca zamieszkania w Polsce** *(warunkowa)*
  - Wyświetlana tylko gdy osoba mieszka za granicą
  - Pełny adres w Polsce
  - Informacja o adresie korespondencyjnym

#### **Część 3: Adres do korespondencji osoby poszkodowanej** *(warunkowa)*
  - Wyświetlana gdy adres jest inny niż zamieszkania
  - Wybór sposobu korespondencji:
    - Adres zwykły
    - Poste restante
    - Skrytka pocztowa
    - Przegródka pocztowa
  - Dynamiczne pola w zależności od wybranego sposobu

#### **Część 4: Pozarolnicza działalność**
  - Pytanie o prowadzenie działalności gospodarczej
  - Warunkowe pola adresowe dla miejsca prowadzenia działalności
  - Numer telefonu (opcjonalny)

#### **Część 5: Umowa uaktywniająca**
  - Pytanie o pracę jako niania
  - Warunkowe pola adresowe miejsca sprawowania opieki nad dzieckiem
  - Numer telefonu (opcjonalny)

#### **Część 6: Dane osoby zawiadamiającej o wypadku** *(opcjonalna)*
  - Kompletne dane osobowe (analogiczne do sekcji 1)
  - Wszystkie pola opcjonalne - sekcja może być pominięta
  - Obsługa adresu w Polsce dla osób mieszkających za granicą

#### **Część 7: Adres do korespondencji osoby zawiadamiającej** *(warunkowa)*
  - Analogiczna do sekcji 3
  - Wyświetlana tylko gdy wypełniono sekcję 6 i wskazano inny adres korespondencyjny

#### **Część 8: Informacja o wypadku**
  - Data i godzina wypadku
  - Miejsce wypadku
  - Planowane godziny pracy
  - Rodzaj doznanych urazów (textarea)
  - Szczegółowy opis okoliczności wypadku (textarea)
  - Informacje o pierwszej pomocy medycznej
  - Organ prowadzący postępowanie
  - Szczegółowe informacje o maszynach/urządzeniach (warunkowe):
    - Stan techniczny maszyny
    - Atest/deklaracja zgodności
    - Wpis do ewidencji środków trwałych

#### **Część 9: Dane świadków wypadku** *(opcjonalna)*
  - Możliwość dodania do 3 świadków
  - Dla każdego świadka: imię, nazwisko, pełny adres
  - Wszystkie pola opcjonalne

#### **Część 10: Załączniki**
  - Checkboxy dla standardowych załączników:
    - Karta informacyjna ze szpitala
    - Postanowienie prokuratury
    - Dokumenty w przypadku zgonu
    - Dokumenty potwierdzające prawo do wydania karty
  - Pole na inne dokumenty
  - Lista dokumentów do dostarczenia później (8 pól)
  - Data zobowiązania do dostarczenia dokumentów

#### **Część 11: Sposób odbioru odpowiedzi i oświadczenie**
  - Wybór sposobu odbioru:
    - W placówce ZUS
    - Pocztą
    - Przez PUE ZUS
  - Oświadczenie o prawdziwości danych
  - Data złożenia oświadczenia

#### **Sekcja końcowa: Podsumowanie**
  - Kompletne podsumowanie wszystkich wprowadzonych danych
  - Eksport danych do formatu JSON
  - Przygotowane dane do generowania PDF

### 🎨 Kluczowe cechy techniczne

✅ **Inteligentna warunkowa logika** - sekcje wyświetlają się tylko gdy są potrzebne  
✅ **Kompleksowa walidacja** - wszystkie wymagane pola są sprawdzane przed przejściem dalej  
✅ **Dynamiczny pasek postępu** - uwzględnia warunkowe sekcje  
✅ **Responsywny design** - w pełni funkcjonalny na wszystkich urządzeniach  
✅ **Struktura danych gotowa do PDF** - wszystkie dane przechowywane pod konkretnymi kluczami  
✅ **Eksport JSON** - możliwość pobrania danych do dalszego przetwarzania  
✅ **Przyjazny interfejs** - intuicyjna nawigacja z przyciskami Wstecz/Dalej  
✅ **Informacje kontekstowe** - podpowiedzi i instrukcje dla użytkownika  
✅ **Obsługa textarea** - wieloliniowe pola dla szczegółowych opisów  
✅ **Obsługa dat i godzin** - dedykowane kontrolki dla danych czasowych

## Struktura danych

Wszystkie dane formularza są przechowywane w stanie React. Pełna struktura obejmuje ponad 100 pól pogrupowanych w sekcje:

```javascript
{
  // Część 1 - Dane osoby poszkodowanej
  pesel, documentType, documentSeries, documentNumber,
  firstName, lastName, birthDate, birthPlace, phoneNumber,
  street, houseNumber, apartmentNumber, postalCode, city,
  country, isCorrespondenceAddress,
  
  // Część 2 - Adres w Polsce (warunkowa)
  lastPolandStreet, lastPolandHouseNumber, lastPolandApartmentNumber,
  lastPolandPostalCode, lastPolandCity, isLastPolandCorrespondenceAddress,
  
  // Część 3 - Adres korespondencyjny (warunkowa)
  correspondenceType, corrStreet, corrHouseNumber, corrApartmentNumber,
  corrPostalCode, corrCity, corrCountry,
  
  // Część 4 - Działalność gospodarcza
  hasBusinessActivity, businessStreet, businessHouseNumber,
  businessApartmentNumber, businessPostalCode, businessCity, businessPhoneNumber,
  
  // Część 5 - Umowa uaktywniająca
  isNanny, childcareStreet, childcareHouseNumber, childcareApartmentNumber,
  childcarePostalCode, childcareCity, childcarePhoneNumber,
  
  // Część 6 - Osoba zawiadamiająca (opcjonalna)
  notifierPesel, notifierDocumentType, notifierDocumentSeries, notifierDocumentNumber,
  notifierFirstName, notifierLastName, notifierBirthDate, notifierPhoneNumber,
  notifierStreet, notifierHouseNumber, notifierApartmentNumber,
  notifierPostalCode, notifierCity, notifierCountry,
  isNotifierCorrespondenceAddress, notifierLastPoland[...],
  isNotifierLastPolandCorrespondenceAddress,
  
  // Część 7 - Adres korespondencyjny osoby zawiadamiającej (warunkowa)
  notifierCorrType, notifierCorrStreet, notifierCorrHouseNumber,
  notifierCorrApartmentNumber, notifierCorrPostalCode, notifierCorrCity,
  notifierCorrCountry,
  
  // Część 8 - Informacja o wypadku
  accidentDate, accidentTime, accidentLocation,
  plannedStartTime, plannedEndTime, injuryType, accidentDescription,
  wasFirstAidGiven, healthFacilityInfo, investigatingAuthority,
  wasMachineryInvolved, machineryCondition,
  hasCertification, isInInventory,
  
  // Część 9 - Świadkowie (obiekty)
  witness1: { firstName, lastName, street, houseNumber, apartmentNumber,
              postalCode, city, country },
  witness2: { ... },
  witness3: { ... },
  
  // Część 10 - Załączniki
  attachHospitalCard, attachProsecutorDecision,
  attachDeathCertificate, attachRightToIssueCard,
  otherAttachments, documentsDeliveryDate,
  additionalDocuments: [8 elementów],
  
  // Część 11 - Sposób odbioru i oświadczenie
  responseMethod, declarationDate
}
```

## Instalacja i uruchomienie

### Wymagania
- Node.js (v14 lub nowszy)
- npm

### Kroki instalacji

1. Przejdź do katalogu frontend:
```bash
cd frontend
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację w trybie deweloperskim:
```bash
npm start
```

Aplikacja otworzy się automatycznie w przeglądarce pod adresem [http://localhost:3000](http://localhost:3000)

## Struktura projektu

```
frontend/
├── public/
│   └── index.html          # Główny plik HTML
├── src/
│   ├── components/
│   │   ├── Section1.js     # Część 1: Dane osobowe
│   │   ├── Section2.js     # Część 2: Adres w Polsce
│   │   ├── Section3.js     # Część 3: Adres korespondencyjny
│   │   └── FeedbackSection.js  # Sekcja podsumowania
│   ├── App.js              # Główny komponent aplikacji
│   ├── App.css             # Style aplikacji
│   └── index.js            # Punkt wejścia aplikacji
└── package.json            # Zależności projektu
```

## Integracja z backendem

Dane z formularza są eksportowane w formacie JSON, co umożliwia łatwą integrację z systemem backendowym do generowania dokumentów PDF. Struktura danych jest zaprojektowana tak, aby wszystkie klucze odpowiadały polom w finalnym dokumencie PDF.

### Przykład integracji

```javascript
// W komponencie FeedbackSection można dodać wywołanie API:
const handleSubmit = async () => {
  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    const blob = await response.blob();
    // Pobierz PDF
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
```

## Statystyki projektu

- **Liczba sekcji**: 11 głównych + sekcja podsumowania
- **Liczba pól formularza**: Ponad 100 pól danych
- **Sekcje warunkowe**: 4 (automatycznie pokazywane/ukrywane)
- **Komponenty React**: 12 (11 sekcji + podsumowanie)
- **Linie kodu**: ~2500+ linii (komponenty + style)

## Roadmap - Przyszłe ulepszenia

- [ ] Integracja z API do generowania PDF
- [ ] Zapisywanie draftu w localStorage (auto-save)
- [ ] Możliwość wgrania zapisanych danych
- [ ] Wielojęzyczność (EN/PL)
- [ ] Dodanie tooltipów pomocy dla każdego pola
- [ ] Podpis elektroniczny
- [ ] Eksport do różnych formatów (PDF, XML, CSV)
- [ ] Panel administratora do zarządzania zgłoszeniami
- [ ] Powiadomienia email o statusie zgłoszenia
- [ ] Integracja z systemem ZUS przez API

## Technologie

- **React 18.2.0** - biblioteka do budowania interfejsu użytkownika
- **React Scripts 5.0.1** - narzędzia do budowania aplikacji React
- **CSS3** - stylowanie z gradientami i animacjami

## Autor

Projekt ATLAS ZANT - HackNation2025

## Licencja

[Do określenia]
