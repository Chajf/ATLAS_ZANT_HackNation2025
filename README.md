# ATLAS_ZANT_HackNation2025 — Rozszerzona Dokumentacja Techniczna

## 1. Wprowadzenie

System **ATLAS_ZANT_HackNation2025** to kompletny ekosystem AI wspierający proces obsługi wypadków przy pracy — od zgłoszenia przez poszkodowanego pracownika, po analizę i decyzje biura ZUS.

Projekt składa się z:

* **Backendu (FastAPI + AI)** — generowanie dokumentów PDF/DOCX, analiza opisów urazu przy użyciu LLM, ekstrakcja danych, automatyczna ocena prawna wypadków.
* **User Frontend (React)** — wieloetapowe formularze z asystentem AI dla pracownika (ścieżka EWYP i wyjaśnienia poszkodowanego).
* **Office Frontend (React)** — 7-krokowy panel dla pracowników biurowych z automatyczną oceną prawną i generowaniem uzasadnień.

System wykorzystuje modele językowe (Groq API) do automatycznej oceny zgodności opisów urazu z wymogami prawnymi oraz generowania profesjonalnych uzasadnień decyzji.

---

## 2. Architektura Systemu

### 2.1. Architektura wysoka

```text
 ┌────────────────────────┐         ┌──────────────────────────────┐
 │      USER FRONTEND     │ <-----> │            BACKEND           │
 │   (React - port 3000)  │         │   FastAPI + LangChain + AI   │
 └────────────────────────┘         │        (port 8000)           │
                                    └──────────────────────────────┘
                                          ↑
                                          │ Groq API
 ┌────────────────────────┐               │ (LLM)
 │     OFFICE FRONTEND    │ <────────────┘
 │   (React - port 3001)  │
 └────────────────────────┘
```

Backend pełni funkcję centralnego węzła odpowiedzialnego za:
- Generowanie dokumentów PDF/DOCX
- Ekstrakcję danych z przesłanych dokumentów
- Ocenę opisów urazu przy użyciu AI (6 komponentów)
- Ocenę prawną wypadków (4 kryteria ustawowe)
- Automatyczne generowanie uzasadnień decyzji

---

## 3. Integracja AI / LLM

### 3.1. Wykorzystane technologie AI

| Technologia | Zastosowanie |
|-------------|--------------|
| **LangChain** | Framework do integracji z LLM |
| **LangChain-Groq** | Connector do Groq API |
| **Groq API** | Hosting modeli LLM |
| **openai/gpt-oss-20b** | Model do oceny opisów urazu |
| **llama-3.3-70b-versatile** | Model do generowania uzasadnień |

### 3.2. Funkcje AI w systemie

| Funkcja | Opis | Prompt |
|---------|------|--------|
| `evaluate_injury_description` | Ocenia opis urazu użytkownika pod kątem 6 komponentów (Kiedy, Gdzie, CoCzynił, Jak, Dlaczego, Uraz) | `injury_evaluation_prompt.txt` |
| `assess_office_accident` | Ocenia wypadek pod kątem 4 kryteriów prawnych (nagłość, przyczyna zewnętrzna, związek z pracą, uraz) | `office_assessment_prompt.txt` |
| `generate_justification` | Generuje profesjonalne uzasadnienie decyzji na podstawie oceny AI | `justification_prompt.txt` |
| `extract_pdf_data` | Ekstrakcja ustrukturyzowanych danych z PDF przy użyciu LLM | `pdf_extraction_prompt.txt` |

### 3.3. Wymagania środowiskowe

```bash
export GROQ_API_KEY="your-groq-api-key"
```

---

## 4. Przepływ Danych (Workflow)

### 4.1. User Flow — Ścieżka EWYP (11 sekcji)

1. Pracownik wybiera ścieżkę "EWYP" (formularz ZUS EWYP).
2. Wypełnia 11 sekcji formularza:
   - **Sekcja 1-7**: Dane osobowe, adresowe, działalność gospodarcza
   - **Sekcja 8**: Opis wypadku z **asystentem AI** (real-time feedback)
   - **Sekcja 9**: Dane świadków (do 3 osób)
   - **Sekcja 10-11**: Załączniki i deklaracje
3. AI na bieżąco ocenia opis wypadku pod kątem 6 komponentów:
   - ✅ **ok** — informacja kompletna
   - ⚠️ **warning** — wymaga uzupełnienia
   - ❌ **danger** — brak wymaganej informacji
4. Po zakończeniu generowany jest PDF (ZUS EWYP).

### 4.2. User Flow — Ścieżka Wyjaśnienia (4 sekcje)

1. Pracownik wybiera ścieżkę "Wyjaśnienia poszkodowanego".
2. Wypełnia 4 sekcje z danymi wypadku.
3. Generowany jest dokument DOCX.

### 4.3. Office Flow (7 kroków)

| Krok | Komponent | Opis |
|------|-----------|------|
| 1 | `FileUpload` | Upload PDF (wymagany) i DOCX (opcjonalny) |
| 2 | `CausalDiagram` | Wizualna analiza związków przyczynowych |
| 3 | `DataConsistency` | Porównanie i walidacja danych między dokumentami |
| 4 | `EligibilityAssessment` | **Ocena AI** — 4 kryteria prawne wypadku przy pracy |
| 5 | `ExplanationSection` | Wyjaśnienie decyzji AI |
| 6 | `OfficialStatement` | Formularz oświadczenia + **automatyczne uzasadnienie AI** |
| 7 | `AccidentCard` | Karta wypadku (~60 pól) + generowanie DOCX |

### 4.4. Kryteria prawne oceny wypadku

System ocenia wypadek zgodnie z **Art. 3 ust. 1 ustawy z dnia 30 października 2002 r.**:

1. **Nagłość zdarzenia** — czy zdarzenie było nagłe
2. **Przyczyna zewnętrzna** — czy istniała przyczyna zewnętrzna
3. **Związek z pracą** — czy zdarzenie było związane z pracą
4. **Uraz lub śmierć** — czy nastąpił uraz lub śmierć

---

## 5. API Endpoints

### 5.1. Kompletna lista endpointów

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/` | GET | Health check |
| `/health` | GET | Status zdrowia aplikacji |
| `/evaluate-injury` | POST | **AI**: Ocena opisu urazu (6 komponentów) |
| `/assess-workplace-accident` | POST | **AI**: Ocena prawna wypadku (4 kryteria) |
| `/upload-pdf` | POST | Upload PDF ZUS EWYP, ekstrakcja danych |
| `/upload-docx` | POST | Upload DOCX wyjaśnień, ekstrakcja danych |
| `/compare-documents` | POST | Porównanie PDF i DOCX, walidacja spójności |
| `/generate-accident-notification` | POST | Generowanie wypełnionego PDF ZUS EWYP |
| `/generate-injured-statement` | POST | Generowanie DOCX wyjaśnień poszkodowanego |
| `/generate-justification` | POST | **AI**: Generowanie uzasadnienia decyzji |
| `/generate-accident-card` | POST | Generowanie DOCX karty wypadku |

---

## 6. Backend — Techniczne Szczegóły

### 6.1. Technologie

| Technologia | Zastosowanie |
|-------------|--------------|
| **FastAPI** | Framework webowy (ASGI) |
| **Pydantic** | Walidacja danych i modele |
| **LangChain + LangChain-Groq** | Integracja z LLM |
| **PyMuPDF (fitz)** | Generowanie i ekstrakcja PDF |
| **python-docx** | Generowanie dokumentów DOCX |
| **pypdf** | Odczyt PDF |
| **Uvicorn** | Serwer ASGI |

### 6.2. Struktura projektu

```
backend/
├── main.py                        # Endpointy FastAPI
├── services.py                    # Logika AI, dokumentów, ekstrakcji
├── schemas.py                     # Modele danych Pydantic
├── requirements.txt               # Zależności Python
├── injury_evaluation_prompt.txt   # Prompt AI - ocena urazu
├── office_assessment_prompt.txt   # Prompt AI - ocena prawna
├── justification_prompt.txt       # Prompt AI - uzasadnienie
├── pdf_extraction_prompt.txt      # Prompt AI - ekstrakcja PDF
├── EWYP_wypelnij_i_wydrukuj.pdf  # Szablon PDF
└── oswiadczenie_poszkodowanego.docx # Szablon DOCX
```

---

## 7. Modele Danych (Pydantic)

### 7.1. Główne modele

| Model | Zastosowanie |
|-------|--------------|
| `WitnessInfo` | Dane świadka (osobowe i adresowe) |
| `ValidationIssue` | Problem walidacji (pole, poziom, opis) |
| `ComparisonResponse` | Odpowiedź porównania PDF/DOCX |
| `ExtractedDocxData` | Dane wyekstrahowane z DOCX |
| `ExtractedPdfData` | Dane wyekstrahowane z PDF (~100 pól) |
| `EvaluationComponent` | Pojedynczy komponent oceny (status, opis) |
| `InjuryEvaluationResult` | Wynik oceny urazu (6 komponentów) |
| `OfficeAssessmentCriterion` | Pojedyncze kryterium prawne |
| `OfficeAssessmentResult` | Wynik oceny prawnej (4 kryteria) |
| `AccidentNotificationRequest` | Request generowania PDF (~50 pól) |
| `InjuredStatementRequest` | Request generowania DOCX wyjaśnień |
| `JustificationRequest` | Request generowania uzasadnienia |
| `AccidentCardRequest` | Request generowania karty wypadku (~60 pól) |

### 7.2. Przykład modelu oceny AI

```python
class EvaluationComponent(BaseModel):
    status: Literal["ok", "warning", "danger"]
    description: str

class InjuryEvaluationResult(BaseModel):
    when: EvaluationComponent      # Kiedy
    where: EvaluationComponent     # Gdzie
    doing: EvaluationComponent     # Co czynił
    how: EvaluationComponent       # Jak doszło
    why: EvaluationComponent       # Dlaczego
    injury: EvaluationComponent    # Jaki uraz
```

---

## 8. User Frontend — Komponenty

### 8.1. Ścieżka EWYP

| Komponent | Opis |
|-----------|------|
| `Section1` | Dane osobowe poszkodowanego (PESEL, imię, nazwisko, data urodzenia) |
| `Section2` | Ostatni adres w Polsce (warunkowy) |
| `Section3` | Adres korespondencyjny (warunkowy) |
| `Section4` | Informacje o działalności gospodarczej |
| `Section5` | Informacje o pracy opiekuńczej/niani |
| `Section6` | Dane zgłaszającego (jeśli inny niż poszkodowany) |
| `Section7` | Adres korespondencyjny zgłaszającego (warunkowy) |
| `Section8` | **Opis wypadku z asystentem AI** — real-time feedback |
| `Section9` | Dane świadków (do 3 osób) |
| `Section10` | Wybór załączników |
| `Section11` | Sposób odpowiedzi i deklaracja + pobieranie PDF |

### 8.2. Ścieżka Wyjaśnienia

| Komponent | Opis |
|-----------|------|
| `ExplanationSection1` | Szczegóły wypadku (data, czas, miejsce) |
| `ExplanationSection2` | Dane osobowe |
| `ExplanationSection3` | Opis wypadku (z asystentem AI) |
| `ExplanationSection4` | Podsumowanie i pobieranie DOCX |

---

## 9. Office Frontend — Komponenty

| Komponent | Krok | Opis |
|-----------|------|------|
| `FileUpload` | 1 | Upload PDF (wymagany) i DOCX (opcjonalny) |
| `CausalDiagram` | 2 | Wizualizacja związków przyczynowych |
| `DataConsistency` | 3 | Walidacja spójności danych |
| `EligibilityAssessment` | 4 | **Ocena AI** — 4 kryteria prawne |
| `ExplanationSection` | 5 | Wyjaśnienie decyzji AI |
| `OfficialStatement` | 6 | Oświadczenie + **uzasadnienie AI** |
| `AccidentCard` | 7 | Karta wypadku (~60 pól) |

---

## 10. Generowanie Dokumentów

### 10.1. PDF (PyMuPDF)

Proces generowania formularza ZUS EWYP:

1. Załaduj szablon `EWYP_wypelnij_i_wydrukuj.pdf`
2. Wypełnij pola metodami `insert_text`, `insert_textbox`
3. Zapisz do `BytesIO`
4. Zwróć jako `StreamingResponse`

### 10.2. DOCX (python-docx)

Proces generowania dokumentów Word:

1. Załaduj szablon (np. `oswiadczenie_poszkodowanego.docx`)
2. Znajdź placeholdery `{{placeholder}}`
3. Zamień na wartości z requestu
4. Obsługa tabel (karty wypadku)
5. Zwróć jako `StreamingResponse`

---

## 11. Bezpieczeństwo Systemu

### 11.1. Walidacja danych

* Każdy endpoint wymusza strukturę danych (Pydantic)
* Pola niezgodne → kod 422 z opisem błędu
* Walidacja typów, formatów dat, długości pól

### 11.2. RODO/GDPR

* Dane przetwarzane tylko w pamięci
* Brak trwałego zapisu danych osobowych
* Prompts AI nie zawierają danych osobowych po przetworzeniu

### 11.3. CORS

* Konfiguracja dla dwóch frontendów (port 3000, 3001)
* Kontrola metod i nagłówków

---

## 12. Instalacja i Uruchomienie

### 12.1. Wymagania

* Python 3.11+
* Node.js 18+
* Klucz API Groq (`GROQ_API_KEY`)

### 12.2. Backend

```bash
cd backend
pip install -r requirements.txt
export GROQ_API_KEY="your-api-key"
uvicorn main:app --reload --port 8000
```

### 12.3. User Frontend

```bash
cd user_path/frontend
npm install
npm start  # port 3000
```

### 12.4. Office Frontend

```bash
cd office_path/frontend
npm install
npm start  # port 3001
```

---

## 13. Deployment

### 13.1. Docker — Backend

```dockerfile
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
ENV GROQ_API_KEY=""
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 13.2. docker-compose

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
  
  user-frontend:
    build: ./user_path/frontend
    ports:
      - "3000:3000"
  
  office-frontend:
    build: ./office_path/frontend
    ports:
      - "3001:3001"
```

---

## 14. Dodatkowa Dokumentacja

| Plik | Opis |
|------|------|
| `DOCX_ENDPOINT_SUMMARY.md` | Dokumentacja endpointów DOCX |
| `SETUP_PDF_ENDPOINT.md` | Instrukcja konfiguracji PDF |
| `backend/PDF_GENERATION_ENDPOINT.md` | Szczegóły generowania PDF |
| `backend/DOCX_GENERATION_ENDPOINT.md` | Szczegóły generowania DOCX |
| `user_path/frontend/AI_ASSISTANT_DOCUMENTATION.md` | Dokumentacja asystenta AI |
| `user_path/frontend/SECTIONS_DOCUMENTATION.md` | Dokumentacja sekcji formularza |
| `user_path/frontend/QUICK_REFERENCE.md` | Szybka referencja |

---

## 15. Możliwości Rozwoju

* 📊 Dashboard analityczny z statystykami zgłoszeń
* 📧 Integracja z systemem powiadomień email
* 🔐 Autoryzacja i role użytkowników
* 📁 Historia i archiwum zgłoszeń
* 🌐 Wielojęzyczność (internacjonalizacja)
* 📱 Wersja mobilna aplikacji

---

## 16. Licencja

Projekt stworzony na HackNation 2025.

