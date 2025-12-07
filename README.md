Jasne — poniżej masz **gotowy do wklejenia w README** kompletny, rozszerzony blok Markdown.
Nie używa żadnych elementów canvas, tylko czysty **Markdown**, który możesz bezpośrednio wkleić do swojego repo.

---

# ATLAS_ZANT_HackNation2025 — Rozszerzona Dokumentacja Techniczna

## 1. Wprowadzenie

System **ATLAS_ZANT_HackNation2025** został zaprojektowany jako kompletny ekosystem wspierający proces obsługi wypadków przy pracy — od zgłoszenia przez poszkodowanego pracownika, po analizę i decyzje biura.

Projekt składa się z:

* **Backendu (FastAPI)** — generowanie dokumentów PDF/DOCX, analiza opisów urazu, ekstrakcja danych, logika systemowa.
* **User Frontend (React)** — formularze i generowanie dokumentów dla pracownika.
* **Office Frontend (React)** — panel administracyjny dla pracowników biurowych.

System został zbudowany modułowo, dzięki czemu jest łatwy w rozwoju, utrzymaniu oraz wdrożeniu w środowiskach produkcyjnych.

---

## 2. Architektura Systemu

### 2.1. Architektura wysoka

```text
 ┌────────────────────────┐         ┌──────────────────────────────┐
 │      USER FRONTEND     │ <-----> │            BACKEND           │
 │        (React)         │         │   FastAPI + PDF/DOCX/AI      │
 └────────────────────────┘         └──────────────────────────────┘
                                          ↑
                                          │
 ┌────────────────────────┐               │
 │     OFFICE FRONTEND    │ <────────────┘
 │        (React)         │
 └────────────────────────┘
```

Backend pełni funkcję centralnego węzła odpowiedzialnego za generowanie dokumentów, ocenę zgłoszeń i komunikację.

---

## 3. Przepływ Danych (Workflow)

### 3.1. User Flow

1. Pracownik uruchamia aplikację User Path.
2. Wypełnia formularz zgłoszenia / wyjaśnienia.
3. Frontend wysyła dane do backendu:

   * `/generate-accident-notification` (PDF)
   * `/generate-injured-statement` (DOCX)
4. Backend:

   * waliduje dane (Pydantic),
   * wypełnia szablon PDF/DOCX,
   * odsyła strumieniowo plik.
5. Użytkownik pobiera dokument.

### 3.2. Office Flow

1. Pracownik biura otwiera dashboard Office Path.
2. Może:

   * wczytać opis urazu,
   * przeanalizować wypadek,
   * wykonać ocenę.
3. Backend realizuje:

   * analizę heurystyczną lub AI,
   * klasyfikację i ocenę ryzyka,
   * generowanie dokumentów pomocniczych.
4. Wynik jest wyświetlany w panelu.

---

## 4. Backend — Techniczne Szczegóły

### 4.1. Technologie

* **FastAPI (ASGI)**
* **Pydantic** — modele danych i walidacja
* **PyMuPDF (pymupdf)** — generowanie PDF
* **python-docx** — generowanie DOCX
* **Uvicorn** — serwer ASGI

### 4.2. Moduły

```
backend/
├── main.py            # Endpointy FastAPI
├── services.py        # Logika dokumentów PDF/DOCX
├── schemas.py         # Modele danych Pydantic
├── utils/             # Pomocnicze operacje
└── templates/         # Szablony PDF/DOCX
```

---

## 5. Modele Danych (Pydantic)

Backend wykorzystuje modele do walidacji:

* `AccidentNotificationSchema`
* `InjuryReportSchema`
* `StatementSchema`
* `EvaluationSchema`

Każde pole ma:

* typ danych,
* walidator,
* alias (snake_case → camelCase),
* wartość domyślną lub `Optional`.

Przykład:

```python
class InjuryReportSchema(BaseModel):
    firstName: str
    lastName: str
    accidentDate: date
    description: Optional[str]
```

---

## 6. Generowanie Dokumentów

### 6.1. PDF (PyMuPDF)

Proces generowania:

1. Załaduj szablon PDF.
2. Wypełnij pola metodami:

   * `insert_text`
   * `insert_textbox`
3. Zapisz wynik do `BytesIO`.
4. Zwróć w `StreamingResponse`.

Zalety:

* pełna kontrola nad pozycją tekstu,
* szybkie i lekkie generowanie,
* brak zewnętrznych zależności typu PDFtk.

---

### 6.2. DOCX (python-docx)

Proces:

1. Załaduj szablon `.docx`.
2. Znajdź placeholdery `{{placeholder}}`.
3. Wstaw wartości z requestu.
4. Zapisz i zwróć jako `BytesIO`.

Zalety:

* możliwość generowania tabel, sekcji, akapitów,
* wysoka stabilność,
* kompatybilne z Word 2007+.

---

## 7. Bezpieczeństwo Systemu

### 7.1. Walidacja

* Każdy endpoint wymusza strukturę danych (Pydantic).
* Pola niezgodne → kod 422.
* Walidacja typów i zawartości (np. daty, długość pól).

### 7.2. RODO/GDPR

* Dane są przetwarzane tylko w pamięci.
* Brak trwałego zapisu danych osobowych.
* Możliwość anonimizacji.

### 7.3. CORS

* Konfiguracja dopasowana do dwóch frontendów.
* Kontrola metod i nagłówków.

### 7.4. Hardening

* ukrywanie stacktrace,
* kontrola ścieżek do plików,
* limity wielkości uploadowanych PDF.

---

## 8. Skalowalność i Wydajność

Backend projektowano tak, aby mógł obsługiwać dużą liczbę żądań:

* FastAPI działa asynchronicznie.
* Operacje dokumentowe nie używają dysku — wszystko w RAM.
* Możliwe wdrożenie w trybie:

  * Docker,
  * Kubernetes,
  * Serverless (AWS Lambda),
  * klasyczne VPS.

Frontendy mogą być hostowane jako statyczne buildy w CDN.

---

## 9. Możliwości Rozwoju

* Podłączenie dużego modelu językowego do automatycznej interpretacji opisów urazu.
* Logowanie historii zgłoszeń.
* Eksport ZIP wielu dokumentów.
* Wersjonowanie dokumentów.
* Integracja z usługami OCR.

---

## 10. Deployment (opcjonalna sekcja)

### Docker — przykładowa struktura

```dockerfile
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
```

---

