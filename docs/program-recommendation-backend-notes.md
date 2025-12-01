**Program Recommendation Backend Notes**

**Endpoint Path**:
- `POST /api/recommendations`

**Request Format** (JSON):
- `qualification_type`: string (e.g. `foundation`, `a_level`, `ib`, `ausmat_atar`, `highschool_other`)
- `overall_result_raw`: string (free text, e.g. `3.75`, `AAB`, `ATAR 85`)
- `result_numeric`: number (optional, parsed numeric result when possible)
- `stream_type`: string (e.g. `science_technical`, `business`, `arts_social`, `language`, `mixed_unknown`)
- `subject_flags`: object with booleans: `has_math`, `has_two_science`, `has_cs_subject`, `has_foreign_language`
- `english_test_type`: string (e.g. `muet`, `ielts`, `toefl_ibt`, `pte`, `cambridge`, `none`)
- `english_score`: number (score/band for chosen English test)
- `preferred_fields`: array of strings (e.g. `['computing_it','business_econ']`)
- `sports_involvement`: string `yes`/`no`
- `ok_for_interview_portfolio`: string `yes`/`no`
- `budget_per_year`: number (optional)

**Response Format** (JSON array of top programmes):
Each item contains:
- `programme_code`, `programme_name`, `faculty`, `field_group`
- `tuition_total`, `tuition_per_year` (when available)
- `score_total`: number between 0 and 1 (higher is better)
- `score_breakdown`: object with component scores (each 0..1):
  - `academic_fit`, `interest_fit`, `stream_fit`, `subject_fit`, `english_fit`, `financial_fit`, `sports_fit`, `interview_fit`

**Separation Between Layers**:
- Rule-based filtering layer:
  - Loads `data/ProgramRequirements_names_skeleton_v2.csv` and normalizes programme rows.
  - Pure functions implemented: `meetsAcademicRequirement(user, programme)`, `meetsEnglishRequirement(user, programme)`, `meetsHardSpecialRequirements(user, programme)`.
  - These enforce hard minima (when available) and hard flags such as `requires_sports_background`.
- AI ranking (scoring) layer:
  - After filtering, the system computes an explainable feature vector (`computeFeatureVector`) with normalized features in [0,1].
  - Features are deterministic formulas (no external ML libraries) and are easy to inspect.

**Scoring Formula**:
- Linear weighted model (deterministic):
  - `score_total = 0.30*academic_fit + 0.25*interest_fit + 0.10*stream_fit + 0.10*subject_fit + 0.10*english_fit + 0.10*financial_fit + 0.025*sports_fit + 0.025*interview_fit`
- All component scores are normalized to [0,1] using simple arithmetic (e.g. surplus over required minimum divided by range).

**Frontend Behaviour**:
- The frontend page `frontend/pages/program-recommendation.html` and script `frontend/scripts/program-recommendation.js`:
  - Collect user inputs and send a JSON payload to `POST /api/recommendations` (includes `result_numeric` when derivable).
  - Receives a ranked list and displays:
    - Programme name and faculty
    - Overall AI Match as a percentage (score_total * 100)
    - A clear table showing the component breakdown (academic, interest, stream, subject, english, financial, sports, interview)

**Notes & Assumptions**:
- The CSV parsing is a simple, robust parser that treats `TRUE`/`FALSE` and numeric/percent values; it's not a full CSV library but is sufficient for the provided dataset format.
- Where programme minima are missing, the system uses conservative defaults (allows the programme but gives neutral to slightly positive component scores).
- The implementation is intentionally deterministic and explainable for FYP reporting and auditing.

**Files changed/added**:
- `controllers/recommendationController.js` — new CSV-based filtering and scoring implementation
- `frontend/scripts/program-recommendation.js` — adds `result_numeric` and renders detailed breakdown
- `docs/program-recommendation-backend-notes.md` — this summary

If you want, I can now:
- Run a quick local smoke test (start the server) and simulate a sample request.
- Improve numeric parsing for A-Level bands or other non-numeric entries if you have a mapping.
