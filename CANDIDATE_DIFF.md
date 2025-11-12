CANDIDATE DIFF — safe, reviewable changes (preview only)

Summary
-------
This file lists the exact edits I propose to reduce console noise and remove leftover swipe comments and commented-out logs in `index.html`. I will not change source files until you review and approve these edits. After approval I will apply them in small commits, run quick smoke checks, and push.

Change rules (global)
---------------------
- Convert general-purpose diagnostic logs (progress/status/info) from `console.log(...)` to `log.debug(...)`.
  - Rationale: `log.debug` is gated by the existing `log` wrapper and will only print when `CONFIG.debug` is true.
- Convert explicit error/exception logs (catch blocks or failures) from `console.log('... error ...', e)` to `log.error(...)`.
  - Rationale: error logs should be visible even when debug is off.
- Keep a small set of high-level summary logs (like final scores) as `log.game(...)` where appropriate.
- Replace commented-out `console.log(...)` lines with a short annotated comment: `// (commented) original log removed during cleanup`.
  - Rationale: preserves context while reducing file clutter.
- Delete duplicate `/* Swipe gestures removed ... */` commentary lines; keep a single canonical comment near gesture-init area.

Representative replacements (these are examples; I will apply them throughout but show a selection for review)
---------------------------------
1) Status/progress log
- OLD:
    console.log(`📊 Mevcut soru sayısı: ${dinleQuestionCount}/${DINLE_MAX_QUESTIONS}`);
- NEW:
    log.debug(`📊 Mevcut soru sayısı: ${dinleQuestionCount}/${DINLE_MAX_QUESTIONS}`);

2) UI update messages
- OLD:
    console.log(`🎨 UI güncelleniyor...`);
- NEW:
    log.debug(`🎨 UI güncelleniyor...`);

3) Try/catch error log
- OLD:
    } catch(e) { console.log('localStorage failed:', e); }
- NEW:
    } catch(e) { log.error('localStorage failed:', e); }

4) Final game summary -> keep but route through game logger
- OLD:
    console.log(`📊 Final session skorları: sessionScore=${sessionScore}, sessionCorrect=${sessionCorrect}, sessionWrong=${sessionWrong}`);
- NEW:
    log.game(`📊 Final session skorları: sessionScore=${sessionScore}, sessionCorrect=${sessionCorrect}, sessionWrong=${sessionWrong}`);

5) Commented-out lines
- OLD:
    // console.log('old debug info:', obj);
- NEW:
    // (commented) removed during cleanup: original console.log('old debug info:', obj);

6) Duplicate swipe comment removal
- Remove repeated comments such as
    /* Swipe gestures removed per user request */
  and keep one canonical comment near gesture init code labelled `/* gestures removed */`.

Scope & safety notes
--------------------
- I will only change `index.html` (the single-file SPA) in this sweep.
- I will NOT remove or rename the `log` object or the `CONFIG` gate. The `console.log` gate remains as fallback.
- I will not touch logic, event wiring, or UI layout in this patch — only logging statements and purely-comment edits.
- Each logical area (e.g., Dinle, Kelime, Bosluk, streak/daily tasks, persistence cleanup) will be updated in its own small commit with a one-line message.

Proposed commit plan
--------------------
1) chore(logs): convert progress/info console.log -> log.debug (Dinle & Kelime blocks)
2) chore(logs): convert error console.log -> log.error (persistence & try/catch areas)
3) chore(logs): convert final/game logs -> log.game where appropriate
4) chore(cleanup): remove duplicated swipe comments and prune commented console.logs

Next steps after your approval
-----------------------------
- I will apply the patches in the order above, run a quick smoke check of game flows (Kelime, Dinle, Bosluk), and report any issues.
- I'll remind you to unregister the service worker in the browser (or use DevTools "Disable cache" while DevTools is open) before testing so you see fresh assets.

If you want any specific sections to be excluded from the sweep (for example: keep all logs in the `streak` code), tell me which ones and I'll leave them untouched.

— End of candidate diff preview —
